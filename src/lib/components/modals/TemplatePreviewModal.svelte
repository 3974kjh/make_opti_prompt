<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { fade, scale } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  import type { UserTemplate, PromptFormData, PromptGenerationOptions } from '$lib/types/prompt';

  // Props
  export let isOpen: boolean = false;
  export let template: UserTemplate | null = null;
  export let fields: Array<{
    key: keyof Omit<PromptFormData, 'templateId'>;
    label: string;
    placeholder: string;
    required?: boolean;
    examples: string[];
  }> = [];
  export let techniqueOptions: Array<{ value: string; label: string }> = [];
  export let outputFormatOptions: Array<{ value: string; label: string }> = [];

  // Event dispatcher
  const dispatch = createEventDispatcher<{
    close: void;
    edit: { template: UserTemplate };
    load: { template: UserTemplate };
  }>();

  // 필드 아이콘 가져오기 함수
  function getFieldIcon(fieldKey: string): string {
    const icons: Record<string, string> = {
      who: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>',
      what: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>',
      when: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
      where: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>',
      why: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
      how: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>'
    };
    return icons[fieldKey] || '';
  }

  // 모달 닫기
  function closeModal() {
    dispatch('close');
  }

  // 템플릿 편집
  function editTemplate() {
    if (template) {
      dispatch('edit', { template });
    }
  }

  // 템플릿 불러오기
  function loadTemplate() {
    if (template) {
      dispatch('load', { template });
    }
  }

  // 키보드 이벤트 처리
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      closeModal();
    }
  }
</script>

{#if isOpen && template}
  <div 
    class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    transition:fade={{ duration: 200 }}
    on:click={closeModal}
    on:keydown={handleKeydown}
    role="dialog"
    aria-modal="true"
    aria-labelledby="preview-modal-title"
  >
    <div 
      class="preview-modal bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] border border-white/20 dark:border-gray-700/30 flex flex-col"
      transition:scale={{ duration: 200, easing: quintOut }}
      on:click={(e) => e.stopPropagation()}
    >
      <!-- 고정 헤더 -->
      <div class="flex items-center justify-between p-4 border-b border-gray-200/50 dark:border-gray-600/50">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
            </svg>
          </div>
          <div>
            <h3 id="preview-modal-title" class="text-2xl font-bold text-gray-800 dark:text-white">
              {template.name}
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {new Date(template.createdAt).toLocaleDateString('ko-KR')} 생성
            </p>
          </div>
        </div>
        <button
          on:click={closeModal}
          class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
          aria-label="모달 닫기"
        >
          <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- 스크롤 가능한 컨텐츠 영역 -->
      <div class="flex-1 overflow-y-auto premium-scrollbar p-8 pt-4">
        <!-- 템플릿 내용 미리보기 -->
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
                {#if template.data[field.key].length > 0}
                  <div class="bg-gray-50/80 dark:bg-gray-700/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 dark:border-gray-600/50">
                    <div class="flex items-center gap-2 mb-3">
                      <span class="p-1.5 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-lg text-blue-600 dark:text-blue-400">
                        {@html getFieldIcon(field.key)}
                      </span>
                      <h5 class="font-semibold text-gray-800 dark:text-white">{field.label}</h5>
                    </div>
                    <div class="space-y-2">
                      {#each template.data[field.key] as item}
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
          {#if template.options}
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
                    <div><span class="font-medium">기법:</span> {techniqueOptions.find(t => t.value === template?.options?.technique)?.label || '알 수 없음'}</div>
                    <div><span class="font-medium">출력 형식:</span> {outputFormatOptions.find(f => f.value === template?.options?.outputFormat)?.label || '알 수 없음'}</div>
                    <div><span class="font-medium">추론 과정:</span> {template?.options?.reasoning ? '포함' : '미포함'}</div>
                    <div><span class="font-medium">단계별 설명:</span> {template?.options?.includeStepByStep ? '포함' : '미포함'}</div>
                    {#if template?.options?.expertRole}
                      <div><span class="font-medium">전문가 역할:</span> {template.options.expertRole}</div>
                    {/if}
                  </div>
                </div>

                <!-- 고급 설정 -->
                <div class="bg-gray-50/80 dark:bg-gray-700/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 dark:border-gray-600/50">
                  <h5 class="font-semibold text-gray-800 dark:text-white mb-3">고급 설정</h5>
                  <div class="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <div><span class="font-medium">체인 길이:</span> {template?.options?.chainLength}단계</div>
                    <div><span class="font-medium">추론 경로:</span> {template?.options?.consistencyPaths}개</div>
                    <div><span class="font-medium">탐색 깊이:</span> {template?.options?.treeDepth}단계</div>
                    <div><span class="font-medium">품질 게이트:</span> {template?.options?.qualityGate}점</div>
                    <div><span class="font-medium">최대 토큰:</span> {template?.options?.maxTokens}개</div>
                    <div><span class="font-medium">다양성 증대:</span> {template?.options?.diversityBoost ? '활성화' : '비활성화'}</div>
                    <div><span class="font-medium">반복 개선:</span> {template?.options?.iterativeRefinement ? '활성화' : '비활성화'}</div>
                  </div>
                </div>
              </div>
            </div>
          {/if}
        </div>
      </div>

      <!-- 고정 하단 버튼 -->
      <div class="border-t border-gray-200/50 dark:border-gray-600/50 p-4">
        <div class="flex gap-3">
          <button
            on:click={closeModal}
            class="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-xl font-semibold transition-colors duration-200"
          >
            닫기
          </button>
          <button
            on:click={editTemplate}
            class="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl font-semibold transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
            </svg>
            편집
          </button>
          <button
            on:click={loadTemplate}
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

<style>
  .premium-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
  }

  .premium-scrollbar::-webkit-scrollbar {
    width: 8px;
  }

  .premium-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }

  .premium-scrollbar::-webkit-scrollbar-thumb {
    background-color: rgba(156, 163, 175, 0.5);
    border-radius: 20px;
    border: 2px solid transparent;
  }

  .premium-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: rgba(156, 163, 175, 0.7);
  }
</style> 