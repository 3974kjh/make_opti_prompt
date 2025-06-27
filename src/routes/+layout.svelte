<script lang="ts">
  import '../app.css';
  import { onMount } from 'svelte';
  import { Toaster } from 'svelte-hot-french-toast';
  
  let isDarkMode = $state(false);
  
  onMount(() => {
    // 다크모드 초기값 설정 (시스템 설정 또는 localStorage 기반)
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    isDarkMode = stored === 'dark' || (!stored && prefersDark);
    updateTheme();
    
    // 시스템 테마 변경 감지
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        isDarkMode = e.matches;
        updateTheme();
      }
    });
  });
  
  function updateTheme() {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
  
  function toggleTheme() {
    isDarkMode = !isDarkMode;
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    updateTheme();
  }
</script>

<!-- Toaster 컴포넌트 -->
<Toaster 
  position="top-center"
  reverseOrder={false}
  gutter={8}
  toastOptions={{
    duration: 3000,
    style: 'background: #363636; color: #fff; border-radius: 12px; padding: 16px; font-weight: 600; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);'
  }}
/>
<div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
  <!-- 헤더 -->
  <header class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
    <div class="container mx-auto px-4 py-4">
      <div class="flex items-center justify-between">
        <!-- 로고 -->
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 rounded-lg flex items-center justify-center p-1 shadow-lg">
            <!-- 파비콘과 동일한 디자인 (소형 버전) -->
            <svg class="w-6 h-6" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <!-- 그라데이션 정의 -->
                <linearGradient id="layoutBrainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color:#FFFFFF;stop-opacity:0.95" />
                  <stop offset="100%" style="stop-color:#F3F4F6;stop-opacity:0.9" />
                </linearGradient>
                
                <linearGradient id="layoutLightningGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color:#FEF3C7;stop-opacity:1" />
                  <stop offset="100%" style="stop-color:#FCD34D;stop-opacity:1" />
                </linearGradient>
              </defs>
              
              <!-- 뇌/AI 심볼 (상단) -->
              <path d="M10 8 C10 6, 12 6, 14 7 C16 6, 18 6, 20 7 C22 8, 22 10, 21 11 C22 12, 21 14, 19 14 C17 15, 15 15, 13 14 C11 14, 10 12, 11 11 C10 10, 10 8, 10 8 Z" 
                    fill="url(#layoutBrainGradient)" 
                    stroke="#FFFFFF" 
                    stroke-width="0.4"/>
              
              <!-- 뇌 내부 회로 패턴 -->
              <circle cx="13" cy="10" r="0.8" fill="#3B82F6" opacity="0.8"/>
              <circle cx="17" cy="10" r="0.8" fill="#8B5CF6" opacity="0.8"/>
              <path d="M13 10 L17 10" stroke="#3B82F6" stroke-width="0.4" opacity="0.6"/>
              
              <!-- 번개/최적화 심볼 (하단) -->
              <path d="M18 16 L14 20 L16 20 L13 26 L17 22 L15 22 L18 16 Z" 
                    fill="url(#layoutLightningGradient)" 
                    stroke="#F59E0B" 
                    stroke-width="0.3"/>
              
              <!-- 5W1H 도트들 (측면) - 소형 버전용 단순화 -->
              <circle cx="6" cy="16" r="0.8" fill="#FFFFFF" opacity="0.8"/>
              <circle cx="26" cy="16" r="0.8" fill="#FFFFFF" opacity="0.8"/>
              <circle cx="16" cy="6" r="0.6" fill="#FFFFFF" opacity="0.6"/>
              <circle cx="16" cy="26" r="0.6" fill="#FFFFFF" opacity="0.6"/>
              
              <!-- 중앙 하이라이트 -->
              <circle cx="16" cy="16" r="1.5" fill="none" stroke="#FFFFFF" stroke-width="0.4" opacity="0.5"/>
            </svg>
          </div>
          <div>
            <h1 class="text-xl font-bold text-gray-900 dark:text-white">
              프롬프트 최적화
            </h1>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              LLM 프롬프트 자동 생성기
            </p>
          </div>
        </div>
        
        <!-- 다크모드 토글 -->
        <button 
          on:click={toggleTheme}
          class="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          aria-label="테마 변경"
        >
          {#if isDarkMode}
            <svg class="w-5 h-5 text-gray-700 dark:text-gray-300" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"></path>
            </svg>
          {:else}
            <svg class="w-5 h-5 text-gray-700 dark:text-gray-300" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
            </svg>
          {/if}
        </button>
      </div>
    </div>
  </header>
  
  <!-- 메인 컨텐츠 -->
  <main class="container mx-auto px-4 py-8">
    <slot />
  </main>
  
  <!-- 푸터 -->
  <footer class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
    <div class="container mx-auto px-4 py-6">
      <div class="text-center text-gray-600 dark:text-gray-400">
        <p class="text-sm">
          © 2024 프롬프트 최적화. 5W1H전략으로 더 나은 AI 대화를 만들어보세요.
        </p>
        <p class="text-xs mt-2">
          Made with Jukim using Svelte 5 & Tailwind CSS
        </p>
      </div>
    </div>
  </footer>
</div> 