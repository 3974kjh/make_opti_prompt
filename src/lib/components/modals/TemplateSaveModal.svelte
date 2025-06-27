<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { fade, scale } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';

  // Props
  export let isOpen: boolean = false;
  export let templateName: string = '';

  // Event dispatcher
  const dispatch = createEventDispatcher<{
    close: void;
    save: { name: string };
  }>();

  // 모달 닫기
  function closeModal() {
    dispatch('close');
  }

  // 템플릿 저장
  function saveTemplate() {
    if (!templateName.trim()) return;
    
    dispatch('save', { name: templateName.trim() });
  }

  // 키보드 이벤트 처리
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      closeModal();
    } else if (event.key === 'Enter' && templateName.trim()) {
      saveTemplate();
    }
  }
</script>

{#if isOpen}
  <div 
    class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    transition:fade={{ duration: 200 }}
    on:click={closeModal}
    on:keydown={handleKeydown}
    role="dialog"
    aria-modal="true"
    aria-labelledby="save-modal-title"
  >
    <div 
      class="save-modal bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full border border-white/20 dark:border-gray-700/30 premium-scrollbar"
      transition:scale={{ duration: 200, easing: quintOut }}
      on:click={(e) => e.stopPropagation()}
    >
      <div class="rounded-scroll-content space-y-6">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12"/>
              </svg>
            </div>
            <div>
              <h3 id="save-modal-title" class="text-xl font-bold text-gray-800 dark:text-white">
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
            bind:value={templateName}
            placeholder="템플릿 이름을 입력하세요"
            class="w-full px-4 py-3 border-2 border-gray-200/60 dark:border-gray-600/60 rounded-xl bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
            on:keydown={handleKeydown}
            autofocus
          />
        </div>

        <div class="flex gap-3">
          <button
            on:click={closeModal}
            class="flex-1 px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-xl font-semibold transition-colors duration-200"
          >
            취소
          </button>
          <button
            on:click={saveTemplate}
            disabled={!templateName.trim()}
            class="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-colors duration-200"
          >
            저장
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