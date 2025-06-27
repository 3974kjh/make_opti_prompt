// 육하원칙 기반 프롬프트 폼 데이터
export interface PromptFormData {
  who: DynamicItem[];      // 누가 - 여러 항목 가능
  what: DynamicItem[];     // 무엇을 - 여러 항목 가능  
  when: DynamicItem[];     // 언제 - 여러 항목 가능
  where: DynamicItem[];    // 어디서 - 여러 항목 가능
  why: DynamicItem[];      // 왜 - 여러 항목 가능
  how: DynamicItem[];      // 어떻게 - 여러 항목 가능
  templateId: string;
}

// 생성되고 저장되는 프롬프트 데이터
export interface PromptData {
  id: string;              // 고유 식별자 (UUID)
  title: string;           // 프롬프트 제목
  formData: PromptFormData; // 원본 입력 데이터
  generated: string;       // 생성된 최종 프롬프트
  templateId: string;      // 사용된 템플릿 ID
  quality?: number;        // 품질 점수 (0-100)
  tags?: string[];         // 태그 목록
  isFavorite: boolean;     // 즐겨찾기 여부
  createdAt: Date;         // 생성 시간
  updatedAt: Date;         // 수정 시간
}

// 동적 항목을 위한 타입
export interface DynamicItem {
  id: string;
  value: string;
}

// 프롬프트 엔지니어링 기법 (최신 기법 추가)
export enum PromptTechnique {
  ZERO_SHOT = 'zero_shot',
  FEW_SHOT = 'few_shot',
  CHAIN_OF_THOUGHT = 'chain_of_thought',
  TREE_OF_THOUGHT = 'tree_of_thought',
  SELF_CONSISTENCY = 'self_consistency',
  REFLECTION = 'reflection',
  EXPERT_PROMPTING = 'expert_prompting',
  STEP_BY_STEP = 'step_by_step',
  // 새로운 고급 기법들
  RAG = 'rag',                           // Retrieval Augmented Generation
  REACT = 'react',                       // Reasoning and Acting
  PROMPT_CHAINING = 'prompt_chaining',   // 프롬프트 체이닝
  GENERATED_KNOWLEDGE = 'generated_knowledge', // 생성된 지식
  LEAST_TO_MOST = 'least_to_most',       // 최소에서 최대로
  ANALOGICAL = 'analogical',             // 유추적 프롬프팅
  DIRECTIONAL_STIMULUS = 'directional_stimulus', // 방향성 자극
  META_PROMPTING = 'meta_prompting',     // 메타 프롬프팅
  MULTIMODAL_COT = 'multimodal_cot',     // 멀티모달 CoT
  ACTIVE_PROMPT = 'active_prompt'        // 액티브 프롬프팅
}

// 프롬프트 카테고리
export enum PromptCategory {
  GENERAL = 'general',
  ANALYSIS = 'analysis', 
  CREATIVE = 'creative',
  PROBLEM_SOLVING = 'problem_solving',
  LEARNING = 'learning',
  CODING = 'coding',
  BUSINESS = 'business',
  RESEARCH = 'research'
}

// Few-shot 예시 구조
export interface FewShotExample {
  input: Partial<PromptFormData>;
  output: string;
  reasoning?: string;
}

// Tree of Thoughts 노드
export interface ToTNode {
  id: string;
  content: string;
  score: number;
  depth: number;
  parentId?: string;
  children: ToTNode[];
  isSelected: boolean;
}

// Self-Consistency 추론 경로
export interface ReasoningPath {
  id: string;
  steps: string[];
  conclusion: string;
  confidence: number;
}

// RAG 검색 결과
export interface RetrievalResult {
  content: string;
  source: string;
  relevanceScore: number;
  metadata?: Record<string, any>;
}

// ReAct 액션
export interface ReActAction {
  type: 'thought' | 'action' | 'observation';
  content: string;
  toolUsed?: string;
  result?: string;
}

// 프롬프트 체인 단계
export interface ChainStep {
  id: string;
  prompt: string;
  output?: string;
  dependsOn?: string[];
}

// 프롬프트 생성 템플릿 (확장)
export interface PromptTemplate {
  id: string;
  name: string;
  category: PromptCategory;
  description: string;
  template: string;
  examples?: string[];
  techniques: PromptTechnique[];  // 적용 가능한 기법들
  systemPrompt?: string;          // 시스템 프롬프트
  fewShotExamples?: FewShotExample[];  // Few-shot 예시들
  chainOfThoughtSteps?: string[];      // CoT 단계들
  expertRoles?: string[];              // 전문가 역할들
  // 새로운 필드들
  treeOfThoughtBranches?: string[];    // ToT 분기 옵션들
  knowledgeBase?: string[];            // 지식 베이스 참조
  chainSteps?: ChainStep[];            // 체인 단계들
  analogies?: string[];                // 유추 예시들
  stimulusHints?: string[];            // 방향성 힌트들
  metaInstructions?: string;           // 메타 지시사항
  qualityThreshold?: number;           // 품질 임계값
}

// 품질 레벨
export enum QualityLevel {
  LOW = 'low',           // 낮음 (0-30)
  MEDIUM = 'medium',     // 보통 (31-60)
  HIGH = 'high',         // 높음 (61-85)
  EXCELLENT = 'excellent' // 우수 (86-100)
}

// 프롬프트 품질 메트릭 (강화)
export interface QualityMetrics {
  total: number;
  completeness: number;      // 완성도 (0-25)
  clarity: number;          // 명확성 (0-25) 
  specificity: number;      // 구체성 (0-25)
  structure: number;        // 구조화 (0-25)
  level: 'excellent' | 'high' | 'medium' | 'low';
  suggestions: string[];
  appliedTechniques: PromptTechnique[];  // 적용된 기법들
  expertiseLevel: 'beginner' | 'intermediate' | 'advanced';  // 전문성 수준
  // 새로운 메트릭들
  reasoning: number;        // 추론 품질 (0-20)
  creativity: number;       // 창의성 (0-20)
  coherence: number;        // 일관성 (0-20)
  adaptability: number;     // 적응성 (0-20)
  tokenEfficiency: number;  // 토큰 효율성 (0-20)
}

// 프롬프트 생성 옵션 (확장)
export interface PromptGenerationOptions {
  technique: PromptTechnique;
  includeExamples: boolean;
  includeStepByStep: boolean;
  expertRole?: string;
  outputFormat?: 'text' | 'json' | 'markdown' | 'structured';
  reasoning: boolean;
  selfConsistency: boolean;
  maxTokens?: number;
  // 새로운 옵션들
  consistencyPaths?: number;        // Self-consistency 경로 수
  treeDepth?: number;              // Tree of Thoughts 깊이
  retrievalSources?: string[];     // RAG 소스들
  chainLength?: number;            // 체인 길이
  diversityBoost?: boolean;        // 다양성 증대 (창의적 관점 추가)
  iterativeRefinement?: boolean;   // 반복 개선
  qualityGate?: number;           // 품질 게이트 (최소 점수 요구)
}

// 검색 필터
export interface PromptSearchFilter {
  query?: string;              // 검색어
  category?: PromptCategory;   // 카테고리 필터
  tags?: string[];            // 태그 필터
  quality?: QualityLevel;     // 품질 필터
  dateRange?: {               // 날짜 범위
    start: Date;
    end: Date;
  };
  isFavorite?: boolean;       // 즐겨찾기만 보기
}

// 사용자 설정
export interface UserSettings {
  preferredTechniques: PromptTechnique[];
  defaultOutputFormat: string;
  expertiseLevel: 'beginner' | 'intermediate' | 'advanced';
  language: 'ko' | 'en';
  saveHistory: boolean;
}

// localStorage 키 정의
export const STORAGE_KEYS = {
  PROMPTS: 'opti_prompt_history',
  TEMPLATES: 'opti_prompt_templates',
  SETTINGS: 'opti_prompt_settings',
  CURRENT_DRAFT: 'opti_prompt_draft'
} as const;

// 입력 검증 규칙
export const VALIDATION_RULES = {
  who: {
    maxLength: 100,
    pattern: /^[a-zA-Z가-힣\s\-.,]*$/
  },
  what: {
    maxLength: 200,
    minLength: 5,
    required: true
  },
  when: {
    maxLength: 100
  },
  where: {
    maxLength: 100
  },
  why: {
    maxLength: 150
  },
  how: {
    maxLength: 150
  }
} as const;

// 프롬프트 히스토리
export interface PromptHistory {
  id: string;
  timestamp: Date;
  formData: PromptFormData;
  generatedPrompt: string;
  template: PromptTemplate;
  options: PromptGenerationOptions;
  qualityMetrics: QualityMetrics;
  userRating?: number;
}

// 프롬프트 최적화 제안 (확장)
export interface OptimizationSuggestion {
  type: 'technique' | 'structure' | 'content' | 'format' | 'advanced';
  title: string;
  description: string;
  beforeExample?: string;
  afterExample?: string;
  impact: 'high' | 'medium' | 'low';
  difficulty: 'easy' | 'medium' | 'hard';
  techniqueRecommendation?: PromptTechnique;
  estimatedImprovement?: number;  // 예상 품질 향상 (%)
} 