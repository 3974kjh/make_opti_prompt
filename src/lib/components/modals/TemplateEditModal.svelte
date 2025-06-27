<script lang="ts">
  import { createEventDispatcher, tick } from 'svelte';
  import { fade, scale } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  import type { UserTemplate, DynamicItem, PromptFormData, PromptGenerationOptions } from '$lib/types/prompt';

  // Props
  export let isOpen = false;
  export let template: UserTemplate | null = null;
  export let editingData: PromptFormData | null = null;
  export let editingOptions: PromptGenerationOptions | null = null;
  export let fields: Array<{
    key: keyof Omit<PromptFormData, 'templateId'>;
    label: string;
    placeholder: string;
  }> = [];
  export let techniqueOptions: Array<{ value: string; label: string }> = [];
  export let outputFormatOptions: Array<{ value: string; label: string }> = [];

  // Event dispatcher
  const dispatch = createEventDispatcher<{
    close: void;
    save: { template: UserTemplate; data: PromptFormData; options: PromptGenerationOptions };
    addItem: { fieldKey: keyof Omit<PromptFormData, 'templateId'> };
    removeItem: { fieldKey: keyof Omit<PromptFormData, 'templateId'>; itemId: string };
  }>();

  // 필드 아이콘 반환 함수
  function getFieldIcon(fieldKey: string): string {
    const icons = {
      what: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
      who: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/></svg>',
      when: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
      where: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>',
      why: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>',
      how: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>'
    };
    return icons[fieldKey as keyof typeof icons] || '';
  }

  // 항목 추가
  async function addItem(fieldKey: keyof Omit<PromptFormData, 'templateId'>) {
    if (!editingData) return;
    
    const newItem = { id: generateId(), value: '' };
    editingData[fieldKey] = [...editingData[fieldKey], newItem];
    
    // DOM 업데이트 후 새로 추가된 항목에 포커스 및 스크롤
    await tick();
    const modalTextarea = document.querySelector(`textarea[data-field="${fieldKey}"][data-item-id="${newItem.id}"]`) as HTMLTextAreaElement;
    if (modalTextarea) {
      modalTextarea.focus();
      
      // 모달 내에서 스크롤 이동 (부드러운 스크롤)
      modalTextarea.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest'
      });
    }
    
    dispatch('addItem', { fieldKey });
  }

  // 항목 제거
  function removeItem(fieldKey: keyof Omit<PromptFormData, 'templateId'>, itemId: string) {
    if (!editingData) return;
    
    editingData[fieldKey] = editingData[fieldKey].filter((item: DynamicItem) => item.id !== itemId);
    dispatch('removeItem', { fieldKey, itemId });
  }

  // ID 생성 함수
  function generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  // 모달 닫기
  function closeModal() {
    dispatch('close');
  }

  // 저장
  function saveTemplate() {
    if (!template || !editingData || !editingOptions) return;
    dispatch('save', { template, data: editingData, options: editingOptions });
  }

  // 모달 외부 클릭 처리
  function handleBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      closeModal();
    }
  }
</script>

{#if isOpen && template && editingData && editingOptions}
  <div 
    class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    on:click={handleBackdropClick}
    transition:fade={{ duration: 200 }}
    role="dialog"
    aria-modal="true"
    aria-labelledby="modal-title"
  >
    <div 
      class="edit-modal bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] border border-white/20 dark:border-gray-700/30 flex flex-col"
      on:click={(e) => e.stopPropagation()}
      transition:scale={{ duration: 200, easing: quintOut }}
    >
      <!-- 고정 헤더 -->
      <div class="flex items-center justify-between p-4 border-b border-gray-200/50 dark:border-gray-600/50">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
            </svg>
          </div>
          <div>
            <h3 id="modal-title" class="text-2xl font-bold text-gray-800 dark:text-white">
              템플릿 편집
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              5W1H 데이터와 설정을 수정할 수 있습니다
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
        <div class="space-y-8">
          <!-- 템플릿 이름 편집 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              템플릿 이름
            </label>
            <input
              type="text"
              bind:value={template.name}
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
                        addItem(field.key);
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
                    {#each editingData[field.key] as item, index}
                      <div class="relative group/item">
                        <textarea
                          bind:value={item.value}
                          data-field={field.key}
                          data-item-id={item.id}
                          placeholder={field.placeholder}
                          on:click={(e) => e.stopPropagation()}
                          rows="3"
                          class="w-full px-3 py-2 bg-white/70 dark:bg-gray-600/70 rounded-lg text-sm text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 resize-none overflow-y-auto max-h-24"
                        ></textarea>
                        <!-- x버튼을 textarea 상단 오른쪽에 겹쳐서 배치 -->
                        <button
                          on:click={(e) => {
                            e.stopPropagation();
                            removeItem(field.key, item.id);
                          }}
                          class="absolute -top-2 -right-2 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center opacity-0 group-hover/item:opacity-100 focus:opacity-100 hover:scale-110 active:scale-95 z-10 border border-white dark:border-gray-600"
                          aria-label="항목 삭제"
                        >
                          <svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12"/>
                          </svg>
                        </button>
                      </div>
                    {/each}
                    {#if editingData[field.key].length === 0}
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
                  bind:value={editingOptions.technique}
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
                  bind:value={editingOptions.outputFormat}
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
                  bind:value={editingOptions.expertRole}
                  placeholder="예: 마케팅 전문가, 데이터 분석가"
                  on:click={(e) => e.stopPropagation()}
                  class="w-full px-4 py-3 border-2 border-gray-200/60 dark:border-gray-600/60 rounded-xl bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                />
              </div>

              <!-- 최대 토큰 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  최대 토큰 수: {editingOptions.maxTokens}
                </label>
                <input
                  type="range"
                  bind:value={editingOptions.maxTokens}
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
                  bind:checked={editingOptions.reasoning}
                  on:click={(e) => e.stopPropagation()}
                  class="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">추론 과정 포함</span>
              </label>

              <label class="flex items-center gap-3 cursor-pointer" on:click={(e) => e.stopPropagation()}>
                <input
                  type="checkbox"
                  bind:checked={editingOptions.includeStepByStep}
                  on:click={(e) => e.stopPropagation()}
                  class="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">단계별 설명 포함</span>
              </label>

              <label class="flex items-center gap-3 cursor-pointer" on:click={(e) => e.stopPropagation()}>
                <input
                  type="checkbox"
                  bind:checked={editingOptions.diversityBoost}
                  on:click={(e) => e.stopPropagation()}
                  class="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">다양성 증대</span>
              </label>

              <label class="flex items-center gap-3 cursor-pointer" on:click={(e) => e.stopPropagation()}>
                <input
                  type="checkbox"
                  bind:checked={editingOptions.iterativeRefinement}
                  on:click={(e) => e.stopPropagation()}
                  class="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">반복 개선</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- 고정 하단 버튼 -->
      <div class="border-t border-gray-200/50 dark:border-gray-600/50 p-4">
        <div class="flex gap-3">
          <button
            on:click={closeModal}
            class="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-xl font-semibold transition-colors duration-200"
          >
            취소
          </button>
          <button
            on:click={saveTemplate}
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

<style>
  /* 스크롤바 스타일링 */
  .premium-scrollbar::-webkit-scrollbar {
    width: 8px;
  }

  .premium-scrollbar::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 4px;
  }

  .premium-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 4px;
  }

  .premium-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.5);
  }

  /* 다크 모드에서의 스크롤바 */
  :global(.dark) .premium-scrollbar::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
  }

  :global(.dark) .premium-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
  }

  :global(.dark) .premium-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.5);
  }
</style> 