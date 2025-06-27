import type { 
  PromptFormData, 
  PromptTemplate, 
  QualityMetrics,
  PromptGenerationOptions,
  FewShotExample,
  DynamicItem,
  OptimizationSuggestion,
  ToTNode,
  ReasoningPath,
  RetrievalResult,
  ReActAction,
  ChainStep
} from '$lib/types/prompt';
import { PromptTechnique, QualityLevel } from '$lib/types/prompt';

export class PromptGenerator {
  /**
   * 메인 프롬프트 생성 함수 - 최신 엔지니어링 기법 적용
   */
  static generate(
    formData: PromptFormData, 
    template: PromptTemplate, 
    options: PromptGenerationOptions = this.getDefaultOptions()
  ): string {
    // 기본 프롬프트 구성 (Role-Context-Example 패턴 적용)
    let prompt = this.buildAdvancedPrompt(formData, template, options);
    
    // 선택된 기법에 따라 프롬프트 강화
    switch (options.technique) {
      case PromptTechnique.FEW_SHOT:
        prompt = this.applyFewShotPrompting(prompt, template, formData);
        break;
      case PromptTechnique.CHAIN_OF_THOUGHT:
        prompt = this.applyChainOfThought(prompt, template);
        break;
      case PromptTechnique.TREE_OF_THOUGHT:
        prompt = this.applyTreeOfThought(prompt, template, options);
        break;
      case PromptTechnique.SELF_CONSISTENCY:
        prompt = this.applySelfConsistency(prompt, options);
        break;
      case PromptTechnique.EXPERT_PROMPTING:
        prompt = this.applyExpertPrompting(prompt, options.expertRole, template);
        break;
      case PromptTechnique.REFLECTION:
        prompt = this.applyReflection(prompt);
        break;
      case PromptTechnique.STEP_BY_STEP:
        prompt = this.applyStepByStep(prompt);
        break;
      // 새로운 고급 기법들
      case PromptTechnique.RAG:
        prompt = this.applyRAG(prompt, template, options);
        break;
      case PromptTechnique.REACT:
        prompt = this.applyReAct(prompt, template);
        break;
      case PromptTechnique.PROMPT_CHAINING:
        prompt = this.applyPromptChaining(prompt, template, formData, options);
        break;
      case PromptTechnique.GENERATED_KNOWLEDGE:
        prompt = this.applyGeneratedKnowledge(prompt, template);
        break;
      case PromptTechnique.LEAST_TO_MOST:
        prompt = this.applyLeastToMost(prompt, formData);
        break;
      case PromptTechnique.ANALOGICAL:
        prompt = this.applyAnalogical(prompt, template);
        break;
      case PromptTechnique.DIRECTIONAL_STIMULUS:
        prompt = this.applyDirectionalStimulus(prompt, template);
        break;
      case PromptTechnique.META_PROMPTING:
        prompt = this.applyMetaPrompting(prompt, template);
        break;
      case PromptTechnique.ACTIVE_PROMPT:
        prompt = this.applyActivePrompt(prompt, template);
        break;
      case PromptTechnique.ZERO_SHOT:
      default:
        // Zero-shot은 기본 프롬프트 사용
        break;
    }
    
    // 추가 옵션 적용
    if (options.includeStepByStep && options.technique !== PromptTechnique.STEP_BY_STEP) {
      prompt = this.addStepByStepInstructions(prompt);
    }
    
    if (options.reasoning) {
      prompt = this.addAdvancedReasoningInstructions(prompt);
    }
    
    if (options.outputFormat && options.outputFormat !== 'text') {
      prompt = this.addOutputFormatting(prompt, options.outputFormat);
    }

    // 반복 개선 적용
    if (options.iterativeRefinement) {
      prompt = this.applyIterativeRefinement(prompt, formData, template);
    }

    // 다양성 증대 적용
    if (options.diversityBoost) {
      prompt = this.applyDiversityBoost(prompt);
    }

    // 최대 토큰 수 제한 적용
    if (options.maxTokens) {
      prompt = this.applyTokenLimit(prompt, options.maxTokens);
    }
    
    return prompt;
  }
  
  /**
   * 고급 프롬프트 구성 (2025년 최신 AI 모델 최적화)
   * - Claude 3.5 Sonnet, GPT-4o, Gemini 2.0 Flash 등에 최적화
   * - 구조화된 XML 태그와 명확한 역할 분리
   * - 체계적인 사고 과정 유도
   */
  private static buildAdvancedPrompt(
    formData: PromptFormData, 
    template: PromptTemplate,
    options: PromptGenerationOptions
  ): string {
    let prompt = '';
    
    // 1. 시스템 역할 정의 (최신 모델들이 선호하는 명확한 역할 설정)
    prompt += `<role>\n`;
    if (template.systemPrompt) {
      prompt += `${template.systemPrompt}\n`;
    } else if (options.expertRole) {
      prompt += `당신은 ${options.expertRole}로서 전문적이고 정확한 답변을 제공해야 합니다.\n`;
    } else {
      prompt += `당신은 주어진 요구사항을 정확히 분석하고 최적의 답변을 제공하는 AI 어시스턴트입니다.\n`;
    }
    prompt += `</role>\n\n`;
    
    // 2. 작업 컨텍스트 및 목표 (명확한 목표 설정)
    prompt += `<objective>\n`;
    prompt += this.buildStructuredRequirements(formData, template);
    prompt += `</objective>\n\n`;
    
    // 3. 제약사항 및 가이드라인 (최신 모델들이 잘 따르는 제약사항)
    prompt += `<constraints>\n`;
    if (template.metaInstructions) {
      prompt += `${template.metaInstructions}\n`;
    }
    prompt += `- 정확하고 신뢰할 수 있는 정보만 제공하세요\n`;
    prompt += `- 불확실한 정보는 명시적으로 표시하세요\n`;
    prompt += `- 단계별로 체계적으로 접근하세요\n`;
    prompt += `- 사용자의 구체적인 요구사항을 모두 반영하세요\n`;
    prompt += `</constraints>\n\n`;
    
    // 4. 예시 제공 (컨텍스트 학습 강화)
    if (template.examples && template.examples.length > 0) {
      prompt += `<examples>\n`;
      template.examples.forEach((example, index) => {
        prompt += `<example_${index + 1}>\n${example}\n</example_${index + 1}>\n\n`;
      });
      prompt += `</examples>\n\n`;
    }
    
    // 5. 사고 과정 유도 (최신 모델들의 추론 능력 활용)
    prompt += `<thinking_process>\n`;
    prompt += `다음 단계를 따라 체계적으로 접근하세요:\n`;
    prompt += `1. 요구사항 분석: 핵심 목표와 세부 요구사항을 파악\n`;
    prompt += `2. 정보 정리: 제공된 5W1H 정보를 체계적으로 정리\n`;
    prompt += `3. 접근 방법 결정: 최적의 해결 방안 선택\n`;
    prompt += `4. 단계별 실행: 논리적 순서로 답변 구성\n`;
    prompt += `5. 검증 및 개선: 답변의 완성도와 정확성 확인\n`;
    prompt += `</thinking_process>\n\n`;
    
    // 6. 출력 형식 지정 (구조화된 출력)
    prompt += `<output_format>\n`;
    prompt += this.getModernOutputFormatInstructions(options.outputFormat || 'text');
    prompt += `</output_format>\n\n`;
    
    // 7. 최종 실행 지시사항
    prompt += `<execution>\n`;
    prompt += `위의 모든 지침을 따라 요구사항을 충족하는 완전하고 정확한 답변을 제공하세요.\n`;
    prompt += `답변은 명확하고 실용적이며, 사용자가 즉시 활용할 수 있어야 합니다.\n`;
    prompt += `</execution>`;
    
    return prompt;
  }

  /**
   * 구조화된 요구사항 구성
   */
  private static buildStructuredRequirements(formData: PromptFormData, template: PromptTemplate): string {
    let requirements = '';
    
    // 동적 항목들을 텍스트로 변환
    const whoText = this.dynamicItemsToText(formData.who);
    const whatText = this.dynamicItemsToText(formData.what);
    const whenText = this.dynamicItemsToText(formData.when);
    const whereText = this.dynamicItemsToText(formData.where);
    const whyText = this.dynamicItemsToText(formData.why);
    const howText = this.dynamicItemsToText(formData.how);
    
    // 템플릿 변수 치환
    let processedTemplate = template.template
      .replace(/\{who\}/g, whoText)
      .replace(/\{what\}/g, whatText)
      .replace(/\{when\}/g, whenText)
      .replace(/\{where\}/g, whereText)
      .replace(/\{why\}/g, whyText)
      .replace(/\{how\}/g, howText);
    
    requirements += processedTemplate;
    
    // 구체적인 5W1H 정보가 있으면 구조화하여 추가
    if (whoText || whatText || whenText || whereText || whyText || howText) {
      requirements += `\n\n## 상세 정보\n`;
      if (whoText) requirements += `- **누가**: ${whoText}\n`;
      if (whatText) requirements += `- **무엇을**: ${whatText}\n`;
      if (whenText) requirements += `- **언제**: ${whenText}\n`;
      if (whereText) requirements += `- **어디서**: ${whereText}\n`;
      if (whyText) requirements += `- **왜**: ${whyText}\n`;
      if (howText) requirements += `- **어떻게**: ${howText}\n`;
    }
    
    return requirements;
  }

  /**
   * RAG (Retrieval Augmented Generation) 적용
   */
  private static applyRAG(
    prompt: string, 
    template: PromptTemplate, 
    options: PromptGenerationOptions
  ): string {
    let ragPrompt = prompt;
    
    // 지식 베이스가 있으면 검색 및 증강
    if (template.knowledgeBase && template.knowledgeBase.length > 0) {
      ragPrompt = `# 검색된 관련 정보\n`;
      template.knowledgeBase.forEach((knowledge, index) => {
        ragPrompt += `## 참조 ${index + 1}\n${knowledge}\n\n`;
      });
      ragPrompt += `# 검색 기반 응답 생성\n위의 검색된 정보를 바탕으로 다음 질문에 답해주세요. 답변에는 반드시 참조한 정보의 출처를 명시해주세요.\n\n${prompt}`;
    } else {
      // 기본 RAG 패턴 적용
      ragPrompt = `먼저 이 질문과 관련된 배경 지식이나 최신 정보를 검토하겠습니다.

**1단계: 관련 지식 검색**
- 질문과 관련된 핵심 개념과 최신 동향을 파악합니다.
- 신뢰할 수 있는 정보원을 확인합니다.

**2단계: 정보 검증 및 통합**
- 검색된 정보의 신뢰성을 평가합니다.
- 관련성이 높은 정보를 선별합니다.

**3단계: 증강된 응답 생성**
- 검색된 정보를 바탕으로 정확하고 최신의 답변을 제공합니다.

${prompt}

답변 시 참조한 정보의 출처를 명시해주세요.`;
    }
    
    return ragPrompt;
  }

  /**
   * ReAct (Reasoning and Acting) 적용
   */
  private static applyReAct(prompt: string, template: PromptTemplate): string {
    return `# ReAct 패러다임 적용

다음 형식으로 단계별 사고와 행동을 수행해주세요:

**Thought 1**: [현재 상황에 대한 분석과 다음 행동 계획]
**Action 1**: [구체적인 행동이나 도구 사용]
**Observation 1**: [행동의 결과나 얻은 정보]

**Thought 2**: [이전 관찰을 바탕으로 한 추가 분석]
**Action 2**: [다음 행동]
**Observation 2**: [결과 관찰]

...이 과정을 반복하여 최종 결론에 도달...

**Final Answer**: [최종 답변]

${prompt}

위 ReAct 형식을 따라 체계적으로 사고하고 행동하며 답변해주세요.`;
  }

  /**
   * 프롬프트 체이닝 적용
   */
  private static applyPromptChaining(
    prompt: string, 
    template: PromptTemplate, 
    formData: PromptFormData,
    options: PromptGenerationOptions
  ): string {
    const chainLength = options.chainLength || 4;
    
    if (template.chainSteps && template.chainSteps.length > 0) {
      let chainPrompt = `# 프롬프트 체이닝 적용\n\n`;
      chainPrompt += `다음 단계들을 순차적으로 수행하여 최종 답변을 도출해주세요:\n\n`;
      
      template.chainSteps.forEach((step, index) => {
        chainPrompt += `## 단계 ${index + 1}: ${step.id}\n`;
        chainPrompt += `${step.prompt}\n\n`;
        if (step.dependsOn && step.dependsOn.length > 0) {
          chainPrompt += `*이 단계는 다음 단계들의 결과를 활용합니다: ${step.dependsOn.join(', ')}*\n\n`;
        }
      });
      
      chainPrompt += `## 최종 통합\n${prompt}\n\n`;
      chainPrompt += `위의 모든 단계를 거쳐 얻은 결과를 종합하여 최종 답변을 제시해주세요.`;
      
      return chainPrompt;
    }
    
    // 동적 체인 길이에 따른 기본 체이닝 패턴
    let chainPrompt = `# ${chainLength}단계 프롬프트 체이닝\n\n`;
    chainPrompt += `다음 ${chainLength}개 단계를 순차적으로 수행하여 체계적으로 문제를 해결해주세요:\n\n`;
    
    // 체인 길이에 따라 동적으로 단계 생성
    for (let i = 1; i <= chainLength; i++) {
      const stepTitle = this.getChainStepTitle(i, chainLength);
      const stepDescription = this.getChainStepDescription(i, chainLength, formData);
      
      chainPrompt += `## 단계 ${i}: ${stepTitle}\n`;
      chainPrompt += `${stepDescription}\n\n`;
      
      // 이전 단계 결과 활용 지시
      if (i > 1) {
        chainPrompt += `*이 단계에서는 이전 단계들의 결과를 반드시 활용하세요.*\n\n`;
      }
    }
    
    chainPrompt += `## 최종 단계: 통합 및 결론\n`;
    chainPrompt += `${prompt}\n\n`;
    chainPrompt += `위의 모든 ${chainLength}개 단계를 거쳐 얻은 분석과 결과를 종합하여 완전하고 실용적인 최종 답변을 제시해주세요.\n`;
    chainPrompt += `각 단계에서 얻은 핵심 인사이트를 명시하고, 이들이 어떻게 최종 결론으로 이어지는지 설명해주세요.`;
    
    return chainPrompt;
  }

  /**
   * 체인 단계별 제목 생성
   */
  private static getChainStepTitle(step: number, totalSteps: number): string {
    const titles = [
      "문제 분석 및 이해",
      "정보 수집 및 정리", 
      "접근 방법 설계",
      "핵심 요소 도출",
      "해결책 개발",
      "검증 및 평가",
      "개선 및 최적화",
      "실행 계획 수립"
    ];
    
    if (step <= titles.length) {
      return titles[step - 1];
    }
    
    // 추가 단계가 필요한 경우
    return `확장 분석 ${step - titles.length}`;
  }

  /**
   * 체인 단계별 설명 생성
   */
  private static getChainStepDescription(step: number, totalSteps: number, formData: PromptFormData): string {
    const whatText = this.dynamicItemsToText(formData.what);
    const context = whatText ? `"${whatText}"` : "주어진 문제";
    
    const descriptions = [
      `${context}에 대해 깊이 있게 분석하고 핵심 문제점과 요구사항을 명확히 파악해주세요. 문제의 본질과 복잡성을 이해하고 해결해야 할 주요 과제들을 식별하세요.`,
      
      `문제 해결에 필요한 모든 관련 정보를 체계적으로 수집하고 정리해주세요. 5W1H 정보를 활용하여 상황을 구체화하고, 필요한 배경 지식이나 데이터를 정리하세요.`,
      
      `수집된 정보를 바탕으로 문제 해결을 위한 최적의 접근 방법과 전략을 설계해주세요. 여러 가능한 방법들을 검토하고 가장 효과적인 접근법을 선택하세요.`,
      
      `문제 해결의 핵심이 되는 요소들과 중요한 고려사항들을 도출해주세요. 성공 요인과 위험 요소를 파악하고 우선순위를 설정하세요.`,
      
      `앞선 분석을 바탕으로 구체적이고 실행 가능한 해결책을 개발해주세요. 창의적이면서도 실용적인 솔루션을 제시하고 세부 방안을 구체화하세요.`,
      
      `제시된 해결책의 타당성과 효과성을 검증하고 평가해주세요. 잠재적 문제점을 점검하고 해결책의 강점과 약점을 분석하세요.`,
      
      `검증 결과를 바탕으로 해결책을 개선하고 최적화해주세요. 더 나은 결과를 위한 조정 방안과 보완책을 제시하세요.`,
      
      `최종 해결책의 구체적인 실행 계획을 수립해주세요. 단계별 실행 방법, 필요한 자원, 예상 일정 등을 포함한 실행 로드맵을 제시하세요.`
    ];
    
    if (step <= descriptions.length) {
      return descriptions[step - 1];
    }
    
    // 추가 단계가 필요한 경우
    return `이전 단계들의 결과를 바탕으로 추가적인 심화 분석을 수행해주세요. 더 세밀한 검토와 보완적인 관점에서의 접근을 시도하세요.`;
  }

  /**
   * Generated Knowledge 적용
   */
  private static applyGeneratedKnowledge(prompt: string, template: PromptTemplate): string {
    return `# 지식 생성 기반 프롬프팅

**1단계: 관련 지식 생성**
먼저 이 문제와 관련된 배경 지식, 원리, 또는 개념들을 생성해주세요:
- 핵심 개념들
- 관련 원리나 법칙들  
- 유사한 사례나 경험들
- 중요한 고려사항들

**2단계: 생성된 지식 활용**
위에서 생성한 지식을 바탕으로 다음 문제에 답해주세요:

${prompt}

**3단계: 지식 기반 추론**
생성된 지식이 어떻게 답변에 활용되었는지 설명해주세요.`;
  }

  /**
   * Least-to-Most 프롬프팅 적용
   */
  private static applyLeastToMost(prompt: string, formData: PromptFormData): string {
    return `# Least-to-Most 프롬프팅

이 문제를 가장 단순한 요소부터 시작하여 점진적으로 복잡한 부분으로 확장해가며 해결하겠습니다.

**1단계: 가장 기본적인 요소 파악**
- 문제의 핵심이 되는 가장 단순한 부분을 식별해주세요.

**2단계: 기본 요소 해결**
- 식별된 기본 요소에 대한 해결책을 제시해주세요.

**3단계: 점진적 확장**
- 기본 해결책을 바탕으로 더 복잡한 요소들을 단계적으로 추가해주세요.

**4단계: 전체 통합**
- 모든 요소들을 통합하여 완전한 해결책을 제시해주세요.

${prompt}

위 단계를 따라 간단한 것부터 복잡한 것 순으로 체계적으로 접근해주세요.`;
  }

  /**
   * Analogical 프롬프팅 적용
   */
  private static applyAnalogical(prompt: string, template: PromptTemplate): string {
    let analogicalPrompt = `# 유추 기반 프롬프팅\n\n`;
    
    if (template.analogies && template.analogies.length > 0) {
      analogicalPrompt += `다음 유사한 사례들을 참고하여 문제를 해결해주세요:\n\n`;
      template.analogies.forEach((analogy, index) => {
        analogicalPrompt += `## 유추 사례 ${index + 1}\n${analogy}\n\n`;
      });
    } else {
      analogicalPrompt += `이 문제와 유사한 상황이나 사례를 먼저 생각해보겠습니다:\n\n`;
      analogicalPrompt += `**1단계: 유사 사례 탐색**\n`;
      analogicalPrompt += `- 이 문제와 비슷한 상황이나 사례를 찾아보세요.\n`;
      analogicalPrompt += `- 다른 분야에서의 유사한 해결 방법을 생각해보세요.\n\n`;
      analogicalPrompt += `**2단계: 유추 적용**\n`;
      analogicalPrompt += `- 찾은 사례의 해결 방법을 현재 문제에 어떻게 적용할 수 있는지 분석해보세요.\n\n`;
    }
    
    analogicalPrompt += `**3단계: 유추 기반 해결**\n${prompt}\n\n`;
    analogicalPrompt += `위의 유추 사례들을 참고하여 창의적이고 효과적인 해결책을 제시해주세요.`;
    
    return analogicalPrompt;
  }

  /**
   * Directional Stimulus 적용
   */
  private static applyDirectionalStimulus(prompt: string, template: PromptTemplate): string {
    let stimulusPrompt = `# 방향성 자극 프롬프팅\n\n`;
    
    if (template.stimulusHints && template.stimulusHints.length > 0) {
      stimulusPrompt += `다음 힌트들을 참고하여 답변해주세요:\n\n`;
      stimulusPrompt += `**힌트**: ${template.stimulusHints.join(', ')}\n\n`;
    } else {
      stimulusPrompt += `**방향성 힌트**: 체계적 접근, 단계별 분석, 다각도 검토, 실용적 해결책\n\n`;
    }
    
    stimulusPrompt += `${prompt}\n\n`;
    stimulusPrompt += `위의 힌트들을 방향성 지침으로 활용하여 답변을 구성해주세요.`;
    
    return stimulusPrompt;
  }

  /**
   * Meta-Prompting 적용
   */
  private static applyMetaPrompting(prompt: string, template: PromptTemplate): string {
    return `# 메타 프롬프팅 적용

먼저 이 문제를 해결하기 위한 최적의 접근 방법을 설계하겠습니다.

**메타 분석 1: 문제 유형 분류**
- 이 문제는 어떤 유형의 문제인가요? (분석적, 창의적, 실무적 등)
- 어떤 접근 방법이 가장 적합할까요?

**메타 분석 2: 필요한 사고 과정**
- 이 문제를 해결하기 위해 어떤 단계들이 필요한가요?
- 각 단계에서 어떤 종류의 사고가 요구되나요?

**메타 분석 3: 최적 전략 수립**
- 위 분석을 바탕으로 가장 효과적인 해결 전략을 수립해주세요.

**실제 문제 해결**
${prompt}

위에서 수립한 메타 전략을 적용하여 체계적으로 문제를 해결해주세요.`;
  }

  /**
   * Active Prompt 적용
   */
  private static applyActivePrompt(prompt: string, template: PromptTemplate): string {
    return `# 액티브 프롬프팅 적용

이 문제에 대해 여러 관점에서 접근하여 가장 적합한 해결책을 찾아보겠습니다.

**관점 1: 보수적 접근**
- 안전하고 검증된 방법을 우선시하는 관점에서 해결책을 제시해주세요.

**관점 2: 혁신적 접근**  
- 창의적이고 새로운 방법을 시도하는 관점에서 해결책을 제시해주세요.

**관점 3: 실용적 접근**
- 현실적 제약과 효율성을 고려한 관점에서 해결책을 제시해주세요.

**불확실성 평가**
각 관점별 해결책의 신뢰도와 불확실성을 평가해주세요.

**최종 선택**
가장 적합한 접근법을 선택하고 그 이유를 설명해주세요.

${prompt}`;
  }

  /**
   * 개선된 Self-Consistency 적용
   */
  private static applySelfConsistency(prompt: string, options: PromptGenerationOptions): string {
    const paths = options.consistencyPaths || 3;
    
    let consistencyPrompt = `# Self-Consistency 다중 추론 경로\n\n`;
    consistencyPrompt += `이 문제에 대해 ${paths}가지 다른 추론 경로로 접근하여 일관된 답을 찾아보겠습니다.\n\n`;
    
    for (let i = 1; i <= paths; i++) {
      consistencyPrompt += `## 추론 경로 ${i}\n`;
      consistencyPrompt += `${prompt}\n\n`;
      consistencyPrompt += `**추론 과정 ${i}**: [단계별 사고 과정을 상세히 기술]\n`;
      consistencyPrompt += `**결론 ${i}**: [이 경로에서 도출한 결론]\n\n`;
    }
    
    consistencyPrompt += `## 일관성 검증 및 최종 답변\n`;
    consistencyPrompt += `위 ${paths}가지 추론 경로의 결과를 비교하고, 가장 일관되고 신뢰할 수 있는 답변을 선택하여 제시해주세요.\n`;
    consistencyPrompt += `만약 경로들 간에 차이가 있다면, 그 이유를 분석하고 가장 합리적인 답변을 도출해주세요.`;
    
    return consistencyPrompt;
  }

  /**
   * 개선된 Tree of Thoughts 적용
   */
  private static applyTreeOfThought(
    prompt: string, 
    template: PromptTemplate, 
    options: PromptGenerationOptions
  ): string {
    const depth = options.treeDepth || 3;
    
    let totPrompt = `# Tree of Thoughts 체계적 탐색\n\n`;
    totPrompt += `이 문제를 트리 구조로 탐색하여 최적의 해결책을 찾아보겠습니다.\n\n`;
    
    if (template.treeOfThoughtBranches && template.treeOfThoughtBranches.length > 0) {
      totPrompt += `## 탐색 분기들\n`;
      template.treeOfThoughtBranches.forEach((branch, index) => {
        totPrompt += `- 분기 ${index + 1}: ${branch}\n`;
      });
      totPrompt += `\n`;
    }
    
    totPrompt += `## 단계별 탐색 (깊이 ${depth})\n\n`;
    
    for (let level = 1; level <= depth; level++) {
      totPrompt += `### 레벨 ${level} 탐색\n`;
      totPrompt += `**탐색 노드들**: 이 레벨에서 고려할 수 있는 접근 방법들을 나열해주세요.\n`;
      totPrompt += `**평가**: 각 노드의 유망성을 평가해주세요 (1-10점).\n`;
      totPrompt += `**선택**: 가장 유망한 노드를 선택하고 이유를 설명해주세요.\n\n`;
    }
    
    totPrompt += `## 백트래킹 및 최적화\n`;
    totPrompt += `필요한 경우 이전 레벨로 돌아가서 다른 경로를 탐색해주세요.\n\n`;
    
    totPrompt += `## 최종 문제 해결\n`;
    totPrompt += `${prompt}\n\n`;
    totPrompt += `위의 체계적 탐색 과정을 통해 발견한 최적의 경로로 문제를 해결해주세요.`;
    
    return totPrompt;
  }

  /**
   * 반복 개선 적용
   */
  private static applyIterativeRefinement(
    prompt: string, 
    formData: PromptFormData, 
    template: PromptTemplate
  ): string {
    return `# 반복적 개선 프로세스

**1차 답변 생성**
${prompt}

**1차 검토 및 개선점 도출**
위 답변을 다음 관점에서 검토해주세요:
- 완성도: 모든 요구사항이 충족되었는가?
- 정확성: 정보가 정확하고 신뢰할 수 있는가?
- 명확성: 이해하기 쉽고 명확한가?
- 실용성: 실제로 적용 가능한가?

**개선된 최종 답변**
위 검토 결과를 바탕으로 개선된 최종 답변을 제시해주세요.`;
  }

  /**
   * 고급 추론 지침 추가 (2025년 최신 AI 모델 최적화)
   */
  private static addAdvancedReasoningInstructions(prompt: string): string {
    return prompt + `

<advanced_reasoning>
다음과 같은 고급 추론 기법을 적용하여 답변하세요:

**1. 다층적 분석**
• 표면적 정보뿐만 아니라 숨겨진 패턴과 관계성 파악
• 직접적 요인과 간접적 요인을 모두 고려
• 단기적 영향과 장기적 영향을 구분하여 분석

**2. 가설 검증**
• 가능한 여러 가설을 설정하고 각각의 타당성 검토
• 반증 가능한 논리로 가설의 강약점 평가
• 증거 기반의 결론 도출

**3. 시스템적 사고**
• 개별 요소가 아닌 전체 시스템의 관점에서 접근
• 상호작용과 피드백 루프 고려
• 예상치 못한 부작용이나 연쇄 반응 예측

**4. 메타인지적 접근**
• 자신의 추론 과정을 객관적으로 평가
• 편향이나 가정을 명시적으로 식별
• 대안적 해석 가능성 탐색

**5. 확률적 판단**
• 불확실성을 인정하고 확률적으로 접근
• 여러 시나리오의 가능성과 영향도 평가
• 위험도와 기회 요소를 균형 있게 고려
</advanced_reasoning>

<reasoning_output>
위의 추론 과정을 통해 얻은 핵심 인사이트와 논리적 근거를 명확히 제시하세요.
</reasoning_output>`;
  }

  /**
   * 2025년 최신 AI 모델을 위한 출력 형식 지침
   */
  private static getModernOutputFormatInstructions(format: string): string {
    switch (format) {
      case 'json':
        return `답변을 다음과 같은 JSON 구조로 제공하세요:
{
  "summary": "핵심 요약",
  "detailed_response": "상세한 답변 내용",
  "key_points": ["주요 포인트 1", "주요 포인트 2"],
  "recommendations": ["권장사항 1", "권장사항 2"],
  "confidence_level": "높음/보통/낮음"
}`;
      
      case 'markdown':
        return `답변을 마크다운 형식으로 구조화하여 제공하세요:
- 명확한 제목과 부제목 사용
- 중요한 내용은 **굵은 글씨**로 강조
- 목록이나 표를 활용하여 정보 정리
- 코드나 예시가 있다면 \`\`\` 코드 블록 사용`;
      
      case 'structured':
        return `다음과 같은 구조화된 형식으로 답변하세요:

**📋 요약**
핵심 내용을 2-3문장으로 요약

**🔍 상세 분석**
단계별로 자세한 설명

**💡 핵심 포인트**
• 주요 포인트 1
• 주요 포인트 2
• 주요 포인트 3

**🎯 실행 방안**
구체적인 실행 단계나 권장사항

**⚠️ 주의사항**
고려해야 할 제약사항이나 위험요소 (해당되는 경우)`;
      
      default: // 'text'
        return `답변을 명확하고 체계적인 텍스트 형식으로 제공하세요:
- 논리적인 순서로 정보를 배열
- 각 단락은 하나의 주요 아이디어를 다룸
- 구체적이고 실용적인 내용 포함
- 필요시 번호나 불릿 포인트로 구조화`;
    }
  }

  /**
   * 기존 호환성을 위한 출력 형식 지침 (레거시)
   */
  private static getOutputFormatInstructions(format: string): string {
    return this.getModernOutputFormatInstructions(format);
  }

  /**
   * 동적 항목들을 텍스트로 변환
   */
  private static dynamicItemsToText(items: DynamicItem[]): string {
    if (!items || items.length === 0) return '';
    
    if (items.length === 1) {
      return items[0].value;
    }
    
    return items.map(item => item.value).join(', ');
  }
  
  /**
   * 예시 입력 포맷팅
   */
  private static formatExampleInput(input: Partial<PromptFormData>): string {
    const parts: string[] = [];
    
    if (input.who && input.who.length > 0) {
      parts.push(`누가: ${this.dynamicItemsToText(input.who)}`);
    }
    if (input.what && input.what.length > 0) {
      parts.push(`무엇을: ${this.dynamicItemsToText(input.what)}`);
    }
    if (input.when && input.when.length > 0) {
      parts.push(`언제: ${this.dynamicItemsToText(input.when)}`);
    }
    if (input.where && input.where.length > 0) {
      parts.push(`어디서: ${this.dynamicItemsToText(input.where)}`);
    }
    if (input.why && input.why.length > 0) {
      parts.push(`왜: ${this.dynamicItemsToText(input.why)}`);
    }
    if (input.how && input.how.length > 0) {
      parts.push(`어떻게: ${this.dynamicItemsToText(input.how)}`);
    }
    
    return parts.join(', ');
  }
  
  /**
   * 기본 옵션 반환
   */
  private static getDefaultOptions(): PromptGenerationOptions {
    return {
      technique: PromptTechnique.ZERO_SHOT,
      includeExamples: false,
      includeStepByStep: false,
      outputFormat: 'text',
      reasoning: false,
      selfConsistency: false
    };
  }
  
  /**
   * 품질 평가 (강화된 메트릭 시스템)
   */
  static evaluateQuality(
    formData: PromptFormData, 
    template: PromptTemplate,
    options: PromptGenerationOptions = this.getDefaultOptions()
  ): QualityMetrics {
    let total = 0;
    let completeness = 0;
    let clarity = 0;
    let specificity = 0;
    let structure = 0;
    
    // 새로운 메트릭들
    let reasoning = 0;
    let creativity = 0;
    let coherence = 0;
    let adaptability = 0;
    let tokenEfficiency = 0;
    
    const suggestions: string[] = [];
    const appliedTechniques: PromptTechnique[] = [options.technique];
    
    // 기본 완성도 평가 (0-25)
    const filledFields = [
      formData.who, formData.what, formData.when, 
      formData.where, formData.why, formData.how
    ].filter(field => field && field.length > 0 && field[0].value.trim() !== '');
    
    completeness = Math.min(25, (filledFields.length / 6) * 25);
    if (completeness < 15) {
      suggestions.push("더 많은 5W1H 정보를 입력하여 프롬프트를 완성도를 높이세요.");
    }
    
    // 명확성 평가 (0-25)
    const whatContent = this.dynamicItemsToText(formData.what);
    if (whatContent.length > 10) {
      clarity = Math.min(25, (whatContent.length / 50) * 25);
    } else {
      clarity = 5;
      suggestions.push("'무엇을' 필드에 더 구체적인 설명을 추가하세요.");
    }
    
    // 구체성 평가 (0-25)
    const totalContent = [
      this.dynamicItemsToText(formData.who),
      whatContent,
      this.dynamicItemsToText(formData.when),
      this.dynamicItemsToText(formData.where),
      this.dynamicItemsToText(formData.why),
      this.dynamicItemsToText(formData.how)
    ].join(' ');
    
    specificity = Math.min(25, (totalContent.length / 200) * 25);
    if (specificity < 15) {
      suggestions.push("각 필드에 더 구체적이고 상세한 정보를 추가하세요.");
    }
    
    // 구조화 평가 (0-25)
    structure = template.techniques.includes(options.technique) ? 25 : 15;
    if (template.systemPrompt) structure += 5;
    structure = Math.min(25, structure);
    
    // 추론 품질 평가 (0-20)
    const advancedTechniques = [
      PromptTechnique.CHAIN_OF_THOUGHT,
      PromptTechnique.TREE_OF_THOUGHT,
      PromptTechnique.SELF_CONSISTENCY,
      PromptTechnique.REFLECTION,
      PromptTechnique.REACT,
      PromptTechnique.META_PROMPTING
    ];
    
    if (advancedTechniques.includes(options.technique)) {
      reasoning = 18;
    } else if (options.reasoning) {
      reasoning = 12;
    } else {
      reasoning = 6;
      suggestions.push("Chain of Thought나 Self-Consistency 같은 추론 기법을 적용해보세요.");
    }
    
    // 창의성 평가 (0-20) - 다양성 증대 옵션 반영
    const creativeTechniques = [
      PromptTechnique.ANALOGICAL,
      PromptTechnique.TREE_OF_THOUGHT,
      PromptTechnique.ACTIVE_PROMPT,
      PromptTechnique.DIRECTIONAL_STIMULUS
    ];
    
    if (creativeTechniques.includes(options.technique)) {
      creativity = 16;
    } else if (template.category === 'creative') {
      creativity = 12;
    } else {
      creativity = 8;
    }

    // 다양성 증대 옵션이 활성화된 경우 창의성 점수 증가
    if (options.diversityBoost) {
      creativity = Math.min(20, creativity + 4);
      appliedTechniques.push('diversity_boost' as PromptTechnique);
    }
    
    // 일관성 평가 (0-20)
    if (options.technique === PromptTechnique.SELF_CONSISTENCY) {
      coherence = 18;
    } else if (options.selfConsistency) {
      coherence = 14;
    } else {
      coherence = 10;
    }
    
    // 적응성 평가 (0-20)
    if (options.iterativeRefinement) {
      adaptability = 18;
    } else if (template.expertRoles && template.expertRoles.length > 0) {
      adaptability = 14;
    } else {
      adaptability = 10;
    }
    
    // 토큰 효율성 평가 (0-20) - maxTokens 옵션 반영
    const estimatedTokens = this.estimateTokens(totalContent);
    const maxTokens = options.maxTokens || 1000;
    
    if (estimatedTokens < 100) {
      tokenEfficiency = 8;
      suggestions.push("프롬프트가 너무 간단합니다. 더 상세한 정보를 추가하세요.");
    } else if (estimatedTokens <= maxTokens * 0.5) {
      tokenEfficiency = 18;
    } else if (estimatedTokens <= maxTokens * 0.8) {
      tokenEfficiency = 15;
    } else if (estimatedTokens <= maxTokens) {
      tokenEfficiency = 12;
    } else {
      tokenEfficiency = 8;
      suggestions.push(`프롬프트가 설정된 토큰 제한(${maxTokens})을 초과할 수 있습니다. 핵심 내용으로 압축해보세요.`);
    }
    
    // 전체 점수 계산 (기존 100점 + 새로운 100점 = 200점 만점을 100점으로 정규화)
    const basicScore = completeness + clarity + specificity + structure;
    const advancedScore = reasoning + creativity + coherence + adaptability + tokenEfficiency;
    total = Math.round((basicScore + advancedScore) / 2);
    
    // 품질 게이트 적용
    const qualityGate = options.qualityGate || 70;
    if (total < qualityGate) {
      suggestions.unshift(`현재 품질 점수(${total})가 설정된 품질 게이트(${qualityGate}) 미만입니다. 추가 개선이 필요합니다.`);
    }
    
    // 레벨 결정
    let level: 'excellent' | 'high' | 'medium' | 'low';
    if (total >= 86) level = 'excellent';
    else if (total >= 61) level = 'high';
    else if (total >= 31) level = 'medium';
    else level = 'low';
    
    // 전문성 수준 평가
    let expertiseLevel: 'beginner' | 'intermediate' | 'advanced';
    if (advancedTechniques.includes(options.technique) && options.reasoning) {
      expertiseLevel = 'advanced';
    } else if (template.techniques.length > 3 || options.includeStepByStep) {
      expertiseLevel = 'intermediate';
    } else {
      expertiseLevel = 'beginner';
    }
    
    // 기법별 제안 추가
    if (level === 'medium' || level === 'low') {
      suggestions.push("Tree of Thoughts나 Self-Consistency 기법을 시도해보세요.");
      suggestions.push("전문가 역할을 설정하여 더 전문적인 답변을 얻어보세요.");
      
      if (!options.diversityBoost) {
        suggestions.push("다양성 증대 옵션을 활성화하여 더 창의적인 답변을 얻어보세요.");
      }
    }
    
    return {
      total,
      completeness,
      clarity,
      specificity,
      structure,
      reasoning,
      creativity,
      coherence,
      adaptability,
      tokenEfficiency,
      level,
      suggestions,
      appliedTechniques,
      expertiseLevel
    };
  }
  
  /**
   * 최적화 제안 생성
   */
  static generateOptimizationSuggestions(
    formData: PromptFormData,
    currentOptions: PromptGenerationOptions
  ): OptimizationSuggestion[] {
    const suggestions: OptimizationSuggestion[] = [];
    
    // 기법 개선 제안
    if (currentOptions.technique === PromptTechnique.ZERO_SHOT) {
      suggestions.push({
        type: 'technique',
        title: 'Few-shot 프롬프팅 시도',
        description: '예시를 포함하여 더 정확한 결과를 얻어보세요.',
        impact: 'high',
        difficulty: 'easy'
      });
    }
    
    if (!currentOptions.reasoning) {
      suggestions.push({
        type: 'technique',
        title: '추론 과정 포함',
        description: '단계별 추론 과정을 포함하여 더 신뢰할 수 있는 답변을 얻어보세요.',
        impact: 'medium',
        difficulty: 'easy'
      });
    }
    
    // 구조 개선 제안
    const emptyFields = [
      formData.who.length === 0,
      formData.when.length === 0,
      formData.where.length === 0,
      formData.why.length === 0,
      formData.how.length === 0
    ].filter(Boolean).length;
    
    if (emptyFields > 2) {
      suggestions.push({
        type: 'structure',
        title: '육하원칙 완성도 향상',
        description: '더 많은 육하원칙 항목을 채워 완성도를 높여보세요.',
        impact: 'high',
        difficulty: 'easy'
      });
    }
    
    return suggestions;
  }
  
  /**
   * 토큰 수 추정 (대략적)
   */
  static estimateTokens(text: string): number {
    // 한국어: 평균 2자당 1토큰, 영어: 평균 4자당 1토큰
    const koreanChars = (text.match(/[가-힣]/g) || []).length;
    const englishChars = (text.match(/[a-zA-Z]/g) || []).length;
    const otherChars = text.length - koreanChars - englishChars;
    
    return Math.ceil(koreanChars / 2 + englishChars / 4 + otherChars / 3);
  }

  /**
   * Few-shot 프롬프팅 적용
   */
  private static applyFewShotPrompting(
    prompt: string, 
    template: PromptTemplate, 
    formData: PromptFormData
  ): string {
    if (!template.fewShotExamples || template.fewShotExamples.length === 0) {
      return prompt;
    }
    
    let fewShotPrompt = "다음은 몇 가지 예시입니다:\n\n";
    
    template.fewShotExamples.forEach((example, index) => {
      fewShotPrompt += `예시 ${index + 1}:\n`;
      fewShotPrompt += `입력: ${this.formatExampleInput(example.input)}\n`;
      fewShotPrompt += `출력: ${example.output}\n`;
      if (example.reasoning) {
        fewShotPrompt += `추론: ${example.reasoning}\n`;
      }
      fewShotPrompt += "\n";
    });
    
    fewShotPrompt += `위 예시를 참고하여 다음 질문에 답해주세요:\n\n${prompt}`;
    
    return fewShotPrompt;
  }

  /**
   * Chain of Thought 적용
   */
  private static applyChainOfThought(prompt: string, template: PromptTemplate): string {
    return prompt + `

<chain_of_thought>
문제를 해결하기 위해 다음과 같이 단계별로 사고하세요:

1. **문제 이해**: 요구사항과 목표를 명확히 파악
2. **정보 분석**: 제공된 정보를 체계적으로 분석
3. **접근 방법**: 최적의 해결 방법을 논리적으로 선택
4. **단계별 실행**: 각 단계의 근거와 함께 순차적으로 진행
5. **결과 검증**: 답변이 요구사항을 충족하는지 확인

각 단계에서의 사고 과정을 명시적으로 보여주세요.
</chain_of_thought>

<reasoning>
위의 사고 과정을 따라 단계별로 추론하여 답변하세요.
</reasoning>`;
  }

  /**
   * Expert Prompting 적용 (2025년 최신 AI 모델 최적화)
   */
  private static applyExpertPrompting(
    prompt: string, 
    expertRole: string | undefined, 
    template: PromptTemplate
  ): string {
    let role = expertRole;
    
    // 전문가 역할이 지정되지 않은 경우 템플릿에서 추천 역할 선택
    if (!role && template.expertRoles && template.expertRoles.length > 0) {
      role = template.expertRoles[0];
    }
    
    if (!role) {
      role = "해당 분야의 전문가";
    }
    
    return prompt + `

<expert_persona>
당신은 ${role}로서 다음과 같은 전문성을 발휘해야 합니다:

• **전문 지식**: 해당 분야의 깊이 있는 이론적 지식과 실무 경험
• **분석적 사고**: 복잡한 문제를 체계적으로 분석하고 해결하는 능력
• **실용적 접근**: 이론과 실무를 연결하여 실행 가능한 솔루션 제시
• **최신 동향**: 업계의 최신 트렌드와 모범 사례에 대한 이해
• **위험 인식**: 잠재적 문제점과 제약사항을 사전에 식별하고 대응
</expert_persona>

<expert_approach>
전문가로서 다음과 같이 접근하세요:

1. **전문적 관점**: 일반적인 답변이 아닌 전문가 수준의 깊이 있는 분석
2. **실무 경험**: 실제 경험을 바탕으로 한 구체적이고 실용적인 조언
3. **다각적 검토**: 여러 관점에서 문제를 검토하여 균형 잡힌 해결책 제시
4. **품질 보증**: 전문가로서의 책임감을 가지고 정확하고 신뢰할 수 있는 정보 제공
</expert_approach>

<expert_deliverables>
답변에 다음 요소들을 포함하세요:
• **전문적 분석**: 해당 분야의 전문적 관점에서의 심층 분석
• **실무 적용**: 실제 현장에서 적용 가능한 구체적인 방법론
• **위험 요소**: 고려해야 할 잠재적 문제점과 대응 방안
• **모범 사례**: 업계의 성공 사례나 검증된 방법론
• **향후 전망**: 관련 분야의 발전 방향과 트렌드
</expert_deliverables>`;
  }

  /**
   * Reflection 적용
   */
  private static applyReflection(prompt: string): string {
    return `${prompt}

답변을 생성한 후 다음 과정을 거쳐주세요:

**1단계: 초기 답변 생성**
[먼저 답변을 작성해주세요]

**2단계: 자기 검토**
위 답변을 다음 기준으로 검토해주세요:
- 정확성: 제공된 정보가 정확한가?
- 완성도: 질문에 충분히 답했는가?
- 명확성: 이해하기 쉽게 설명했는가?
- 실용성: 실제로 도움이 되는 내용인가?

**3단계: 개선된 최종 답변**
검토 결과를 바탕으로 개선된 최종 답변을 제시해주세요.`;
  }

  /**
   * Step-by-Step 적용
   */
  private static applyStepByStep(prompt: string): string {
    return `${prompt}

다음과 같이 단계별로 접근해주세요:

**STEP 1: 문제 이해**
- 핵심 요구사항 파악
- 주요 제약사항 확인

**STEP 2: 정보 수집 및 분석**
- 필요한 정보 정리
- 관련 요소들 분석

**STEP 3: 해결책 도출**
- 가능한 옵션들 검토
- 최적 방안 선택

**STEP 4: 실행 계획**
- 구체적인 실행 단계
- 예상 결과 및 효과

**STEP 5: 검증 및 보완**
- 결과 검증 방법
- 개선 방안

각 단계별로 명확하게 구분하여 답변해주세요.`;
  }

  /**
   * 단계별 지시사항 추가
   */
  private static addStepByStepInstructions(prompt: string): string {
    return `${prompt}\n\n단계별로 차근차근 설명해주세요.`;
  }

  /**
   * 출력 형식 지정
   */
  private static addOutputFormatting(prompt: string, format: string): string {
    const formatInstructions = {
      json: "답변을 JSON 형식으로 구조화해주세요.",
      markdown: "답변을 마크다운 형식으로 작성해주세요.",
      structured: "답변을 구조화된 형태로 정리해주세요."
    };
    
    const instruction = formatInstructions[format as keyof typeof formatInstructions] || "";
    return `${prompt}\n\n${instruction}`;
  }

  /**
   * 다양성 증대 적용
   */
  private static applyDiversityBoost(prompt: string): string {
    return `${prompt}

## 다양성 증대 지침
답변 시 다음 사항을 고려하여 다양하고 창의적인 관점을 제시해주세요:

**1. 다각도 접근**: 문제를 여러 관점에서 바라보고 다양한 해결책을 제시
**2. 창의적 사고**: 기존 틀을 벗어난 혁신적인 아이디어 포함
**3. 대안 제시**: 주요 답변과 함께 2-3가지 대안적 접근법 제안
**4. 분야 융합**: 다른 분야의 사례나 방법론을 응용한 해결책 고려
**5. 시나리오 다양화**: 다양한 상황과 조건에서의 적용 방안 제시

위 지침을 바탕으로 풍부하고 다양한 답변을 제공해주세요.`;
  }

  /**
   * 토큰 제한 적용
   */
  private static applyTokenLimit(prompt: string, maxTokens: number): string {
    const estimatedTokens = this.estimateTokens(prompt);
    
    if (estimatedTokens <= maxTokens) {
      return prompt;
    }

    // 토큰 수가 초과된 경우 압축 지침 추가
    const compressionRatio = maxTokens / estimatedTokens;
    const targetLength = Math.floor(prompt.length * compressionRatio * 0.8); // 여유분 20%
    
    return `${prompt}

## 응답 길이 제한
**중요**: 답변은 최대 ${maxTokens} 토큰 이내로 제한해주세요.
- 핵심 내용에 집중하여 간결하게 작성
- 불필요한 부연설명 최소화
- 요점을 명확하게 정리하여 제시
- 예상 길이: 약 ${Math.floor(targetLength / 4)} 단어 이내

효율적이고 압축적인 답변을 제공해주세요.`;
  }
} 