<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, slide, scale } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  import toast from 'svelte-hot-french-toast';
  import type { PromptFormData, PromptTemplate, QualityMetrics, DynamicItem, PromptGenerationOptions } from '$lib/types/prompt';
  import { PromptCategory, PromptTechnique } from '$lib/types/prompt';
  import { DEFAULT_TEMPLATES, CATEGORY_NAMES, getTemplateById } from '$lib/data/templates';
  import { PromptGenerator } from '$lib/services/promptGenerator';
  
  // 사용자 정의 템플릿 타입
  interface UserTemplate {
    id: string;
    name: string;
    data: PromptFormData;
    options: PromptGenerationOptions; // 프롬프트 옵션 추가
    createdAt: string;
  }
  
  // 상태 관리
  let formData = $state<PromptFormData>({
    who: [],
    what: [],
    when: [],
    where: [],
    why: [],
    how: [],
    templateId: 'general-basic'
  });
  
  // 사용자 정의 템플릿 상태
  let userTemplates = $state<UserTemplate[]>([]);
  let showTemplateModal = $state(false);
  let newTemplateName = $state('');
  let showUserTemplates = $state(false);
  let previewTemplate = $state<UserTemplate | null>(null);
  
  // 템플릿 편집 상태
  let isEditingTemplate = $state(false);
  let editingTemplateData = $state<PromptFormData | null>(null);
  let editingTemplateOptions = $state<PromptGenerationOptions | null>(null);
  let editingModalJustOpened = $state(false);
  
  // 통합된 프롬프트 옵션 (기존 promptOptions와 generationOptions 통합)
  let promptOptions = $state<PromptGenerationOptions>({
    technique: PromptTechnique.ZERO_SHOT,
    includeExamples: false,
    includeStepByStep: false,
    expertRole: '',
    outputFormat: 'text',
    reasoning: false,
    selfConsistency: false,
    maxTokens: 1000,
    // 고급 옵션들
    consistencyPaths: 3,
    treeDepth: 3,
    retrievalSources: [],
    chainLength: 4,
    diversityBoost: false,
    iterativeRefinement: false,
    qualityGate: 70
  });
  
  // 파생 상태로 변경하여 무한루프 방지
  let selectedTemplate = $derived(getTemplateById(formData.templateId));
  
  let hasMinimumInput = $derived(
    formData.what.length > 0 && formData.what.some(item => item.value.trim().length > 0)
  );
  
  // 실시간 생성 제거 - 일반 상태로 변경
  let generatedPrompt = $state('');
  let qualityMetrics = $state<QualityMetrics | null>(null);
  let estimatedTokens = $state(0);
  let isGenerating = $state(false);
  
  // showPreview는 generatedPrompt가 있을 때만 true
  let showPreview = $derived(generatedPrompt.length > 0);
  
  // UI 상태
  let showAdvancedOptions = $state(false);
  
  // 커스텀 select 상태
  let templateSelectOpen = $state(false);
  let techniqueSelectOpen = $state(false);
  let outputFormatSelectOpen = $state(false);
  
  // 드롭다운 위치 상태
  let templateButtonRect = $state<DOMRect | null>(null);
  let techniqueButtonRect = $state<DOMRect | null>(null);
  let outputFormatButtonRect = $state<DOMRect | null>(null);
  
  // 드롭다운 상태 관리
  let templateHoverTimeout: ReturnType<typeof setTimeout> | null = null;
  let techniqueHoverTimeout: ReturnType<typeof setTimeout> | null = null;
  let outputFormatHoverTimeout: ReturnType<typeof setTimeout> | null = null;
  
  // 드롭다운 열기 딜레이 타이머들
  let templateOpenTimeout: ReturnType<typeof setTimeout> | null = null;
  let techniqueOpenTimeout: ReturnType<typeof setTimeout> | null = null;
  let outputFormatOpenTimeout: ReturnType<typeof setTimeout> | null = null;
  
  // 드롭다운 토글 함수들
  function handleTemplateHover(event: Event) {
    // 기존 타이머들 정리
    if (templateHoverTimeout) {
      clearTimeout(templateHoverTimeout);
      templateHoverTimeout = null;
    }
    if (templateOpenTimeout) {
      clearTimeout(templateOpenTimeout);
      templateOpenTimeout = null;
    }
    
    // 버튼 요소와 위치 정보를 미리 계산
    const button = event.currentTarget as HTMLElement;
    const rect = button.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // 드롭다운 너비는 버튼 너비와 동일하게
    const dropdownWidth = rect.width;
    const dropdownHeight = 320;
    
    // 가로 위치 조정
    let left = rect.left;
    if (left + dropdownWidth > viewportWidth - 20) {
      left = viewportWidth - dropdownWidth - 20;
    }
    
    // 세로 위치 조정
    let top = rect.bottom + 8;
    let isAbove = false;
    if (top + dropdownHeight > viewportHeight - 20) {
      top = rect.top - dropdownHeight - 8;
      isAbove = true;
    }
    
    const calculatedRect = {
      ...rect,
      left: Math.max(20, left),
      top: Math.max(20, top),
      bottom: isAbove ? top + dropdownHeight : top,
      width: dropdownWidth
    };
    
    // 0.3초 후에 드롭다운 열기
    templateOpenTimeout = setTimeout(() => {
      templateButtonRect = calculatedRect;
      templateSelectOpen = true;
    }, 300); // 테스트용 짧은 딜레이
  }
  
  function handleTechniqueHover(event: Event) {
    // 기존 타이머들 정리
    if (techniqueHoverTimeout) {
      clearTimeout(techniqueHoverTimeout);
      techniqueHoverTimeout = null;
    }
    if (techniqueOpenTimeout) {
      clearTimeout(techniqueOpenTimeout);
      techniqueOpenTimeout = null;
    }
    
    // 버튼 요소와 위치 정보를 미리 계산
    const button = event.currentTarget as HTMLElement;
    const rect = button.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // 드롭다운 너비는 버튼 너비와 동일하게
    const dropdownWidth = rect.width;
    const dropdownHeight = 320;
    
    let left = rect.left;
    if (left + dropdownWidth > viewportWidth - 20) {
      left = viewportWidth - dropdownWidth - 20;
    }
    
    let top = rect.bottom + 8;
    let isAbove = false;
    if (top + dropdownHeight > viewportHeight - 20) {
      top = rect.top - dropdownHeight - 8;
      isAbove = true;
    }
    
    const calculatedRect = {
      ...rect,
      left: Math.max(20, left),
      top: Math.max(20, top),
      bottom: isAbove ? top + dropdownHeight : top,
      width: dropdownWidth
    };
    
    // 0.3초 후에 드롭다운 열기
    techniqueOpenTimeout = setTimeout(() => {
      techniqueButtonRect = calculatedRect;
      techniqueSelectOpen = true;
    }, 300); // 테스트용 짧은 딜레이
  }
  
  function handleOutputFormatHover(event: Event) {
    // 기존 타이머들 정리
    if (outputFormatHoverTimeout) {
      clearTimeout(outputFormatHoverTimeout);
      outputFormatHoverTimeout = null;
    }
    if (outputFormatOpenTimeout) {
      clearTimeout(outputFormatOpenTimeout);
      outputFormatOpenTimeout = null;
    }
    
    // 버튼 요소와 위치 정보를 미리 계산
    const button = event.currentTarget as HTMLElement;
    const rect = button.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // 드롭다운 너비는 버튼 너비와 동일하게
    const dropdownWidth = rect.width;
    const dropdownHeight = 200; // 출력 형식은 옵션이 적으므로 높이 줄임
    
    let left = rect.left;
    if (left + dropdownWidth > viewportWidth - 20) {
      left = viewportWidth - dropdownWidth - 20;
    }
    
    let top = rect.bottom + 8;
    let isAbove = false;
    if (top + dropdownHeight > viewportHeight - 20) {
      top = rect.top - dropdownHeight - 8;
      isAbove = true;
    }
    
    const calculatedRect = {
      ...rect,
      left: Math.max(20, left),
      top: Math.max(20, top),
      bottom: isAbove ? top + dropdownHeight : top,
      width: dropdownWidth
    };
    
    // 0.3초 후에 드롭다운 열기
    outputFormatOpenTimeout = setTimeout(() => {
      outputFormatButtonRect = calculatedRect;
      outputFormatSelectOpen = true;
    }, 300); // 테스트용 짧은 딜레이
  }

  // 드롭다운 닫기 함수들 (지연 처리)
  function handleTemplateLeave() {
    // 열기 타이머가 있다면 취소
    if (templateOpenTimeout) {
      clearTimeout(templateOpenTimeout);
      templateOpenTimeout = null;
    }
    
    templateHoverTimeout = setTimeout(() => {
      templateSelectOpen = false;
    }, 150); // 150ms 지연
  }

  function handleTechniqueLeave() {
    // 열기 타이머가 있다면 취소
    if (techniqueOpenTimeout) {
      clearTimeout(techniqueOpenTimeout);
      techniqueOpenTimeout = null;
    }
    
    techniqueHoverTimeout = setTimeout(() => {
      techniqueSelectOpen = false;
    }, 150);
  }

  function handleOutputFormatLeave() {
    // 열기 타이머가 있다면 취소
    if (outputFormatOpenTimeout) {
      clearTimeout(outputFormatOpenTimeout);
      outputFormatOpenTimeout = null;
    }
    
    outputFormatHoverTimeout = setTimeout(() => {
      outputFormatSelectOpen = false;
    }, 150);
  }

  // 드롭다운 영역 hover 유지 함수들
  function keepTemplateOpen() {
    if (templateHoverTimeout) {
      clearTimeout(templateHoverTimeout);
      templateHoverTimeout = null;
    }
    if (templateOpenTimeout) {
      clearTimeout(templateOpenTimeout);
      templateOpenTimeout = null;
    }
  }

  function keepTechniqueOpen() {
    if (techniqueHoverTimeout) {
      clearTimeout(techniqueHoverTimeout);
      techniqueHoverTimeout = null;
    }
    if (techniqueOpenTimeout) {
      clearTimeout(techniqueOpenTimeout);
      techniqueOpenTimeout = null;
    }
  }

  function keepOutputFormatOpen() {
    if (outputFormatHoverTimeout) {
      clearTimeout(outputFormatHoverTimeout);
      outputFormatHoverTimeout = null;
    }
    if (outputFormatOpenTimeout) {
      clearTimeout(outputFormatOpenTimeout);
      outputFormatOpenTimeout = null;
    }
  }

  // 스크롤 시 모든 드롭다운 닫기
  function closeAllDropdowns() {
    templateSelectOpen = false;
    techniqueSelectOpen = false;
    outputFormatSelectOpen = false;
    
    // 진행 중인 타이머들도 정리
    if (templateHoverTimeout) {
      clearTimeout(templateHoverTimeout);
      templateHoverTimeout = null;
    }
    if (techniqueHoverTimeout) {
      clearTimeout(techniqueHoverTimeout);
      techniqueHoverTimeout = null;
    }
    if (outputFormatHoverTimeout) {
      clearTimeout(outputFormatHoverTimeout);
      outputFormatHoverTimeout = null;
    }
    
    // 열기 타이머들도 정리
    if (templateOpenTimeout) {
      clearTimeout(templateOpenTimeout);
      templateOpenTimeout = null;
    }
    if (techniqueOpenTimeout) {
      clearTimeout(techniqueOpenTimeout);
      techniqueOpenTimeout = null;
    }
    if (outputFormatOpenTimeout) {
      clearTimeout(outputFormatOpenTimeout);
      outputFormatOpenTimeout = null;
    }
  }

  // 모달 스크롤 제어 함수들
  function disableBodyScroll() {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
  }

  function enableBodyScroll() {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
  }

  // 모든 모달 닫기
  function closeAllModals() {
    showTemplateModal = false;
    showUserTemplates = false;
    previewTemplate = null;
    enableBodyScroll();
  }

  // 편집 모달만 닫기 (미리보기 모달은 유지)
  function closeEditingModal() {
    isEditingTemplate = false;
    editingTemplateData = null;
    editingTemplateOptions = null;
    editingModalJustOpened = false;
    
    // 미리보기 모달이 열려있다면 스크롤을 잠금 상태로 유지
    if (previewTemplate) {
      // 스크롤은 이미 잠겨있으므로 그대로 유지
      // enableBodyScroll()을 호출하지 않음
    } else {
      // 미리보기 모달이 없다면 스크롤 복원
      enableBodyScroll();
    }
  }
  
  // 동적 항목 관리 함수들
  function addItem(field: keyof Omit<PromptFormData, 'templateId'>) {
    const newItem: DynamicItem = {
      id: Date.now().toString(),
      value: ''
    };
    formData[field] = [...formData[field], newItem];
    
    // 새로 추가된 항목의 textarea에 포커스 이동
    setTimeout(() => {
      const textareas = document.querySelectorAll(`textarea[data-field="${field}"]`);
      const lastTextarea = textareas[textareas.length - 1] as HTMLTextAreaElement;
      if (lastTextarea) {
        lastTextarea.focus();
      }
    }, 50);
  }
  
  function removeItem(field: keyof Omit<PromptFormData, 'templateId'>, id: string) {
    // 애니메이션 없이 즉시 제거
    formData[field] = formData[field].filter(item => item.id !== id);
  }
  
  function updateItem(field: keyof Omit<PromptFormData, 'templateId'>, id: string, value: string) {
    const index = formData[field].findIndex(item => item.id === id);
    if (index !== -1) {
      formData[field][index].value = value;
    }
  }
  
  // 예시 추가 함수 (빈 항목 우선 채우기)
  function addExample(field: keyof Omit<PromptFormData, 'templateId'>, example: string) {
    // 먼저 빈 값인 항목이 있는지 확인
    const emptyItemIndex = formData[field].findIndex(item => item.value.trim() === '');
    
    if (emptyItemIndex !== -1) {
      // 빈 항목이 있으면 그곳에 예시 값 입력
      formData[field][emptyItemIndex].value = example;
    } else {
      // 빈 항목이 없으면 새로운 항목 추가
      const newItem: DynamicItem = {
        id: Date.now().toString() + Math.random(),
        value: example
      };
      formData[field] = [...formData[field], newItem];
    }
  }
  
  // LocalStorage 관련 함수들
  function loadUserTemplates() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('promptTemplates');
      if (saved) {
        try {
          userTemplates = JSON.parse(saved);
        } catch (e) {
          console.error('Failed to load user templates:', e);
          userTemplates = [];
        }
      }
    }
  }
  
  function saveUserTemplates() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('promptTemplates', JSON.stringify(userTemplates));
    }
  }
  
  function saveCurrentAsTemplate() {
    if (!newTemplateName.trim()) return;
    
    const template: UserTemplate = {
      id: Date.now().toString(),
      name: newTemplateName.trim(),
      data: { ...formData },
      options: { ...promptOptions }, // 현재 프롬프트 옵션도 저장
      createdAt: new Date().toISOString()
    };
    
    userTemplates = [...userTemplates, template];
    saveUserTemplates();
    newTemplateName = '';
    showTemplateModal = false;
    enableBodyScroll();
    
    toast.success(`템플릿 "${template.name}"이 저장되었습니다`, {
      duration: 3000,
      position: 'top-center',
      style: 'background: #2563eb; color: #ffffff; font-weight: 600; border-radius: 8px; padding: 12px 16px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);'
    });
  }
  
  function loadUserTemplate(template: UserTemplate) {
    formData = { ...template.data };
    // 템플릿에 옵션이 있으면 적용, 없으면 기본값 유지 (하위 호환성)
    if (template.options) {
      promptOptions = { ...template.options };
    }
    showUserTemplates = false;
    enableBodyScroll(); // 스크롤 복원
    
    // 생성된 프롬프트 초기화
    onSettingChange();
    
    toast.success(`템플릿 "${template.name}"이 모든 설정과 함께 불러와졌습니다`, {
      duration: 2500,
      position: 'top-center',
      style: 'background: #7c3aed; color: #ffffff; font-weight: 600; border-radius: 8px; padding: 12px 16px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);'
    });
  }
  
  function deleteUserTemplate(templateId: string) {
    const template = userTemplates.find(t => t.id === templateId);
    userTemplates = userTemplates.filter(t => t.id !== templateId);
    saveUserTemplates();
    
    if (template) {
      toast.success(`템플릿 "${template.name}"이 삭제되었습니다`, {
        duration: 2500,
        position: 'top-center',
        style: 'background: #dc2626; color: #ffffff; font-weight: 600; border-radius: 8px; padding: 12px 16px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);'
      });
    }
  }
  
  // 프롬프트 복사
  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(generatedPrompt);
      toast.success('프롬프트가 클립보드에 복사되었습니다', {
        duration: 3000,
        position: 'top-center',
        style: 'background: #059669; color: #ffffff; font-weight: 600; border-radius: 8px; padding: 12px 16px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);'
      });
    } catch (err) {
      console.error('복사 실패:', err);
      toast.error('복사에 실패했습니다. 다시 시도해주세요', {
        duration: 3000,
        position: 'top-center',
        style: 'background: #dc2626; color: #ffffff; font-weight: 600; border-radius: 8px; padding: 12px 16px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);'
      });
    }
  }
  
  // 폼 초기화
  function resetForm() {
    formData.templateId = 'general-basic';
    promptOptions = {
      technique: PromptTechnique.ZERO_SHOT,
      includeExamples: false,
      includeStepByStep: false,
      expertRole: '',
      outputFormat: 'text',
      reasoning: false,
      selfConsistency: false,
      maxTokens: 1000,
      consistencyPaths: 3,
      treeDepth: 3,
      retrievalSources: [],
      chainLength: 4,
      diversityBoost: false,
      iterativeRefinement: false,
      qualityGate: 70
    };
    // 생성된 프롬프트도 초기화
    onSettingChange();
  }

  // 육하원칙만 초기화
  function resetFormData() {
    formData = {
      ...formData,
      who: [],
      what: [],
      when: [],
      where: [],
      why: [],
      how: []
    };
    // 최소 하나의 "무엇을" 항목 추가
    addItem('what');
    // 생성된 프롬프트 초기화
    onSettingChange();
    
    toast.success('5W1H 입력이 초기화되었습니다', {
      duration: 2000,
      position: 'top-center',
      style: 'background: #d97706; color: #ffffff; font-weight: 600; border-radius: 8px; padding: 12px 16px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);'
    });
  }

  // 템플릿 선택 초기화
  function resetTemplate() {
    formData.templateId = 'general-basic';
    // 생성된 프롬프트 초기화
    onSettingChange();
    
    toast.success('템플릿이 초기화되었습니다', {
      duration: 2000,
      position: 'top-center',
      style: 'background: #ea580c; color: #ffffff; font-weight: 600; border-radius: 8px; padding: 12px 16px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);'
    });
  }

  // 프롬프트 엔지니어링 기법 초기화
  function resetPromptOptions() {
    promptOptions = {
      technique: PromptTechnique.ZERO_SHOT,
      includeExamples: false,
      includeStepByStep: false,
      expertRole: '',
      outputFormat: 'text',
      reasoning: false,
      selfConsistency: false,
      maxTokens: 1000,
      consistencyPaths: 3,
      treeDepth: 3,
      retrievalSources: [],
      chainLength: 4,
      diversityBoost: false,
      iterativeRefinement: false,
      qualityGate: 70
    };
    // 생성된 프롬프트 초기화
    onSettingChange();
    
    toast.success('프롬프트 옵션이 초기화되었습니다', {
      duration: 2000,
      position: 'top-center',
      style: 'background: #7c3aed; color: #ffffff; font-weight: 600; border-radius: 8px; padding: 12px 16px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);'
    });
  }
  
  // 필드 정의 (SVG 아이콘으로 개선)
  const fields: Array<{
    key: keyof Omit<PromptFormData, 'templateId'>;
    label: string;
    placeholder: string;
    required?: boolean;
    examples: string[];
  }> = [
    { 
      key: 'who', 
      label: 'WHO', 
      placeholder: '초보 개발자, 마케팅 팀장',
      examples: ['초보 개발자', '마케팅 팀장', '대학생', '창업가', '프리랜서']
    },
    { 
      key: 'what', 
      label: 'WHAT', 
      placeholder: 'Python 학습, 마케팅 전략 수립', 
      required: true,
      examples: ['Python 프로그래밍 학습', '마케팅 전략 수립', '웹사이트 제작', '데이터 분석', '영어 회화 향상']
    },
    { 
      key: 'when', 
      label: 'WHEN', 
      placeholder: '3개월 내, 다음 분기',
      examples: ['3개월 내', '다음 분기', '올해 말까지', '6개월 후', '매일 아침']
    },
    { 
      key: 'where', 
      label: 'WHERE', 
      placeholder: '온라인, 사무실',
      examples: ['온라인', '사무실', '집에서', '카페에서', '도서관에서']
    },
    { 
      key: 'why', 
      label: 'WHY', 
      placeholder: '취업 준비, 매출 증대',
      examples: ['취업 준비를 위해', '매출 증대를 위해', '개인 성장을 위해', '경쟁력 향상을 위해', '새로운 기회를 위해']
    },
    { 
      key: 'how', 
      label: 'HOW', 
      placeholder: '체계적 학습, 데이터 분석',
      examples: ['체계적인 학습으로', '단계별 접근으로', '전문가 멘토링으로', '실습 중심으로', '커뮤니티 활용으로']
    }
  ];
  
  // SVG 아이콘 컴포넌트들
  function getFieldIcon(fieldKey: string) {
    switch (fieldKey) {
      case 'who':
        return `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
        </svg>`;
      case 'what':
        return `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
        </svg>`;
      case 'when':
        return `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>`;
      case 'where':
        return `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>`;
      case 'why':
        return `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
        </svg>`;
      case 'how':
        return `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>`;
      default:
        return `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>`;
    }
  }
  
  // 초기 항목 추가
  onMount(() => {
    if (formData.what.length === 0) {
      addItem('what');
    }

    // 사용자 템플릿 로드
    loadUserTemplates();

    // 외부 클릭 시 dropdown 닫기 (모달은 버튼으로만 닫기)
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      
      // 편집 모달이 열려있을 때는 외부 클릭으로 닫지 않음
      if (isEditingTemplate) {
        return; // 편집 모달은 버튼으로만 닫기
      }
      
      // 미리보기 모달이 열려있을 때는 외부 클릭으로 닫지 않음
      if (previewTemplate) {
        return; // 미리보기 모달은 버튼으로만 닫기
      }
      
      // 템플릿 저장 모달은 외부 클릭으로 닫지 않음
      if (showTemplateModal) {
        return; // 템플릿 저장 모달은 버튼으로만 닫기
      }
      
      // 사용자 템플릿 목록은 외부 클릭으로 닫지 않음
      if (showUserTemplates) {
        return; // 사용자 템플릿 목록은 버튼으로만 닫기
      }
      
      // 드롭다운만 외부 클릭으로 닫기 (기존 로직 유지하지 않음 - hover로 관리)
    };

    // 스크롤 시 드롭다운 닫기
    const handleScroll = () => {
      closeAllDropdowns();
    };

    document.addEventListener('click', handleClickOutside);
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
      enableBodyScroll(); // 컴포넌트 언마운트 시 스크롤 복원
    };
  });

  // 프롬프트 엔지니어링 기법 옵션
  const techniqueOptions = [
    { value: PromptTechnique.ZERO_SHOT, label: 'Zero-shot (기본)' },
    { value: PromptTechnique.FEW_SHOT, label: 'Few-shot (예시 기반)' },
    { value: PromptTechnique.CHAIN_OF_THOUGHT, label: 'Chain of Thought (단계별 사고)' },
    { value: PromptTechnique.TREE_OF_THOUGHT, label: 'Tree of Thoughts (트리 탐색)' },
    { value: PromptTechnique.SELF_CONSISTENCY, label: 'Self-Consistency (자기 일관성)' },
    { value: PromptTechnique.REFLECTION, label: 'Reflection (성찰)' },
    { value: PromptTechnique.EXPERT_PROMPTING, label: 'Expert Prompting (전문가 역할)' },
    { value: PromptTechnique.STEP_BY_STEP, label: 'Step-by-Step (단계별)' },
    // 새로운 고급 기법들
    { value: PromptTechnique.RAG, label: 'RAG (검색 증강 생성)' },
    { value: PromptTechnique.REACT, label: 'ReAct (추론과 행동)' },
    { value: PromptTechnique.PROMPT_CHAINING, label: 'Prompt Chaining (프롬프트 체이닝)' },
    { value: PromptTechnique.GENERATED_KNOWLEDGE, label: 'Generated Knowledge (지식 생성)' },
    { value: PromptTechnique.LEAST_TO_MOST, label: 'Least-to-Most (점진적 확장)' },
    { value: PromptTechnique.ANALOGICAL, label: 'Analogical (유추적)' },
    { value: PromptTechnique.DIRECTIONAL_STIMULUS, label: 'Directional Stimulus (방향성 자극)' },
    { value: PromptTechnique.META_PROMPTING, label: 'Meta-Prompting (메타 프롬프팅)' },
    { value: PromptTechnique.MULTIMODAL_COT, label: 'Multimodal CoT (멀티모달)' },
    { value: PromptTechnique.ACTIVE_PROMPT, label: 'Active Prompt (액티브 프롬프팅)' }
  ];

  // 출력 형식 옵션
  const outputFormatOptions = [
    { value: 'text', label: '텍스트' },
    { value: 'json', label: 'JSON' },
    { value: 'markdown', label: '마크다운' },
    { value: 'structured', label: '구조화된 형식' }
  ];

  // 템플릿 옵션 생성
  const templateOptions: Array<{category: string, categoryName: string, templates: Array<{id: string, name: string}>}> = [];
  
  for (const [category, categoryName] of Object.entries(CATEGORY_NAMES)) {
    const templates = DEFAULT_TEMPLATES
      .filter(t => t.category === category)
      .map(t => ({ id: t.id, name: t.name }));
    
    if (templates.length > 0) {
      templateOptions.push({ category, categoryName, templates });
    }
  }

  // 선택된 옵션 라벨 가져오기
  let selectedTemplateLabel = $derived(
    DEFAULT_TEMPLATES.find(t => t.id === formData.templateId)?.name || ''
  );

  let selectedTechniqueLabel = $derived(
    techniqueOptions.find(t => t.value === promptOptions.technique)?.label || ''
  );

  let selectedOutputFormatLabel = $derived(
    outputFormatOptions.find(f => f.value === promptOptions.outputFormat)?.label || ''
  );

  // 프롬프트 생성 함수 추가
  function generatePrompt() {
    if (!hasMinimumInput || !selectedTemplate) {
      toast.error('최소한 "무엇을" 항목을 입력해주세요', {
        duration: 3000,
        position: 'top-center',
        style: 'background: #dc2626; color: #ffffff; font-weight: 600; border-radius: 8px; padding: 12px 16px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);'
      });
      return;
    }

    isGenerating = true;
    
    // 약간의 지연을 두어 로딩 상태를 보여줌
    setTimeout(() => {
      try {
        generatedPrompt = PromptGenerator.generate(formData, selectedTemplate, promptOptions);
        qualityMetrics = PromptGenerator.evaluateQuality(formData, selectedTemplate, promptOptions);
        estimatedTokens = PromptGenerator.estimateTokens(generatedPrompt);
        
        toast.success('프롬프트가 생성되었습니다', {
          duration: 2000,
          position: 'top-center',
          style: 'background: #059669; color: #ffffff; font-weight: 600; border-radius: 8px; padding: 12px 16px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);'
        });
      } catch (error) {
        console.error('프롬프트 생성 오류:', error);
        toast.error('프롬프트 생성 중 오류가 발생했습니다', {
          duration: 3000,
          position: 'top-center',
          style: 'background: #dc2626; color: #ffffff; font-weight: 600; border-radius: 8px; padding: 12px 16px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);'
        });
      } finally {
        isGenerating = false;
      }
    }, 100);
  }

  // 프롬프트 초기화 함수 추가
  function clearPrompt() {
    generatedPrompt = '';
    qualityMetrics = null;
    estimatedTokens = 0;
    
    toast.success('생성된 프롬프트가 초기화되었습니다', {
      duration: 2000,
      position: 'top-center',
      style: 'background: #d97706; color: #ffffff; font-weight: 600; border-radius: 8px; padding: 12px 16px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);'
    });
  }

  // 설정 변경 시 자동 초기화 함수
  function onSettingChange() {
    if (generatedPrompt) {
      generatedPrompt = '';
      qualityMetrics = null;
      estimatedTokens = 0;
    }
  }

  // 입력 변경 시 자동 초기화 함수  
  function onInputChange() {
    if (generatedPrompt) {
      generatedPrompt = '';
      qualityMetrics = null;
      estimatedTokens = 0;
    }
  }

  // 템플릿 편집 함수들
  function startEditingTemplate() {
    if (!previewTemplate) return;
    
    isEditingTemplate = true;
    editingModalJustOpened = true;
    editingTemplateData = JSON.parse(JSON.stringify(previewTemplate.data)); // 깊은 복사
    editingTemplateOptions = JSON.parse(JSON.stringify(previewTemplate.options || {})); // 깊은 복사
    
    // 100ms 후에 "방금 열림" 플래그 해제
    setTimeout(() => {
      editingModalJustOpened = false;
    }, 100);
  }
  
  function cancelEditingTemplate() {
    closeEditingModal();
  }
  
  function saveEditedTemplate() {
    if (!previewTemplate || !editingTemplateData || !editingTemplateOptions) return;
    
    // 템플릿 업데이트
    const updatedTemplate: UserTemplate = {
      ...previewTemplate,
      data: editingTemplateData,
      options: editingTemplateOptions
    };
    
    // 템플릿 목록에서 업데이트
    const index = userTemplates.findIndex(t => t.id === previewTemplate!.id);
    if (index !== -1) {
      userTemplates[index] = updatedTemplate;
      previewTemplate = updatedTemplate; // 미리보기도 업데이트
      saveUserTemplates();
      
      toast.success(`템플릿 "${updatedTemplate.name}"이 수정되었습니다`, {
        duration: 2500,
        position: 'top-center',
        style: 'background: #059669; color: #ffffff; font-weight: 600; border-radius: 8px; padding: 12px 16px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);'
      });
    }
    
    // 편집 모드 종료
    closeEditingModal();
  }
  
  // 동적 항목 추가/제거 함수들 (편집용)
  function addEditingItem(fieldKey: keyof PromptFormData) {
    if (!editingTemplateData || fieldKey === 'templateId') return;
    
    editingTemplateData[fieldKey] = [
      ...editingTemplateData[fieldKey],
      { id: `${fieldKey}_${Date.now()}`, value: '' }
    ];
  }
  
  function removeEditingItem(fieldKey: keyof PromptFormData, itemId: string) {
    if (!editingTemplateData || fieldKey === 'templateId') return;
    
    editingTemplateData[fieldKey] = editingTemplateData[fieldKey].filter((item: DynamicItem) => item.id !== itemId);
  }
</script>

<svelte:head>
  <title>LLM 프롬프트 최적화 도구</title>
  <meta name="description" content="5W1H입력 기반 프롬프트 생성으로 더 나은 AI 응답을 얻어보세요" />
  
  <!-- 파비콘 설정 -->
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="icon" type="image/svg+xml" sizes="16x16" href="/favicon-16x16.svg" />
  <link rel="icon" type="image/svg+xml" sizes="32x32" href="/favicon-32x32.svg" />
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.svg" />
  
  <!-- 웹 매니페스트 -->
  <link rel="manifest" href="/site.webmanifest" />
  
  <!-- 메타 태그 -->
  <meta name="theme-color" content="#3B82F6" />
  <meta name="msapplication-TileColor" content="#3B82F6" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website" />
  <meta property="og:title" content="LLM 프롬프트 최적화 도구" />
  <meta property="og:description" content="5W1H 전략과 최신 프롬프트 엔지니어링 기법을 활용하여 더 정확하고 유용한 AI 응답을 얻어보세요" />
  <meta property="og:image" content="/apple-touch-icon.svg" />
  
  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:title" content="LLM 프롬프트 최적화 도구" />
  <meta property="twitter:description" content="5W1H 전략과 최신 프롬프트 엔지니어링 기법을 활용하여 더 정확하고 유용한 AI 응답을 얻어보세요" />
  <meta property="twitter:image" content="/apple-touch-icon.svg" />
  
  <style>
    /* 전역 스타일 개선 */
    :global(body) {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    /* 향상된 그림자 효과 */
    .enhanced-shadow {
      box-shadow: 
        0 4px 6px -1px rgba(0, 0, 0, 0.1),
        0 2px 4px -1px rgba(0, 0, 0, 0.06),
        0 0 0 1px rgba(255, 255, 255, 0.05);
    }

    .enhanced-shadow-lg {
      box-shadow: 
        0 25px 50px -12px rgba(0, 0, 0, 0.25),
        0 0 0 1px rgba(255, 255, 255, 0.05);
    }

    /* 네온 글로우 효과 */
    .neon-glow {
      box-shadow: 
        0 0 5px rgba(59, 130, 246, 0.5),
        0 0 10px rgba(59, 130, 246, 0.3),
        0 0 15px rgba(59, 130, 246, 0.2);
    }

    .neon-glow:hover {
      box-shadow: 
        0 0 10px rgba(59, 130, 246, 0.7),
        0 0 20px rgba(59, 130, 246, 0.5),
        0 0 30px rgba(59, 130, 246, 0.3);
    }

    /* Range Slider 스타일링 */
    .range-slider {
      background: linear-gradient(90deg, #e5e7eb, #d1d5db);
      border-radius: 8px;
      height: 8px;
      outline: none;
      transition: all 0.3s ease;
    }

    .range-slider::-webkit-slider-thumb {
      appearance: none;
      height: 24px;
      width: 24px;
      border-radius: 50%;
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
      cursor: pointer;
      box-shadow: 
        0 4px 8px rgba(59, 130, 246, 0.3),
        0 0 0 3px rgba(59, 130, 246, 0.1);
      transition: all 0.2s ease;
      position: relative;
    }

    .range-slider::-webkit-slider-thumb:hover {
      background: linear-gradient(135deg, #1d4ed8, #1e40af);
      box-shadow: 
        0 6px 12px rgba(59, 130, 246, 0.4),
        0 0 0 5px rgba(59, 130, 246, 0.2);
      transform: scale(1.1);
    }

    .range-slider::-webkit-slider-track {
      height: 8px;
      border-radius: 4px;
      background: linear-gradient(90deg, #e5e7eb, #d1d5db);
      border: none;
    }

    .range-slider::-moz-range-thumb {
      height: 24px;
      width: 24px;
      border-radius: 50%;
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
      cursor: pointer;
      border: none;
      box-shadow: 
        0 4px 8px rgba(59, 130, 246, 0.3),
        0 0 0 3px rgba(59, 130, 246, 0.1);
      transition: all 0.2s ease;
    }

    .range-slider::-moz-range-thumb:hover {
      background: linear-gradient(135deg, #1d4ed8, #1e40af);
      box-shadow: 
        0 6px 12px rgba(59, 130, 246, 0.4),
        0 0 0 5px rgba(59, 130, 246, 0.2);
      transform: scale(1.1);
    }

    .range-slider::-moz-range-track {
      height: 8px;
      border-radius: 4px;
      background: linear-gradient(90deg, #e5e7eb, #d1d5db);
      border: none;
    }

    /* Custom scrollbar for textareas */
    .custom-scrollbar::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }

    .custom-scrollbar::-webkit-scrollbar-track {
      background: transparent;
      border-radius: 10px;
    }

    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: linear-gradient(135deg, rgba(148, 163, 184, 0.6), rgba(100, 116, 139, 0.8));
      border-radius: 10px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      transition: all 0.2s ease;
    }

    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(135deg, rgba(100, 116, 139, 0.8), rgba(71, 85, 105, 0.9));
      transform: scaleY(1.2);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }

    .custom-scrollbar::-webkit-scrollbar-corner {
      background: transparent;
    }

    /* Dark mode scrollbar */
    .dark .custom-scrollbar::-webkit-scrollbar-thumb {
      background: linear-gradient(135deg, rgba(107, 114, 128, 0.6), rgba(75, 85, 99, 0.8));
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(135deg, rgba(75, 85, 99, 0.8), rgba(55, 65, 81, 0.9));
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
    }

    /* 모던 스크롤바 - 더 얇고 세련된 버전 */
    .modern-scrollbar::-webkit-scrollbar {
      width: 4px;
      height: 4px;
    }

    .modern-scrollbar::-webkit-scrollbar-track {
      background: transparent;
    }

    .modern-scrollbar::-webkit-scrollbar-thumb {
      background: rgba(156, 163, 175, 0.4);
      border-radius: 2px;
      transition: all 0.3s ease;
    }

    .modern-scrollbar::-webkit-scrollbar-thumb:hover {
      background: rgba(107, 114, 128, 0.7);
      border-radius: 2px;
    }

    .dark .modern-scrollbar::-webkit-scrollbar-thumb {
      background: rgba(156, 163, 175, 0.3);
    }

    .dark .modern-scrollbar::-webkit-scrollbar-thumb:hover {
      background: rgba(156, 163, 175, 0.6);
    }

    /* 둥근 모서리 컨테이너용 스크롤 오버플로우 방지 */
    .rounded-scroll-container {
      overflow: hidden;
      border-radius: inherit;
    }

    .rounded-scroll-content {
      overflow-y: auto;
      overflow-x: hidden;
      height: 100%;
      border-radius: inherit;
      /* 스크롤바가 둥근 모서리를 침범하지 않도록 패딩 추가 */
      padding-right: 2px;
      margin-right: -2px;
    }

    /* 고급 스크롤바 - 그라데이션과 그림자 효과 */
    .premium-scrollbar::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }

    .premium-scrollbar::-webkit-scrollbar-track {
      background: linear-gradient(to bottom, rgba(241, 245, 249, 0.3), rgba(226, 232, 240, 0.3));
      border-radius: 12px;
      margin: 4px;
    }

    .premium-scrollbar::-webkit-scrollbar-thumb {
      background: linear-gradient(135deg, 
        rgba(59, 130, 246, 0.3) 0%,
        rgba(99, 102, 241, 0.4) 50%,
        rgba(139, 92, 246, 0.3) 100%);
      border-radius: 12px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      box-shadow: 
        0 2px 4px rgba(0, 0, 0, 0.1),
        inset 0 1px 0 rgba(255, 255, 255, 0.3);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .premium-scrollbar::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(135deg, 
        rgba(59, 130, 246, 0.5) 0%,
        rgba(99, 102, 241, 0.6) 50%,
        rgba(139, 92, 246, 0.5) 100%);
      border: 2px solid rgba(255, 255, 255, 0.4);
      box-shadow: 
        0 4px 8px rgba(0, 0, 0, 0.15),
        inset 0 1px 0 rgba(255, 255, 255, 0.4),
        0 0 0 1px rgba(59, 130, 246, 0.2);
      transform: scaleY(1.1);
    }

    .premium-scrollbar::-webkit-scrollbar-thumb:active {
      background: linear-gradient(135deg, 
        rgba(59, 130, 246, 0.7) 0%,
        rgba(99, 102, 241, 0.8) 50%,
        rgba(139, 92, 246, 0.7) 100%);
    }

    .dark .premium-scrollbar::-webkit-scrollbar-track {
      background: linear-gradient(to bottom, rgba(55, 65, 81, 0.3), rgba(75, 85, 99, 0.3));
    }

    .dark .premium-scrollbar::-webkit-scrollbar-thumb {
      background: linear-gradient(135deg, 
        rgba(96, 165, 250, 0.3) 0%,
        rgba(129, 140, 248, 0.4) 50%,
        rgba(167, 139, 250, 0.3) 100%);
      border: 2px solid rgba(255, 255, 255, 0.1);
      box-shadow: 
        0 2px 4px rgba(0, 0, 0, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
    }

    .dark .premium-scrollbar::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(135deg, 
        rgba(96, 165, 250, 0.5) 0%,
        rgba(129, 140, 248, 0.6) 50%,
        rgba(167, 139, 250, 0.5) 100%);
      border: 2px solid rgba(255, 255, 255, 0.2);
      box-shadow: 
        0 4px 8px rgba(0, 0, 0, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.2),
        0 0 0 1px rgba(96, 165, 250, 0.3);
    }

    /* 향상된 Glassmorphism 효과 */
    .glass-effect {
      backdrop-filter: blur(20px) saturate(180%);
      background: rgba(255, 255, 255, 0.85);
      border: 1px solid rgba(255, 255, 255, 0.3);
      box-shadow: 
        0 8px 32px rgba(0, 0, 0, 0.1),
        inset 0 1px 0 rgba(255, 255, 255, 0.2);
    }

    .dark .glass-effect {
      background: rgba(31, 41, 55, 0.85);
      border: 1px solid rgba(75, 85, 99, 0.3);
      box-shadow: 
        0 8px 32px rgba(0, 0, 0, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
    }

    /* 향상된 버튼 애니메이션 */
    @keyframes pulse-enhanced {
      0%, 100% {
        box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
        transform: scale(1);
      }
      50% {
        box-shadow: 0 0 0 15px rgba(59, 130, 246, 0);
        transform: scale(1.05);
      }
    }

    .pulse-enhanced:hover {
      animation: pulse-enhanced 2s infinite;
    }

    /* 향상된 카드 호버 효과 */
    .card-hover {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .card-hover:hover {
      transform: translateY(-4px) scale(1.02);
      box-shadow: 
        0 25px 50px -12px rgba(0, 0, 0, 0.25),
        0 0 0 1px rgba(59, 130, 246, 0.1);
    }

    /* Custom Select Dropdown 향상 */
    .custom-select {
      position: relative;
      z-index: 1;
    }

    /* .select-dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      z-index: 999999;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px) saturate(180%);
      border: 1px solid rgba(229, 231, 235, 0.5);
      border-radius: 16px;
      box-shadow: 
        0 25px 50px -12px rgba(0, 0, 0, 0.25),
        0 0 0 1px rgba(255, 255, 255, 0.05);
      max-height: 320px;
      overflow-y: auto;
      margin-top: 4px;
    } */

    .dark .select-dropdown {
      background: rgba(31, 41, 55, 0.95);
      border-color: rgba(75, 85, 99, 0.5);
      box-shadow: 
        0 25px 50px -12px rgba(0, 0, 0, 0.4),
        0 0 0 1px rgba(255, 255, 255, 0.05);
    }

    .select-option {
      padding: 14px 18px;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      border-bottom: 1px solid rgba(243, 244, 246, 0.5);
      position: relative;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      min-width: 0;
      line-height: 1.4;
    }

    .select-option span {
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 100%;
      padding-right: 8px;
    }

    .dark .select-option {
      border-bottom-color: rgba(55, 65, 81, 0.5);
    }

    .select-option:last-child {
      border-bottom: none;
    }

    .select-option::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.1), transparent);
      transition: left 0.5s ease;
    }

    .select-option:hover::before {
      left: 100%;
    }

    .select-option:hover {
      background: linear-gradient(135deg, rgba(248, 250, 252, 0.8), rgba(241, 245, 249, 0.8));
      color: #1e40af;
      transform: translateX(6px);
      padding-left: 24px;
    }

    .dark .select-option:hover {
      background: linear-gradient(135deg, rgba(55, 65, 81, 0.8), rgba(75, 85, 99, 0.8));
      color: #60a5fa;
    }

    .select-option.selected {
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
      color: white;
      font-weight: 600;
      position: relative;
    }

    .select-option.selected::after {
      content: '✓';
      position: absolute;
      right: 18px;
      top: 50%;
      transform: translateY(-50%);
      font-weight: bold;
    }

    .select-option.selected:hover {
      background: linear-gradient(135deg, #1d4ed8, #1e40af);
      transform: translateX(6px);
      padding-left: 24px;
    }

    .select-optgroup {
      font-weight: 700;
      color: #6b7280;
      padding: 12px 18px;
      background: linear-gradient(135deg, #f9fafb, #f3f4f6);
      border-bottom: 1px solid rgba(229, 231, 235, 0.8);
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .dark .select-optgroup {
      color: #9ca3af;
      background: linear-gradient(135deg, #1f2937, #374151);
      border-bottom-color: rgba(55, 65, 81, 0.8);
    }

    /* Custom scrollbar for dropdown */
    .select-dropdown::-webkit-scrollbar {
      width: 8px;
    }

    .select-dropdown::-webkit-scrollbar-track {
      background: rgba(241, 245, 249, 0.3);
      border-radius: 4px;
    }

    .select-dropdown::-webkit-scrollbar-thumb {
      background: linear-gradient(135deg, #cbd5e1, #94a3b8);
      border-radius: 4px;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .select-dropdown::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(135deg, #94a3b8, #64748b);
    }

    .dark .select-dropdown::-webkit-scrollbar-track {
      background: rgba(55, 65, 81, 0.3);
    }

    .dark .select-dropdown::-webkit-scrollbar-thumb {
      background: linear-gradient(135deg, #6b7280, #4b5563);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .dark .select-dropdown::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(135deg, #4b5563, #374151);
    }

    /* Portal 드롭다운 스타일 */
    .portal-dropdown {
      overflow-x: hidden !important;
    }

    .portal-dropdown::-webkit-scrollbar-horizontal {
      display: none;
    }

    .portal-dropdown::-webkit-scrollbar {
      width: 8px;
      height: 0px; /* 가로 스크롤바 높이를 0으로 */
    }

    /* 향상된 입력 필드 스타일 */
    .enhanced-input {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(249, 250, 251, 0.9));
      border: 2px solid transparent;
      background-clip: padding-box;
      position: relative;
    }

    .enhanced-input::before {
      content: '';
      position: absolute;
      inset: 0;
      padding: 2px;
      background: linear-gradient(135deg, #e5e7eb, #d1d5db);
      border-radius: inherit;
      mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      mask-composite: exclude;
    }

    .enhanced-input:focus::before {
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    }

    .dark .enhanced-input {
      background: linear-gradient(135deg, rgba(55, 65, 81, 0.9), rgba(75, 85, 99, 0.9));
    }

    .dark .enhanced-input::before {
      background: linear-gradient(135deg, #4b5563, #374151);
    }

    /* 플로팅 라벨 효과 */
    .floating-label {
      position: relative;
    }

    .floating-label input:focus + label,
    .floating-label input:not(:placeholder-shown) + label {
      transform: translateY(-24px) scale(0.875);
      color: #3b82f6;
    }

    .floating-label label {
      position: absolute;
      top: 12px;
      left: 16px;
      transition: all 0.2s ease;
      pointer-events: none;
      background: white;
      padding: 0 4px;
    }

    /* 마이크로 인터랙션 */
    @keyframes bounce-in {
      0% { transform: scale(0.3); opacity: 0; }
      50% { transform: scale(1.05); }
      70% { transform: scale(0.9); }
      100% { transform: scale(1); opacity: 1; }
    }

    .bounce-in {
      animation: bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }

    /* 진보된 호버 효과 */
    .magnetic-hover {
      transition: transform 0.2s ease;
    }

    .magnetic-hover:hover {
      transform: translateY(-2px);
    }

    /* 그라데이션 테두리 */
    .gradient-border {
      position: relative;
      background: linear-gradient(white, white) padding-box,
                  linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899) border-box;
      border: 2px solid transparent;
    }

    .dark .gradient-border {
      background: linear-gradient(#1f2937, #1f2937) padding-box,
                   linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899) border-box;
    }

    /* 그리드 행 높이 균등화 */
    .grid-auto-rows-fr {
      grid-auto-rows: 1fr;
    }

    /* 5W1H 카드 레이아웃 개선 */
    .field-card {
      display: flex;
      flex-direction: column;
      height: 100%;
      min-height: 400px; /* 최소 높이 설정 */
    }

    .field-card-content {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .field-card-examples {
      flex-shrink: 0;
    }

    .field-card-inputs {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
  </style>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-800 dark:to-gray-900">
  <!-- 히어로 섹션 -->
  <section class="pt-16 pb-12 px-4 relative overflow-hidden">
    <!-- 배경 장식 요소들 -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-32 w-80 h-80 bg-gradient-to-br from-blue-300/15 to-cyan-400/15 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-40 -left-32 w-80 h-80 bg-gradient-to-tr from-indigo-300/15 to-blue-400/15 rounded-full blur-3xl"></div>
    </div>
    
    <div class="max-w-5xl mx-auto text-center relative z-10">
      <!-- 메인 아이콘 -->
      <div class="mb-8 flex justify-center">
        <div class="relative">
          <div class="w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 rounded-2xl shadow-2xl flex items-center justify-center transform rotate-3 hover:rotate-6 transition-transform duration-500 p-3">
            <!-- 파비콘과 동일한 디자인 -->
            <svg class="w-12 h-12" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <!-- 그라데이션 정의 -->
                <linearGradient id="headerBrainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color:#FFFFFF;stop-opacity:0.95" />
                  <stop offset="100%" style="stop-color:#F3F4F6;stop-opacity:0.9" />
                </linearGradient>
                
                <linearGradient id="headerLightningGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color:#FEF3C7;stop-opacity:1" />
                  <stop offset="100%" style="stop-color:#FCD34D;stop-opacity:1" />
                </linearGradient>
              </defs>
              
              <!-- 뇌/AI 심볼 (상단) -->
              <path d="M10 8 C10 6, 12 6, 14 7 C16 6, 18 6, 20 7 C22 8, 22 10, 21 11 C22 12, 21 14, 19 14 C17 15, 15 15, 13 14 C11 14, 10 12, 11 11 C10 10, 10 8, 10 8 Z" 
                    fill="url(#headerBrainGradient)" 
                    stroke="#FFFFFF" 
                    stroke-width="0.5"/>
              
              <!-- 뇌 내부 회로 패턴 -->
              <circle cx="13" cy="10" r="1" fill="#3B82F6" opacity="0.8"/>
              <circle cx="17" cy="10" r="1" fill="#8B5CF6" opacity="0.8"/>
              <path d="M13 10 L17 10" stroke="#3B82F6" stroke-width="0.5" opacity="0.6"/>
              
              <!-- 번개/최적화 심볼 (하단) -->
              <path d="M18 16 L14 20 L16 20 L13 26 L17 22 L15 22 L18 16 Z" 
                    fill="url(#headerLightningGradient)" 
                    stroke="#F59E0B" 
                    stroke-width="0.3"/>
              
              <!-- 5W1H 도트들 (측면) -->
              <circle cx="6" cy="16" r="1" fill="#FFFFFF" opacity="0.9"/>
              <circle cx="26" cy="16" r="1" fill="#FFFFFF" opacity="0.9"/>
              <circle cx="16" cy="6" r="1" fill="#FFFFFF" opacity="0.7"/>
              <circle cx="16" cy="26" r="1" fill="#FFFFFF" opacity="0.7"/>
              
              <!-- 연결선들 -->
              <path d="M7 16 L11 12" stroke="#FFFFFF" stroke-width="0.5" opacity="0.5"/>
              <path d="M25 16 L21 12" stroke="#FFFFFF" stroke-width="0.5" opacity="0.5"/>
              
              <!-- 중앙 하이라이트 -->
              <circle cx="16" cy="16" r="2" fill="none" stroke="#FFFFFF" stroke-width="0.5" opacity="0.6"/>
            </svg>
          </div>
          <div class="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-ping"></div>
        </div>
      </div>
      
      <h1 class="text-4xl md:text-6xl lg:text-7xl font-black bg-gradient-to-r from-slate-700 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6 leading-tight">
        LLM 프롬프트<br>
        <span class="text-3xl md:text-5xl lg:text-6xl">최적화 도구</span>
      </h1>
      
      <p class="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
        🎯 5W1H전략과 최신 프롬프트 엔지니어링 기법을 활용하여<br>
        <span class="font-semibold text-blue-600 dark:text-blue-400">더 정확하고 유용한 AI 응답</span>을 얻어보세요
      </p>
      
      <!-- 특징 배지들 -->
      <div class="flex flex-wrap justify-center gap-3 mb-8">
        <span class="px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
          🧠 18가지 AI 기법
        </span>
        <span class="px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
          📊 실시간 품질 분석
        </span>
        <span class="px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
          ⚡ 즉시 생성
        </span>
      </div>
    </div>
  </section>

  <div class="max-w-7xl mx-auto px-4 pb-12">
    <!-- 육하원칙 입력 (전체 너비 사용) -->
    <div class="mb-12 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 dark:border-gray-700/30 enhanced-shadow-lg" 
         transition:fade={{ duration: 300, easing: quintOut }}>
      <div class="flex items-center gap-4 mb-8">
        <div class="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg flex items-center justify-center">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-gray-800 dark:text-white flex-1">
          5W1H Input
        </h2>
        <button
          on:click={resetFormData}
          class="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 active:scale-95 flex items-center justify-center"
          aria-label="5W1H 초기화"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
        </button>
      </div>
      
      <!-- 1x6 가로 그리드 레이아웃 -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 grid-auto-rows-fr">
        {#each fields as field}
          <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-gray-700/50 hover:border-blue-300/50 dark:hover:border-blue-500/50 transition-all duration-300 card-hover enhanced-shadow group flex flex-col h-full"
               transition:scale={{ duration: 200, easing: quintOut }}>
            <div class="flex items-start justify-between mb-4 flex-shrink-0">
              <label class="flex items-center gap-3 text-sm font-bold text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 flex-1 min-w-0">
                <span class="p-2 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                  {@html getFieldIcon(field.key)}
                </span>
                <div class="flex flex-col min-w-0 flex-1">
                  <span class="text-base truncate">{field.label}</span>
                  {#if field.required}
                    <span class="text-red-500 text-xs">필수</span>
                  {/if}
                </div>
              </label>
            </div>

            <!-- 예시 템플릿 -->
            <div class="mb-4 p-3 bg-blue-50/50 dark:bg-blue-900/20 rounded-lg border border-blue-200/30 dark:border-blue-700/30 flex-shrink-0">
              <div class="text-xs font-medium text-blue-700 dark:text-blue-300 mb-2">💡 Ex</div>
              <div class="flex flex-wrap gap-1.5 min-h-[56px] items-start content-start">
                {#each field.examples as example}
                  <button
                    on:click={() => addExample(field.key, example)}
                    class="px-3 py-1.5 text-xs bg-blue-100/70 dark:bg-blue-800/50 text-blue-700 dark:text-blue-200 rounded-md hover:bg-blue-200/70 dark:hover:bg-blue-700/70 transition-colors duration-200 border border-blue-200/50 dark:border-blue-600/50 min-h-[24px] flex items-center whitespace-nowrap max-w-full"
                  >
                    <span class="truncate">{example}</span>
                  </button>
                {/each}
              </div>
            </div>
            
            <div class="flex-1 flex flex-col">
              {#each formData[field.key] as item, index (item.id)}
                <div class="relative group/item mb-3" 
                     in:slide={{ duration: 200, easing: quintOut }}>
                  <textarea
                    bind:value={item.value}
                    data-field={field.key}
                    on:input={(e) => {
                      const target = e.target as HTMLTextAreaElement;
                      updateItem(field.key, item.id, target.value);
                      onInputChange(); // 입력 변경 시 프롬프트 초기화
                    }}
                    placeholder={field.placeholder}
                    rows="3"
                    class="w-full p-4 text-sm border-2 border-gray-200/50 dark:border-gray-600/50 rounded-xl bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 resize-none max-h-24 overflow-y-auto transition-all duration-300 hover:border-blue-300/70 dark:hover:border-blue-500/70 custom-scrollbar gradient-border"
                  ></textarea>
                  <!-- x버튼을 textarea 영역을 넘쳐서 오른쪽 상단 가장자리에 배치 -->
                  <button
                    on:click={(e) => {
                      e.stopPropagation();
                      removeItem(field.key, item.id);
                    }}
                    class="group/del absolute -top-3 -right-3 w-7 h-7 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center transform hover:scale-110 active:scale-95 z-20 border-2 border-white dark:border-gray-800 opacity-0 group-hover/item:opacity-100"
                    aria-label="삭제"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
              {/each}
              
              <!-- 항목이 1개 이상 있을 때 추가 버튼을 아래에 표시 (textarea 너비와 동일) -->
              {#if formData[field.key].length > 0}
                <div class="pt-1 mt-auto">
                  <button
                    on:click={() => addItem(field.key)}
                    class="group/add relative w-full p-3 bg-gradient-to-r from-blue-500/80 to-blue-600/80 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center transform hover:scale-[1.02] active:scale-[0.98] border-2 border-blue-400/50 hover:border-blue-500/70"
                    aria-label="{field.label} 항목 추가"
                    transition:scale={{ duration: 150 }}
                  >
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"></path>
                    </svg>
                  </button>
                </div>
              {/if}
              
              {#if formData[field.key].length === 0}
                <!-- 빈 상태일 때는 간단한 추가 버튼만 표시 -->
                <div class="text-center py-6 border-2 border-gray-300/60 dark:border-gray-600/60 rounded-xl hover:border-blue-400/60 dark:hover:border-blue-500/60 transition-all duration-300 magnetic-hover flex-1 flex items-center justify-center">
                  <button
                    on:click={() => addItem(field.key)}
                    class="group/empty relative w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center transform hover:scale-110 active:scale-95 mx-auto pulse-enhanced"
                    aria-label="{field.label} 항목 추가"
                  >
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"></path>
                    </svg>
                  </button>
                </div>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    </div>

    <div class="grid lg:grid-cols-2 gap-8">
      <!-- 왼쪽: 입력 폼 -->
      <div class="space-y-6">
      <!-- 사용자 템플릿 관리 -->
        <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-xl p-8 border border-white/30 dark:border-gray-700/40 enhanced-shadow card-hover"
             transition:fade={{ duration: 300, delay: 300, easing: quintOut }}>
          <div class="flex items-center gap-4 mb-6">
            <div class="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
              </svg>
            </div>
            <h2 class="text-xl font-bold text-gray-800 dark:text-white">
              My Templates
            </h2>
          </div>

          <div class="flex gap-3 mb-4">
            <button
              on:click={() => {
                showTemplateModal = true;
                disableBodyScroll();
              }}
              class="template-button flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
              disabled={!hasMinimumInput}
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
              현재 내용 저장
            </button>
            
            <button
              on:click={() => {
                showUserTemplates = !showUserTemplates;
              }}
              class="template-button px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
              disabled={userTemplates.length === 0}
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
              </svg>
              불러오기 ({userTemplates.length})
            </button>
          </div>

          <!-- 사용자 템플릿 목록 -->
          {#if showUserTemplates && userTemplates.length > 0}
            <div class="bg-gray-50/80 dark:bg-gray-700/80 backdrop-blur-sm rounded-xl p-4 max-h-64 overflow-hidden modern-scrollbar"
                 transition:slide={{ duration: 300, easing: quintOut }}>
              <div class="rounded-scroll-content space-y-2">
                {#each userTemplates as template (template.id)}
                  <div class="template-item flex items-center justify-between p-3 bg-white/80 dark:bg-gray-600/80 rounded-lg border border-gray-200/50 dark:border-gray-500/50 hover:border-blue-300/50 dark:hover:border-blue-500/50 transition-all duration-200">
                    <button
                      on:click={() => {
                        previewTemplate = template;
                        disableBodyScroll();
                      }}
                      class="flex-1 min-w-0 text-left hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                    >
                      <h4 class="font-medium text-gray-800 dark:text-white truncate">{template.name}</h4>
                      <p class="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(template.createdAt).toLocaleDateString('ko-KR')}
                      </p>
                    </button>
                    <div class="flex gap-1 ml-3">
                      <button
                        on:click={() => {
                          loadUserTemplate(template);
                        }}
                        class="group relative p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-200 hover:scale-110"
                        aria-label="템플릿 불러오기"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                        </svg>
                      </button>
                      <button
                        on:click={() => deleteUserTemplate(template.id)}
                        class="group relative p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-200 hover:scale-110"
                        aria-label="템플릿 삭제"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                {/each}
              </div>
            </div>
          {/if}
        </div>
        <!-- 템플릿 선택 -->
        <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-xl p-8 border border-white/30 dark:border-gray-700/40 enhanced-shadow card-hover"
          transition:fade={{ duration: 300, delay: 100, easing: quintOut }}>
          <div class="flex items-center gap-4 mb-6">
            <div class="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
              </svg>
            </div>
            <h2 class="text-xl font-bold text-gray-800 dark:text-white flex-1">
              Template Selection
            </h2>
            <button
              on:click={resetTemplate}
              class="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 active:scale-95 flex items-center justify-center"
              aria-label="템플릿 초기화"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
            </button>
          </div>
          <div class="custom-select" on:mouseenter={handleTemplateHover} on:mouseleave={handleTemplateLeave}>
            <button 
              class="relative w-full p-5 pr-16 border-2 border-gray-200/60 dark:border-gray-600/60 rounded-2xl bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 cursor-pointer transition-all duration-300 hover:border-blue-300/70 dark:hover:border-blue-500/70 shadow-lg hover:shadow-xl text-left flex items-center justify-between group"
            >
              <span class="font-medium">{selectedTemplateLabel}</span>
              <svg class="w-6 h-6 text-gray-400 group-hover:text-blue-500 transform transition-all duration-300 {templateSelectOpen ? 'rotate-180' : ''} absolute right-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            
            <!-- 
            {#if templateSelectOpen}
              <div class="select-dropdown"
                   transition:slide={{ duration: 200, easing: quintOut }}>
                {#each templateOptions as group}
                  <div class="select-optgroup">{group.categoryName}</div>
                  {#each group.templates as template}
                    <div 
                      class="select-option {formData.templateId === template.id ? 'selected' : ''}"
                      on:click={() => {
                        formData.templateId = template.id;
                        templateSelectOpen = false;
                      }}
                      role="option"
                      tabindex="0"
                    >
                      {template.name}
                    </div>
                  {/each}
                {/each}
              </div>
            {/if}
            -->
          </div>
          
          {#if selectedTemplate}
            <div class="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
                 transition:slide={{ duration: 200, easing: quintOut }}>
              <p class="text-sm text-blue-700 dark:text-blue-300">
                {selectedTemplate.description}
              </p>
            </div>
          {/if}
        </div>

        <!-- 프롬프트 엔지니어링 기법 선택 -->
        <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-xl p-8 border border-white/30 dark:border-gray-700/40 enhanced-shadow card-hover"
             transition:fade={{ duration: 300, delay: 200, easing: quintOut }}>
          <div class="flex items-center gap-4 mb-6">
            <div class="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl shadow-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
              </svg>
            </div>
            <h2 class="text-xl font-bold text-gray-800 dark:text-white flex-1">
              Prompt Engineering
            </h2>
            <button
              on:click={resetPromptOptions}
              class="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 active:scale-95 flex items-center justify-center"
              aria-label="프롬프트 옵션 초기화"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
            </button>
          </div>
          
          <div class="space-y-4">
            <!-- 기법 선택 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                기법 선택
              </label>
              <div class="custom-select" on:mouseenter={handleTechniqueHover} on:mouseleave={handleTechniqueLeave}>
                <button 
                  class="relative w-full p-4 pr-12 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer transition-all duration-200 hover:border-blue-300 dark:hover:border-blue-500 shadow-sm hover:shadow-md text-left flex items-center justify-between"
                >
                  <span>{selectedTechniqueLabel}</span>
                  <svg class="w-5 h-5 text-gray-400 transform transition-transform duration-200 {techniqueSelectOpen ? 'rotate-180' : ''} absolute right-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                
                <!-- 
                {#if techniqueSelectOpen}
                  <div class="select-dropdown"
                       transition:slide={{ duration: 200, easing: quintOut }}>
                    {#each techniqueOptions as option}
                      <div 
                        class="select-option {promptOptions.technique === option.value ? 'selected' : ''}"
                        on:click={() => {
                          promptOptions.technique = option.value;
                          techniqueSelectOpen = false;
                        }}
                        role="option"
                        tabindex="0"
                      >
                        {option.label}
                      </div>
                    {/each}
                  </div>
                {/if}
                -->
              </div>
            </div>

            <!-- 기본 옵션 -->
            <div class="grid grid-cols-2 gap-4">
              <label class="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-200 cursor-pointer group">
                <input 
                  type="checkbox" 
                  bind:checked={promptOptions.reasoning}
                  on:change={onSettingChange}
                  class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <span class="text-sm text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">추론 과정 포함</span>
              </label>
              
              <label class="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-200 cursor-pointer group">
                <input 
                  type="checkbox" 
                  bind:checked={promptOptions.includeStepByStep}
                  on:change={onSettingChange}
                  class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <span class="text-sm text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">단계별 설명</span>
              </label>
            </div>

            <!-- 출력 형식 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                출력 형식
              </label>
              <div class="custom-select" on:mouseenter={handleOutputFormatHover} on:mouseleave={handleOutputFormatLeave}>
                <button 
                  class="relative w-full p-4 pr-12 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer transition-all duration-200 hover:border-blue-300 dark:hover:border-blue-500 shadow-sm hover:shadow-md text-left flex items-center justify-between"
                >
                  <span>{selectedOutputFormatLabel}</span>
                  <svg class="w-5 h-5 text-gray-400 transform transition-transform duration-200 {outputFormatSelectOpen ? 'rotate-180' : ''} absolute right-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                
                <!-- 출력 형식 드롭다운 비활성화 -->
                <!-- 
                {#if outputFormatSelectOpen}
                  <div class="select-dropdown"
                       transition:slide={{ duration: 200, easing: quintOut }}>
                    {#each outputFormatOptions as option}
                      <div 
                        class="select-option {promptOptions.outputFormat === option.value ? 'selected' : ''}"
                        on:click={() => {
                          promptOptions.outputFormat = option.value as 'text' | 'json' | 'markdown' | 'structured';
                          outputFormatSelectOpen = false;
                        }}
                        role="option"
                        tabindex="0"
                      >
                        {option.label}
                      </div>
                    {/each}
                  </div>
                {/if}
                -->
              </div>
            </div>

            <!-- 고급 옵션 토글 -->
            <button
              on:click={() => showAdvancedOptions = !showAdvancedOptions}
              class="w-full p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-600 dark:hover:to-gray-500 transition-all duration-200 flex items-center justify-between shadow-sm hover:shadow-md border border-gray-200 dark:border-gray-600"
            >
              <span class="font-medium">고급 옵션</span>
              <svg class="w-5 h-5 transform transition-transform duration-200 {showAdvancedOptions ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>

            <!-- 고급 옵션 (접이식) -->
            {#if showAdvancedOptions}
              <div class="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-xl p-4 space-y-4 border border-gray-200 dark:border-gray-600 modern-scrollbar"
                   transition:slide={{ duration: 300, easing: quintOut }}>
                
                <!-- 기법별 세부 옵션 -->
                {#if promptOptions.technique === PromptTechnique.SELF_CONSISTENCY}
                  <div transition:fade={{ duration: 200 }}>
                    <label for="consistencyPaths" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      추론 경로 수: <span class="text-blue-600 dark:text-blue-400 font-semibold">{promptOptions.consistencyPaths}</span>
                      <span class="text-xs text-gray-500 ml-2">더 많은 경로로 신뢰성 향상</span>
                    </label>
                    <input 
                      type="range" 
                      id="consistencyPaths"
                      bind:value={promptOptions.consistencyPaths}
                      on:input={onSettingChange}
                      min="2" 
                      max="10"
                      class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600 range-slider"
                    />
                  </div>
                {/if}

                {#if promptOptions.technique === PromptTechnique.TREE_OF_THOUGHT}
                  <div transition:fade={{ duration: 200 }}>
                    <label for="treeDepth" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      탐색 깊이: <span class="text-blue-600 dark:text-blue-400 font-semibold">{promptOptions.treeDepth}</span>
                      <span class="text-xs text-gray-500 ml-2">더 깊은 분석과 사고</span>
                    </label>
                    <input 
                      type="range" 
                      id="treeDepth"
                      bind:value={promptOptions.treeDepth}
                      on:input={onSettingChange}
                      min="2" 
                      max="6"
                      class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600 range-slider"
                    />
                  </div>
                {/if}

                {#if promptOptions.technique === PromptTechnique.PROMPT_CHAINING}
                  <div transition:fade={{ duration: 200 }}>
                    <label for="chainLength" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      체인 길이: <span class="text-blue-600 dark:text-blue-400 font-semibold">{promptOptions.chainLength}</span>
                      <span class="text-xs text-gray-500 ml-2">더 체계적인 단계별 접근</span>
                    </label>
                    <input 
                      type="range" 
                      id="chainLength"
                      bind:value={promptOptions.chainLength}
                      on:input={onSettingChange}
                      min="2" 
                      max="8"
                      class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600 range-slider"
                    />
                  </div>
                {/if}

                <!-- 전문가 역할 (Expert Prompting일 때) -->
                {#if promptOptions.technique === PromptTechnique.EXPERT_PROMPTING}
                  <div transition:fade={{ duration: 200 }}>
                    <label for="expertRole" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      전문가 역할
                      <span class="text-xs text-gray-500 ml-2">전문성 있는 답변 생성</span>
                    </label>
                    <input 
                      type="text" 
                      id="expertRole"
                      bind:value={promptOptions.expertRole}
                      on:input={onSettingChange}
                      placeholder="예: 데이터 사이언티스트, 마케팅 전문가"
                      class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 transition-all duration-200 hover:border-blue-300 dark:hover:border-blue-500"
                    />
                  </div>
                {/if}

                <!-- 범용 고급 옵션들 -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label class="flex items-start space-x-3 p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-200 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      bind:checked={promptOptions.diversityBoost}
                      on:change={onSettingChange}
                      class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 mt-0.5"
                    />
                    <span class="text-sm text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                      다양성 증대
                      <span class="block text-xs text-gray-500 mt-1">창의적 관점과 대안 제시</span>
                    </span>
                  </label>

                  <label class="flex items-start space-x-3 p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-200 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      bind:checked={promptOptions.iterativeRefinement}
                      on:change={onSettingChange}
                      class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 mt-0.5"
                    />
                    <span class="text-sm text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                      반복 개선
                      <span class="block text-xs text-gray-500 mt-1">답변을 검토하고 개선</span>
                    </span>
                  </label>
                </div>

                <!-- 품질 게이트 -->
                <div>
                  <label for="qualityGate" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    품질 게이트: <span class="text-blue-600 dark:text-blue-400 font-semibold">{promptOptions.qualityGate || 70}점</span>
                    <span class="text-xs text-gray-500 ml-2">최소 품질 기준 설정</span>
                  </label>
                  <input 
                    type="range" 
                    id="qualityGate"
                    bind:value={promptOptions.qualityGate}
                    on:input={onSettingChange}
                    min="50" 
                    max="95"
                    step="5"
                    class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600 range-slider"
                  />
                  <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>기본 (50)</span>
                    <span>우수 (95)</span>
                  </div>
                  {#if qualityMetrics && promptOptions.qualityGate && qualityMetrics.total < promptOptions.qualityGate}
                    <div class="mt-2 p-3 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-lg text-xs border-l-4 border-yellow-400"
                         transition:slide={{ duration: 200 }}>
                      ⚠️ 현재 품질({qualityMetrics.total}점)이 설정된 기준보다 낮습니다
                    </div>
                  {/if}
                </div>

                <!-- 토큰 제한 -->
                <div>
                  <label for="maxTokens" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    최대 토큰 수: <span class="text-blue-600 dark:text-blue-400 font-semibold">{promptOptions.maxTokens || 1000}</span>
                    <span class="text-xs text-gray-500 ml-2">응답 길이 제한</span>
                  </label>
                  <input 
                    type="range" 
                    id="maxTokens"
                    bind:value={promptOptions.maxTokens}
                    on:input={onSettingChange}
                    min="100" 
                    max="4000"
                    step="100"
                    class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600 range-slider"
                  />
                  <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>간결 (100)</span>
                    <span>상세 (4000)</span>
                  </div>
                  {#if promptOptions.maxTokens && estimatedTokens > promptOptions.maxTokens}
                    <div class="mt-2 p-3 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-lg text-xs border-l-4 border-red-400"
                         transition:slide={{ duration: 200 }}>
                      ⚠️ 예상 토큰({estimatedTokens})이 제한을 초과합니다
                    </div>
                  {/if}
                </div>
              </div>
            {/if}
          </div>
        </div>
      </div>

      <!-- 오른쪽: 프롬프트 미리보기 및 품질 분석 -->
      <div class="space-y-6">
        
        {#if showPreview}
          <!-- 생성된 프롬프트 -->
          <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-xl p-8 border border-white/30 dark:border-gray-700/40 enhanced-shadow card-hover">
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                </div>
                <h2 class="text-xl font-bold text-gray-800 dark:text-white">
                  Generated Prompt
                </h2>
              </div>
              <div class="flex gap-3">
                <span class="px-4 py-2 bg-blue-100/80 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 rounded-xl text-sm font-semibold backdrop-blur-sm border border-blue-200/50 dark:border-blue-700/50">
                  {estimatedTokens} 토큰
                </span>
                <button
                  on:click={clearPrompt}
                  class="group/clear relative w-10 h-10 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 active:scale-95 flex items-center justify-center"
                  aria-label="프롬프트 초기화"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                </button>
                <button
                  on:click={copyPrompt}
                  class="group/copy relative w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 active:scale-95 flex items-center justify-center pulse-enhanced"
                  aria-label="프롬프트 복사"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                  </svg>
                </button>
              </div>
            </div>
            
            <div class="bg-gray-50/80 dark:bg-gray-700/80 backdrop-blur-sm rounded-xl p-6 border-l-4 border-blue-500 max-h-96 overflow-y-auto premium-scrollbar">
              <div class="h-full">
                <pre class="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200 font-mono leading-relaxed">{generatedPrompt}</pre>
              </div>
            </div>
          </div>

          <!-- 품질 분석 -->
          {#if qualityMetrics}
            <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-xl p-8 border border-white/30 dark:border-gray-700/40 enhanced-shadow card-hover">
              <div class="flex items-center gap-4 mb-6">
                <div class="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-lg flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                  </svg>
                </div>
                <h2 class="text-xl font-bold text-gray-800 dark:text-white">
                  Quality Analysis
                </h2>
              </div>
              
              <!-- 전체 점수 -->
              <div class="mb-6">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-lg font-semibold text-gray-700 dark:text-gray-300">전체 점수</span>
                  <span class="text-2xl font-bold {
                    qualityMetrics.level === 'excellent' ? 'text-green-600' :
                    qualityMetrics.level === 'high' ? 'text-blue-600' :
                    qualityMetrics.level === 'medium' ? 'text-yellow-600' : 'text-red-600'
                  }">
                    {qualityMetrics.total}/100
                  </span>
                </div>
                <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div 
                    class="h-3 rounded-full transition-all duration-500 {
                      qualityMetrics.level === 'excellent' ? 'bg-green-500' :
                      qualityMetrics.level === 'high' ? 'bg-blue-500' :
                      qualityMetrics.level === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                    }"
                    style="width: {qualityMetrics.total}%"
                  ></div>
                </div>
              </div>

              <!-- 세부 점수 (2x2 그리드로 변경) -->
              <div class="grid grid-cols-2 gap-3 mb-6">
                <div class="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div class="text-xl font-bold text-blue-600">{Math.round(qualityMetrics.completeness * 100) / 100}</div>
                  <div class="text-xs text-gray-600 dark:text-gray-400">완성도</div>
                </div>
                <div class="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div class="text-xl font-bold text-green-600">{Math.round(qualityMetrics.clarity * 100) / 100}</div>
                  <div class="text-xs text-gray-600 dark:text-gray-400">명확성</div>
                </div>
                <div class="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div class="text-xl font-bold text-purple-600">{Math.round(qualityMetrics.specificity * 100) / 100}</div>
                  <div class="text-xs text-gray-600 dark:text-gray-400">구체성</div>
                </div>
                <div class="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div class="text-xl font-bold text-orange-600">{Math.round(qualityMetrics.structure * 100) / 100}</div>
                  <div class="text-xs text-gray-600 dark:text-gray-400">구조화</div>
                </div>
              </div>

              <!-- 적용된 기법 -->
              <div class="mb-4">
                <h3 class="font-semibold text-gray-700 dark:text-gray-300 mb-2">적용된 기법</h3>
                <div class="flex flex-wrap gap-2">
                  {#each qualityMetrics.appliedTechniques as technique}
                    <span class="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-xs">
                      {technique}
                    </span>
                  {/each}
                </div>
              </div>

              <!-- 개선 제안 -->
              {#if qualityMetrics.suggestions.length > 0}
                <div>
                  <h3 class="font-semibold text-gray-700 dark:text-gray-300 mb-2">💡 개선 제안</h3>
                  <ul class="space-y-2">
                    {#each qualityMetrics.suggestions.slice(0, 3) as suggestion}
                      <li class="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <span class="text-yellow-500 mt-0.5">💡</span>
                        {suggestion}
                      </li>
                    {/each}
                  </ul>
                </div>
              {/if}
            </div>
          {/if}
          
        {:else}
          <!-- 프롬프트 생성 안내 및 생성 버튼 -->
          <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-xl p-16 text-center border border-white/30 dark:border-gray-700/40 enhanced-shadow card-hover">
            <div class="mb-8">
              <div class="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl shadow-2xl flex items-center justify-center mx-auto mb-6 transform hover:rotate-12 transition-transform duration-500">
                <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              </div>
            </div>
            <h2 class="text-3xl font-bold text-gray-800 dark:text-white mb-6">
              Generate Your Prompt
            </h2>
            <p class="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              5W1H 정보를 입력하고 원하는 옵션을 설정한 후<br>
              <span class="font-semibold text-blue-600 dark:text-blue-400">생성 버튼을 눌러 최적화된 프롬프트를 만들어보세요</span>
            </p>
            
            {#if hasMinimumInput}
              <!-- 생성 버튼 -->
              <button
                on:click={generatePrompt}
                disabled={isGenerating}
                class="group relative inline-flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 active:scale-95 mb-6"
              >
                {#if isGenerating}
                  <svg class="w-6 h-6 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                  </svg>
                  프롬프트 생성 중...
                {:else}
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                  프롬프트 생성하기
                {/if}
                <div class="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
              </button>
            {:else}
              <!-- 입력 안내 -->
              <div class="inline-flex items-center gap-3 px-6 py-3 bg-yellow-100/80 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200 rounded-xl backdrop-blur-sm border border-yellow-200/50 dark:border-yellow-700/50 mb-6">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.5 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                </svg>
                <span class="font-medium">최소한 "WHAT" 항목을 입력해주세요</span>
              </div>
            {/if}
            
            <div class="inline-flex items-center gap-3 px-6 py-3 bg-blue-100/80 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 rounded-xl backdrop-blur-sm border border-blue-200/50 dark:border-blue-700/50">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
              </svg>
              <span class="font-medium">5W1H전략과 최신 AI 기법으로 더 정확한 답변을 얻어보세요</span>
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>

<!-- 템플릿 저장 모달 -->
{#if showTemplateModal}
  <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
       transition:fade={{ duration: 200 }}>
    <div class="save-modal bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full border border-white/20 dark:border-gray-700/30 premium-scrollbar"
         transition:scale={{ duration: 200, easing: quintOut }}>
      <div class="rounded-scroll-content space-y-6">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12"/>
              </svg>
            </div>
            <div>
              <h3 class="text-xl font-bold text-gray-800 dark:text-white">
                템플릿 저장
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                현재 설정을 템플릿으로 저장
              </p>
            </div>
          </div>
        </div>

        <div>
          <label for="templateName" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            템플릿 이름
          </label>
          <input
            id="templateName"
            type="text"
            bind:value={newTemplateName}
            placeholder="템플릿 이름을 입력하세요"
            class="w-full px-4 py-3 border-2 border-gray-200/60 dark:border-gray-600/60 rounded-xl bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
          />
        </div>

        <div class="flex gap-3">
          <button
            on:click={(e) => {
              e.stopPropagation();
              showTemplateModal = false;
              enableBodyScroll();
            }}
            class="flex-1 px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-xl font-semibold transition-colors duration-200"
          >
            취소
          </button>
          <button
            on:click={(e) => {
              e.stopPropagation();
              saveCurrentAsTemplate();
            }}
            disabled={!newTemplateName.trim()}
            class="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-colors duration-200"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}

<!-- 템플릿 미리보기 모달 -->
{#if previewTemplate}
  <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
       transition:fade={{ duration: 200 }}>
    <div class="preview-modal bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/20 dark:border-gray-700/30 premium-scrollbar"
         transition:scale={{ duration: 200, easing: quintOut }}>
      <div class="space-y-6">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
              </svg>
            </div>
            <div>
              <h3 class="text-2xl font-bold text-gray-800 dark:text-white">
                {previewTemplate.name}
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {new Date(previewTemplate.createdAt).toLocaleDateString('ko-KR')} 생성
              </p>
            </div>
          </div>
          <button
            on:click={() => {
              previewTemplate = null;
              enableBodyScroll();
            }}
            class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
          >
            <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- 템플릿 내용 미리보기 -->
        {#if previewTemplate}
          <div class="space-y-6">
            <!-- 5W1H 데이터 -->
            <div>
              <h4 class="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                5W1H 입력 데이터
              </h4>
              <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {#each fields as field}
                  {#if previewTemplate.data[field.key].length > 0}
                    <div class="bg-gray-50/80 dark:bg-gray-700/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 dark:border-gray-600/50">
                      <div class="flex items-center gap-2 mb-3">
                        <span class="p-1.5 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-lg text-blue-600 dark:text-blue-400">
                          {@html getFieldIcon(field.key)}
                        </span>
                        <h5 class="font-semibold text-gray-800 dark:text-white">{field.label}</h5>
                      </div>
                      <div class="space-y-2">
                        {#each previewTemplate.data[field.key] as item}
                          {#if item.value.trim()}
                            <div class="p-2 bg-white/70 dark:bg-gray-600/70 rounded-lg text-sm text-gray-700 dark:text-gray-300">
                              {item.value}
                            </div>
                          {/if}
                        {/each}
                      </div>
                    </div>
                  {/if}
                {/each}
              </div>
            </div>

            <!-- 저장된 설정 옵션들 -->
            {#if previewTemplate.options}
              <div>
                <h4 class="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  저장된 설정
                </h4>
                <div class="grid gap-4 md:grid-cols-2">
                  <!-- 기본 설정 -->
                  <div class="bg-gray-50/80 dark:bg-gray-700/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 dark:border-gray-600/50">
                    <h5 class="font-semibold text-gray-800 dark:text-white mb-3">기본 설정</h5>
                    <div class="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                      <div><span class="font-medium">기법:</span> {techniqueOptions.find(t => t.value === previewTemplate?.options?.technique)?.label || '알 수 없음'}</div>
                      <div><span class="font-medium">출력 형식:</span> {outputFormatOptions.find(f => f.value === previewTemplate?.options?.outputFormat)?.label || '알 수 없음'}</div>
                      <div><span class="font-medium">추론 과정:</span> {previewTemplate?.options?.reasoning ? '포함' : '미포함'}</div>
                      <div><span class="font-medium">단계별 설명:</span> {previewTemplate?.options?.includeStepByStep ? '포함' : '미포함'}</div>
                      {#if previewTemplate?.options?.expertRole}
                        <div><span class="font-medium">전문가 역할:</span> {previewTemplate.options.expertRole}</div>
                      {/if}
                    </div>
                  </div>

                  <!-- 고급 설정 -->
                  <div class="bg-gray-50/80 dark:bg-gray-700/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 dark:border-gray-600/50">
                    <h5 class="font-semibold text-gray-800 dark:text-white mb-3">고급 설정</h5>
                    <div class="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                      <div><span class="font-medium">체인 길이:</span> {previewTemplate?.options?.chainLength}단계</div>
                      <div><span class="font-medium">추론 경로:</span> {previewTemplate?.options?.consistencyPaths}개</div>
                      <div><span class="font-medium">탐색 깊이:</span> {previewTemplate?.options?.treeDepth}단계</div>
                      <div><span class="font-medium">품질 게이트:</span> {previewTemplate?.options?.qualityGate}점</div>
                      <div><span class="font-medium">최대 토큰:</span> {previewTemplate?.options?.maxTokens}개</div>
                      <div><span class="font-medium">다양성 증대:</span> {previewTemplate?.options?.diversityBoost ? '활성화' : '비활성화'}</div>
                      <div><span class="font-medium">반복 개선:</span> {previewTemplate?.options?.iterativeRefinement ? '활성화' : '비활성화'}</div>
                    </div>
                  </div>
                </div>
              </div>
            {/if}
          </div>
        {/if}

        <!-- 액션 버튼 -->
        <div class="flex gap-3 mt-8">
          <button
            on:click={() => {
              previewTemplate = null;
              enableBodyScroll();
            }}
            class="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-xl font-semibold transition-colors duration-200"
          >
            닫기
          </button>
          <button
            on:click={(e) => {
              e.stopPropagation();
              startEditingTemplate();
            }}
            class="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl font-semibold transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
            </svg>
            편집
          </button>
          <button
            on:click={() => {
              if (previewTemplate) {
                loadUserTemplate(previewTemplate);
                closeAllModals();
              }
            }}
            class="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-semibold transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
            </svg>
            불러오기
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}

<!-- Portal 드롭다운들 (body에 렌더링) -->
<!-- 템플릿 선택 드롭다운 -->
{#if templateSelectOpen && templateButtonRect}
  <div 
    class="portal-dropdown fixed z-[99999] bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 max-h-80 overflow-y-auto"
    style="top: {templateButtonRect.top}px; left: {templateButtonRect.left}px; width: {templateButtonRect.width}px;"
    transition:slide={{ duration: 200, easing: quintOut }}
    on:mouseenter={keepTemplateOpen}
    on:mouseleave={handleTemplateLeave}
  >
    {#each templateOptions as group}
      <div class="select-optgroup">{group.categoryName}</div>
      {#each group.templates as template}
        <div 
          class="select-option {formData.templateId === template.id ? 'selected' : ''}"
          on:click={() => {
            formData.templateId = template.id;
            templateSelectOpen = false;
            // 템플릿 변경 시 생성된 프롬프트 초기화
            onSettingChange();
          }}
          role="option"
          tabindex="0"
        >
          <span class="block truncate">{template.name}</span>
        </div>
      {/each}
    {/each}
  </div>
{/if}

<!-- 기법 선택 드롭다운 -->
{#if techniqueSelectOpen && techniqueButtonRect}
  <div 
    class="portal-dropdown fixed z-[99999] bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 max-h-80 overflow-y-auto"
    style="top: {techniqueButtonRect.top}px; left: {techniqueButtonRect.left}px; width: {techniqueButtonRect.width}px;"
    transition:slide={{ duration: 200, easing: quintOut }}
    on:mouseenter={keepTechniqueOpen}
    on:mouseleave={handleTechniqueLeave}
  >
    {#each techniqueOptions as option}
      <div 
        class="select-option {promptOptions.technique === option.value ? 'selected' : ''}"
        on:click={() => {
          promptOptions.technique = option.value;
          techniqueSelectOpen = false;
          // 기법 변경 시 생성된 프롬프트 초기화
          onSettingChange();
        }}
        role="option"
        tabindex="0"
      >
        <span class="block truncate">{option.label}</span>
      </div>
    {/each}
  </div>
{/if}

<!-- 출력 형식 선택 드롭다운 -->
{#if outputFormatSelectOpen && outputFormatButtonRect}
  <div 
    class="portal-dropdown fixed z-[99999] bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 max-h-48 overflow-y-auto"
    style="top: {outputFormatButtonRect.top}px; left: {outputFormatButtonRect.left}px; width: {outputFormatButtonRect.width}px;"
    transition:slide={{ duration: 200, easing: quintOut }}
    on:mouseenter={keepOutputFormatOpen}
    on:mouseleave={handleOutputFormatLeave}
  >
    {#each outputFormatOptions as option}
      <div 
        class="select-option {promptOptions.outputFormat === option.value ? 'selected' : ''}"
        on:click={() => {
          promptOptions.outputFormat = option.value as 'text' | 'json' | 'markdown' | 'structured';
          outputFormatSelectOpen = false;
          // 출력 형식 변경 시 생성된 프롬프트 초기화
          onSettingChange();
        }}
        role="option"
        tabindex="0"
      >
        <span class="block truncate">{option.label}</span>
      </div>
    {/each}
  </div>
{/if}

{#if isEditingTemplate && previewTemplate && editingTemplateData && editingTemplateOptions}
  <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      transition:fade={{ duration: 200 }}>
    <div class="edit-modal bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-6xl w-full max-h-[90vh] overflow-y-auto border border-white/20 dark:border-gray-700/30 premium-scrollbar"
        transition:scale={{ duration: 200, easing: quintOut }}>
      <div class="rounded-scroll-content space-y-8">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
              </svg>
            </div>
            <div>
              <h3 class="text-2xl font-bold text-gray-800 dark:text-white">
                템플릿 편집
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                5W1H 데이터와 설정을 수정할 수 있습니다
              </p>
            </div>
          </div>
          <button
            on:click={(e) => {
              e.stopPropagation();
              closeEditingModal();
            }}
            class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
          >
            <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div class="space-y-8">
          <!-- 템플릿 이름 편집 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              템플릿 이름
            </label>
            <input
              type="text"
              bind:value={previewTemplate.name}
              placeholder="템플릿 이름을 입력하세요"
              on:click={(e) => e.stopPropagation()}
              class="w-full px-4 py-3 border-2 border-gray-200/60 dark:border-gray-600/60 rounded-xl bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
            />
          </div>

          <!-- 5W1H 데이터 편집 -->
          <div>
            <h4 class="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              5W1H 입력 데이터 편집
            </h4>
            <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {#each fields as field}
                <div class="bg-gray-50/80 dark:bg-gray-700/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 dark:border-gray-600/50">
                  <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center gap-2">
                      <span class="p-1.5 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-lg text-blue-600 dark:text-blue-400">
                        {@html getFieldIcon(field.key)}
                      </span>
                      <h5 class="font-semibold text-gray-800 dark:text-white">{field.label}</h5>
                    </div>
                    <button
                      on:click={(e) => {
                        e.stopPropagation();
                        addEditingItem(field.key);
                      }}
                      class="w-6 h-6 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition-colors duration-200"
                      title="항목 추가"
                    >
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                      </svg>
                    </button>
                  </div>
                  <div class="space-y-2">
                    {#each editingTemplateData[field.key] as item, index}
                      <div class="flex gap-2">
                        <input
                          type="text"
                          bind:value={item.value}
                          placeholder={field.placeholder}
                          on:click={(e) => e.stopPropagation()}
                          class="flex-1 px-3 py-2 bg-white/70 dark:bg-gray-600/70 rounded-lg text-sm text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                        />
                        <button
                          on:click={(e) => {
                            e.stopPropagation();
                            removeEditingItem(field.key, item.id);
                          }}
                          class="w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center justify-center transition-colors duration-200"
                          title="항목 삭제"
                        >
                          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                          </svg>
                        </button>
                      </div>
                    {/each}
                    {#if editingTemplateData[field.key].length === 0}
                      <div class="text-sm text-gray-500 dark:text-gray-400 italic text-center py-2">
                        항목이 없습니다. 위의 + 버튼을 눌러 추가하세요.
                      </div>
                    {/if}
                  </div>
                </div>
              {/each}
            </div>
          </div>

          <!-- 기본 설정 편집 -->
          <div>
            <h4 class="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              기본 설정 편집
            </h4>
            <div class="grid gap-4 md:grid-cols-2">
              <!-- 기법 선택 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">프롬프트 기법</label>
                <select
                  bind:value={editingTemplateOptions.technique}
                  on:click={(e) => e.stopPropagation()}
                  class="w-full px-4 py-3 border-2 border-gray-200/60 dark:border-gray-600/60 rounded-xl bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                >
                  {#each techniqueOptions as option}
                    <option value={option.value}>{option.label}</option>
                  {/each}
                </select>
              </div>

              <!-- 출력 형식 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">출력 형식</label>
                <select
                  bind:value={editingTemplateOptions.outputFormat}
                  on:click={(e) => e.stopPropagation()}
                  class="w-full px-4 py-3 border-2 border-gray-200/60 dark:border-gray-600/60 rounded-xl bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                >
                  {#each outputFormatOptions as option}
                    <option value={option.value}>{option.label}</option>
                  {/each}
                </select>
              </div>

              <!-- 전문가 역할 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">전문가 역할 (선택사항)</label>
                <input
                  type="text"
                  bind:value={editingTemplateOptions.expertRole}
                  placeholder="예: 마케팅 전문가, 데이터 분석가"
                  on:click={(e) => e.stopPropagation()}
                  class="w-full px-4 py-3 border-2 border-gray-200/60 dark:border-gray-600/60 rounded-xl bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                />
              </div>

              <!-- 최대 토큰 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  최대 토큰 수: {editingTemplateOptions.maxTokens}
                </label>
                <input
                  type="range"
                  bind:value={editingTemplateOptions.maxTokens}
                  min="100"
                  max="4000"
                  step="100"
                  on:click={(e) => e.stopPropagation()}
                  class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600"
                />
              </div>
            </div>

            <!-- 체크박스 옵션들 -->
            <div class="grid gap-4 md:grid-cols-2 mt-4">
              <label class="flex items-center gap-3 cursor-pointer" on:click={(e) => e.stopPropagation()}>
                <input
                  type="checkbox"
                  bind:checked={editingTemplateOptions.reasoning}
                  on:click={(e) => e.stopPropagation()}
                  class="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">추론 과정 포함</span>
              </label>

              <label class="flex items-center gap-3 cursor-pointer" on:click={(e) => e.stopPropagation()}>
                <input
                  type="checkbox"
                  bind:checked={editingTemplateOptions.includeStepByStep}
                  on:click={(e) => e.stopPropagation()}
                  class="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">단계별 설명 포함</span>
              </label>

              <label class="flex items-center gap-3 cursor-pointer" on:click={(e) => e.stopPropagation()}>
                <input
                  type="checkbox"
                  bind:checked={editingTemplateOptions.diversityBoost}
                  on:click={(e) => e.stopPropagation()}
                  class="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">다양성 증대</span>
              </label>

              <label class="flex items-center gap-3 cursor-pointer" on:click={(e) => e.stopPropagation()}>
                <input
                  type="checkbox"
                  bind:checked={editingTemplateOptions.iterativeRefinement}
                  on:click={(e) => e.stopPropagation()}
                  class="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">반복 개선</span>
              </label>
            </div>
          </div>
        </div>

        <!-- 액션 버튼 -->
        <div class="flex gap-3 mt-8">
          <button
            on:click={(e) => {
              e.stopPropagation();
              closeEditingModal();
            }}
            class="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-xl font-semibold transition-colors duration-200"
          >
            취소
          </button>
          <button
            on:click={(e) => {
              e.stopPropagation();
              saveEditedTemplate();
            }}
            class="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-semibold transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            변경사항 저장
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}