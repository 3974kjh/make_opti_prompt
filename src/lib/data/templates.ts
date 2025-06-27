import type { PromptTemplate, FewShotExample } from '$lib/types/prompt';
import { PromptCategory, PromptTechnique } from '$lib/types/prompt';

export const DEFAULT_TEMPLATES: PromptTemplate[] = [
  {
    id: 'general-basic',
    name: '기본 범용 프롬프트',
    category: PromptCategory.GENERAL,
    description: '일반적인 질문이나 요청에 사용할 수 있는 기본 템플릿입니다.',
    template: `다음 요청에 대해 도움을 주세요:

**대상**: {who}
**내용**: {what}
**시점**: {when}
**장소**: {where}
**목적**: {why}
**방법**: {how}

위 정보를 바탕으로 체계적이고 실용적인 답변을 제공해주세요.`,
    techniques: [
      PromptTechnique.ZERO_SHOT,
      PromptTechnique.FEW_SHOT,
      PromptTechnique.CHAIN_OF_THOUGHT,
      PromptTechnique.STEP_BY_STEP,
      PromptTechnique.REFLECTION,
      PromptTechnique.GENERATED_KNOWLEDGE,
      PromptTechnique.META_PROMPTING
    ],
    systemPrompt: '당신은 도움이 되고 정확한 정보를 제공하는 AI 어시스턴트입니다.',
    chainOfThoughtSteps: [
      '주어진 정보를 체계적으로 분석',
      '핵심 요구사항 파악',
      '적절한 해결 방안 도출',
      '실행 가능한 단계별 계획 수립'
    ],
    metaInstructions: '사용자의 요청을 정확히 이해하고, 단계별로 체계적인 답변을 제공하세요.',
    qualityThreshold: 70
  },
  
  {
    id: 'analysis-advanced',
    name: '고급 분석 프롬프트',
    category: PromptCategory.ANALYSIS,
    description: '복잡한 데이터나 상황을 심층 분석할 때 사용하는 고급 템플릿입니다.',
    template: `다음 분석 요청을 수행해주세요:

**분석 대상**: {what}
**분석 주체**: {who}
**분석 시점**: {when}
**분석 환경**: {where}
**분석 목적**: {why}
**분석 방법**: {how}

다각도에서 심층적으로 분석하여 인사이트를 제공해주세요.`,
    techniques: [
      PromptTechnique.TREE_OF_THOUGHT,
      PromptTechnique.SELF_CONSISTENCY,
      PromptTechnique.CHAIN_OF_THOUGHT,
      PromptTechnique.EXPERT_PROMPTING,
      PromptTechnique.RAG,
      PromptTechnique.REACT,
      PromptTechnique.ANALOGICAL,
      PromptTechnique.META_PROMPTING
    ],
    systemPrompt: '당신은 데이터 분석과 전략적 사고에 특화된 전문 분석가입니다.',
    expertRoles: ['데이터 분석가', '비즈니스 분석가', '전략 컨설턴트', '시장 조사 전문가'],
    treeOfThoughtBranches: [
      '정량적 분석 접근',
      '정성적 분석 접근',
      '비교 분석 접근',
      '트렌드 분석 접근'
    ],
    chainOfThoughtSteps: [
      '데이터 수집 및 정리',
      '분석 프레임워크 설정',
      '다각도 분석 수행',
      '패턴 및 인사이트 도출',
      '실행 가능한 권고사항 제시'
    ],
    knowledgeBase: [
      '최신 분석 방법론 및 도구',
      '업계 벤치마크 데이터',
      '시장 동향 및 예측 모델'
    ],
    metaInstructions: '체계적인 분석 프레임워크를 적용하여 객관적이고 실행 가능한 인사이트를 도출하세요.',
    qualityThreshold: 85
  },

  {
    id: 'creative-innovation',
    name: '창의적 혁신 프롬프트',
    category: PromptCategory.CREATIVE,
    description: '창의적 아이디어 발굴과 혁신적 솔루션 도출을 위한 템플릿입니다.',
    template: `창의적 아이디어를 발굴해주세요:

**창작 주체**: {who}
**창작 대상**: {what}
**창작 시기**: {when}
**창작 환경**: {where}
**창작 목적**: {why}
**창작 방식**: {how}

기존 관념을 뛰어넘는 혁신적이고 실현 가능한 아이디어를 제시해주세요.`,
    techniques: [
      PromptTechnique.ANALOGICAL,
      PromptTechnique.TREE_OF_THOUGHT,
      PromptTechnique.DIRECTIONAL_STIMULUS,
      PromptTechnique.ACTIVE_PROMPT,
      PromptTechnique.GENERATED_KNOWLEDGE,
      PromptTechnique.LEAST_TO_MOST,
      PromptTechnique.MULTIMODAL_COT
    ],
    systemPrompt: '당신은 창의적 사고와 혁신적 아이디어 발굴에 특화된 크리에이티브 디렉터입니다.',
    expertRoles: ['크리에이티브 디렉터', '디자인 씽킹 전문가', '이노베이션 컨설턴트', '아트 디렉터'],
    analogies: [
      '자연계의 창의적 해결책들',
      '다른 산업의 혁신 사례들',
      '예술과 과학의 융합 사례들'
    ],
    stimulusHints: [
      '기존 패러다임 전환',
      '다학제적 접근',
      '사용자 중심 사고',
      '지속가능성 고려',
      '기술 융합 활용'
    ],
    treeOfThoughtBranches: [
      '파괴적 혁신 접근',
      '점진적 개선 접근',
      '융합적 창조 접근',
      '사용자 경험 혁신 접근'
    ],
    metaInstructions: '창의적 사고 기법을 활용하여 실현 가능하면서도 혁신적인 아이디어를 체계적으로 도출하세요.',
    qualityThreshold: 80
  },

  {
    id: 'problem-solving-systematic',
    name: '체계적 문제해결 프롬프트',
    category: PromptCategory.PROBLEM_SOLVING,
    description: '복잡한 문제를 체계적으로 분석하고 해결하기 위한 고급 템플릿입니다.',
    template: `다음 문제를 체계적으로 해결해주세요:

**문제 당사자**: {who}
**문제 상황**: {what}
**문제 발생 시점**: {when}
**문제 발생 환경**: {where}
**문제 발생 원인**: {why}
**해결 접근법**: {how}

근본 원인을 파악하고 지속가능한 해결책을 제시해주세요.`,
    techniques: [
      PromptTechnique.LEAST_TO_MOST,
      PromptTechnique.TREE_OF_THOUGHT,
      PromptTechnique.REACT,
      PromptTechnique.PROMPT_CHAINING,
      PromptTechnique.SELF_CONSISTENCY,
      PromptTechnique.REFLECTION,
      PromptTechnique.META_PROMPTING
    ],
    systemPrompt: '당신은 복잡한 문제를 체계적으로 분석하고 해결하는 전문 컨설턴트입니다.',
    expertRoles: ['문제해결 전문가', '시스템 분석가', '프로세스 개선 컨설턴트', '운영 전략가'],
    chainSteps: [
      {
        id: 'problem-definition',
        prompt: '문제를 명확히 정의하고 범위를 설정하세요.',
        dependsOn: []
      },
      {
        id: 'root-cause-analysis',
        prompt: '근본 원인을 체계적으로 분석하세요.',
        dependsOn: ['problem-definition']
      },
      {
        id: 'solution-generation',
        prompt: '다양한 해결책을 도출하고 평가하세요.',
        dependsOn: ['root-cause-analysis']
      },
      {
        id: 'implementation-plan',
        prompt: '최적 해결책의 실행 계획을 수립하세요.',
        dependsOn: ['solution-generation']
      }
    ],
    metaInstructions: '문제의 복잡성을 고려하여 단계별로 체계적인 접근을 통해 지속가능한 해결책을 도출하세요.',
    qualityThreshold: 85
  },

  {
    id: 'learning-adaptive',
    name: '적응형 학습 프롬프트',
    category: PromptCategory.LEARNING,
    description: '개인화된 학습 경험을 제공하는 적응형 교육 템플릿입니다.',
    template: `학습 지원을 제공해주세요:

**학습자**: {who}
**학습 내용**: {what}
**학습 시기**: {when}
**학습 환경**: {where}
**학습 목적**: {why}
**학습 방법**: {how}

학습자의 수준과 스타일에 맞춘 개인화된 학습 경험을 설계해주세요.`,
    techniques: [
      PromptTechnique.FEW_SHOT,
      PromptTechnique.CHAIN_OF_THOUGHT,
      PromptTechnique.GENERATED_KNOWLEDGE,
      PromptTechnique.ANALOGICAL,
      PromptTechnique.STEP_BY_STEP,
      PromptTechnique.ACTIVE_PROMPT,
      PromptTechnique.REFLECTION
    ],
    systemPrompt: '당신은 개인화된 학습 경험을 설계하는 교육 전문가입니다.',
    expertRoles: ['교육 설계자', '학습 분석가', '인지 과학자', '교육 컨설턴트'],
    analogies: [
      '스포츠 훈련의 단계적 접근',
      '언어 습득의 자연스러운 과정',
      '게임의 레벨 시스템'
    ],
    fewShotExamples: [
      {
        input: { what: [{ id: '1', value: '프로그래밍 기초' }] },
        output: '변수와 함수의 개념을 일상 생활의 비유로 설명하고, 간단한 실습을 통해 단계적으로 학습',
        reasoning: '초보자에게는 추상적 개념을 구체적 비유로 설명하는 것이 효과적'
      }
    ],
    metaInstructions: '학습자의 사전 지식, 학습 스타일, 목표를 고려하여 최적화된 학습 경로를 설계하세요.',
    qualityThreshold: 80
  },

  {
    id: 'coding-expert',
    name: '전문 코딩 프롬프트',
    category: PromptCategory.CODING,
    description: '고급 프로그래밍 문제 해결과 코드 최적화를 위한 전문 템플릿입니다.',
    template: `프로그래밍 작업을 수행해주세요:

**개발자**: {who}
**개발 내용**: {what}
**개발 일정**: {when}
**개발 환경**: {where}
**개발 목적**: {why}
**개발 방법론**: {how}

최신 베스트 프랙티스를 적용한 고품질 코드와 솔루션을 제공해주세요.`,
    techniques: [
      PromptTechnique.EXPERT_PROMPTING,
      PromptTechnique.CHAIN_OF_THOUGHT,
      PromptTechnique.TREE_OF_THOUGHT,
      PromptTechnique.REACT,
      PromptTechnique.REFLECTION,
      PromptTechnique.RAG,
      PromptTechnique.STEP_BY_STEP
    ],
    systemPrompt: '당신은 다양한 프로그래밍 언어와 최신 개발 방법론에 정통한 시니어 개발자입니다.',
    expertRoles: ['시니어 개발자', '소프트웨어 아키텍트', 'DevOps 엔지니어', '테크 리드'],
    knowledgeBase: [
      '최신 프로그래밍 언어 문법과 기능',
      '소프트웨어 설계 패턴과 아키텍처',
      '성능 최적화 기법',
      '보안 베스트 프랙티스'
    ],
    chainOfThoughtSteps: [
      '요구사항 분석 및 명세',
      '아키텍처 설계 및 기술 선택',
      '핵심 로직 구현',
      '테스트 및 최적화',
      '문서화 및 배포 준비'
    ],
    metaInstructions: '코드의 가독성, 성능, 유지보수성을 모두 고려한 전문적인 솔루션을 제공하세요.',
    qualityThreshold: 90
  },

  {
    id: 'business-strategic',
    name: '전략적 비즈니스 프롬프트',
    category: PromptCategory.BUSINESS,
    description: '비즈니스 전략 수립과 의사결정 지원을 위한 고급 템플릿입니다.',
    template: `비즈니스 전략을 수립해주세요:

**이해관계자**: {who}
**비즈니스 이슈**: {what}
**타임라인**: {when}
**시장 환경**: {where}
**전략적 목표**: {why}
**실행 방안**: {how}

데이터 기반의 전략적 인사이트와 실행 가능한 액션 플랜을 제시해주세요.`,
    techniques: [
      PromptTechnique.EXPERT_PROMPTING,
      PromptTechnique.TREE_OF_THOUGHT,
      PromptTechnique.SELF_CONSISTENCY,
      PromptTechnique.RAG,
      PromptTechnique.PROMPT_CHAINING,
      PromptTechnique.ANALOGICAL,
      PromptTechnique.META_PROMPTING
    ],
    systemPrompt: '당신은 글로벌 비즈니스 환경에 정통한 전략 컨설턴트입니다.',
    expertRoles: ['전략 컨설턴트', 'CEO', '사업개발 책임자', '투자 분석가'],
    analogies: [
      '성공한 기업들의 전략적 전환 사례',
      '다른 산업의 혁신적 비즈니스 모델',
      '경제학적 원리의 실무 적용 사례'
    ],
    treeOfThoughtBranches: [
      '시장 확장 전략',
      '운영 효율성 개선',
      '혁신 및 차별화',
      '파트너십 및 M&A'
    ],
    knowledgeBase: [
      '글로벌 시장 동향 및 예측',
      '산업별 벤치마크 데이터',
      '경영 전략 프레임워크',
      '재무 분석 모델'
    ],
    metaInstructions: '시장 상황, 경쟁 환경, 내부 역량을 종합적으로 고려한 실행 가능한 전략을 수립하세요.',
    qualityThreshold: 88
  },

  {
    id: 'research-comprehensive',
    name: '종합 연구 프롬프트',
    category: PromptCategory.RESEARCH,
    description: '학술 연구와 심층 조사를 위한 체계적 연구 템플릿입니다.',
    template: `연구 프로젝트를 수행해주세요:

**연구자**: {who}
**연구 주제**: {what}
**연구 기간**: {when}
**연구 범위**: {where}
**연구 목적**: {why}
**연구 방법론**: {how}

엄밀한 연구 방법론을 적용하여 신뢰할 수 있는 연구 결과를 도출해주세요.`,
    techniques: [
      PromptTechnique.RAG,
      PromptTechnique.GENERATED_KNOWLEDGE,
      PromptTechnique.SELF_CONSISTENCY,
      PromptTechnique.REFLECTION,
      PromptTechnique.EXPERT_PROMPTING,
      PromptTechnique.PROMPT_CHAINING,
      PromptTechnique.META_PROMPTING
    ],
    systemPrompt: '당신은 다학제적 연구 경험을 가진 연구 방법론 전문가입니다.',
    expertRoles: ['연구 방법론 전문가', '데이터 사이언티스트', '학술 연구자', '정책 분석가'],
    chainSteps: [
      {
        id: 'literature-review',
        prompt: '관련 문헌을 체계적으로 검토하고 연구 gap을 식별하세요.',
        dependsOn: []
      },
      {
        id: 'methodology-design',
        prompt: '적절한 연구 방법론을 설계하고 타당성을 검증하세요.',
        dependsOn: ['literature-review']
      },
      {
        id: 'data-analysis',
        prompt: '수집된 데이터를 체계적으로 분석하세요.',
        dependsOn: ['methodology-design']
      },
      {
        id: 'findings-interpretation',
        prompt: '분석 결과를 해석하고 함의를 도출하세요.',
        dependsOn: ['data-analysis']
      }
    ],
    knowledgeBase: [
      '최신 연구 방법론 및 도구',
      '학술 데이터베이스 및 자료',
      '통계 분석 기법',
      '연구 윤리 가이드라인'
    ],
    metaInstructions: '연구의 객관성, 신뢰성, 타당성을 확보하여 학술적 가치가 높은 연구 결과를 도출하세요.',
    qualityThreshold: 92
  }
];

export const CATEGORY_NAMES = {
  [PromptCategory.GENERAL]: '일반',
  [PromptCategory.ANALYSIS]: '분석',
  [PromptCategory.CREATIVE]: '창작',
  [PromptCategory.PROBLEM_SOLVING]: '문제해결',
  [PromptCategory.LEARNING]: '학습',
  [PromptCategory.CODING]: '코딩',
  [PromptCategory.BUSINESS]: '비즈니스',
  [PromptCategory.RESEARCH]: '연구'
};

export function getTemplateById(id: string): PromptTemplate | undefined {
  return DEFAULT_TEMPLATES.find(template => template.id === id);
}

export function getTemplatesByCategory(category: PromptCategory): PromptTemplate[] {
  return DEFAULT_TEMPLATES.filter(template => template.category === category);
} 