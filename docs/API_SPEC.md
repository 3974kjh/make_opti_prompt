# 데이터 구조 명세서

> Frontend Only 프로젝트이므로 API 대신 내부 데이터 구조와 localStorage 스키마를 정의합니다.

## 📊 Core Data Types

### PromptFormData
```typescript
interface PromptFormData {
  who: string;      // 누가 (주체)
  what: string;     // 무엇을 (객체/내용)
  when: string;     // 언제 (시간)
  where: string;    // 어디서 (장소/범위)
  how: string;      // 어떻게 (방법)
  why: string;      // 왜 (목적/이유)
}
```

### GeneratedPrompt
```typescript
interface GeneratedPrompt {
  id: string;                    // 고유 식별자
  raw: string;                   // 생성된 원본 프롬프트
  formatted: string;             // LLM에 최적화된 포맷된 프롬프트
  timestamp: string;             // ISO 8601 형식의 생성 시간
  templateType: TemplateType;    // 사용된 템플릿 타입
  metadata: PromptMetadata;      // 추가 메타데이터
}
```

### PromptTemplate
```typescript
interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  type: TemplateType;
  fields: TemplateField[];
  example?: string;
  tips?: string[];
}

interface TemplateField {
  id: string;
  label: string;
  placeholder: string;
  required: boolean;
  type: 'text' | 'textarea' | 'select';
  options?: string[];           // select type일 때만
  maxLength?: number;
}
```

### PromptHistory
```typescript
interface PromptHistory {
  prompts: GeneratedPrompt[];
  favorites: string[];          // prompt IDs
  lastAccessed: string;         // ISO timestamp
  totalCount: number;
}
```

## 🗄️ localStorage Schema

### 저장 키 정의
```typescript
const STORAGE_KEYS = {
  PROMPT_HISTORY: 'prompt_optimizer_history',
  USER_PREFERENCES: 'prompt_optimizer_preferences',
  DRAFT_DATA: 'prompt_optimizer_draft',
  TEMPLATES: 'prompt_optimizer_templates'
} as const;
```

### 데이터 저장 구조
```typescript
// localStorage['prompt_optimizer_history']
interface StoredHistory {
  version: string;              // 데이터 스키마 버전
  prompts: GeneratedPrompt[];
  favorites: string[];
  createdAt: string;
  updatedAt: string;
}

// localStorage['prompt_optimizer_preferences']
interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  defaultTemplate: string;
  autoSave: boolean;
  maxHistoryItems: number;
  language: 'ko' | 'en';
}

// localStorage['prompt_optimizer_draft']
interface DraftData {
  formData: PromptFormData;
  templateId: string;
  lastSaved: string;
}
```

## 🏷️ Enum Types

### TemplateType
```typescript
enum TemplateType {
  ANALYSIS = 'analysis',           // 분석용
  CREATIVE = 'creative',           // 창작용
  PROBLEM_SOLVING = 'problem_solving', // 문제해결용
  LEARNING = 'learning',           // 학습용
  CODE_REVIEW = 'code_review',     // 코드리뷰용
  TRANSLATION = 'translation',     // 번역용
  CUSTOM = 'custom'                // 사용자 정의
}
```

### PromptStatus
```typescript
enum PromptStatus {
  DRAFT = 'draft',
  GENERATED = 'generated',
  COPIED = 'copied',
  FAVORITED = 'favorited'
}
```

## 📋 Helper Types

### Component Props Types
```typescript
// PromptForm 컴포넌트 props
interface PromptFormProps {
  initialData?: Partial<PromptFormData>;
  template?: PromptTemplate;
  onSubmit: (data: PromptFormData) => void;
  onSaveDraft?: (data: PromptFormData) => void;
}

// TemplateSelector 컴포넌트 props
interface TemplateSelectorProps {
  templates: PromptTemplate[];
  selectedId?: string;
  onSelect: (template: PromptTemplate) => void;
}

// PromptOutput 컴포넌트 props
interface PromptOutputProps {
  prompt: GeneratedPrompt;
  onCopy: (text: string) => void;
  onSave?: (prompt: GeneratedPrompt) => void;
  onFavorite?: (id: string) => void;
}
```

### API Response Types (Internal)
```typescript
// 내부 서비스 응답 타입
interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

// 프롬프트 생성 서비스 응답
type GeneratePromptResponse = ServiceResponse<GeneratedPrompt>;

// 히스토리 조회 서비스 응답
type GetHistoryResponse = ServiceResponse<PromptHistory>;
```

## 🔧 Utility Types

### Form Validation
```typescript
interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

interface FieldValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => string | null;
}
```

### Search and Filter
```typescript
interface HistoryFilter {
  templateType?: TemplateType;
  dateRange?: {
    start: string;
    end: string;
  };
  keyword?: string;
  isFavorite?: boolean;
}

interface SearchResult {
  prompts: GeneratedPrompt[];
  total: number;
  hasMore: boolean;
}
```

## 📊 Default Values

### 기본 템플릿 데이터
```typescript
const DEFAULT_TEMPLATES: PromptTemplate[] = [
  {
    id: 'basic_six_w',
    name: '기본 육하원칙',
    description: '가장 기본적인 육하원칙 기반 프롬프트',
    type: TemplateType.ANALYSIS,
    fields: [
      { id: 'who', label: '누가', placeholder: '주체나 대상을 입력하세요', required: false, type: 'text' },
      { id: 'what', label: '무엇을', placeholder: '구체적인 내용을 입력하세요', required: true, type: 'textarea' },
      { id: 'when', label: '언제', placeholder: '시점이나 기간을 입력하세요', required: false, type: 'text' },
      { id: 'where', label: '어디서', placeholder: '위치나 범위를 입력하세요', required: false, type: 'text' },
      { id: 'how', label: '어떻게', placeholder: '방법이나 절차를 입력하세요', required: false, type: 'textarea' },
      { id: 'why', label: '왜', placeholder: '목적이나 이유를 입력하세요', required: false, type: 'textarea' }
    ]
  }
];
```

### 기본 설정값
```typescript
const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'system',
  defaultTemplate: 'basic_six_w',
  autoSave: true,
  maxHistoryItems: 100,
  language: 'ko'
};
```

## 🚫 데이터 제약사항
- **localStorage 최대 용량**: 5MB (브라우저별 차이 있음)
- **히스토리 최대 개수**: 100개 (사용자 설정 가능)
- **프롬프트 최대 길이**: 10,000자
- **각 필드 최대 길이**: 2,000자
- **템플릿 최대 개수**: 20개 