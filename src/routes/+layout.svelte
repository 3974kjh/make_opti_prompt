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

    // iOS Safari viewport 높이 동적 조정
    function setViewportHeight() {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    }

    // 초기 설정
    setViewportHeight();

    // 리사이즈 및 오리엔테이션 변경 시 재계산
    window.addEventListener('resize', setViewportHeight);
    window.addEventListener('orientationchange', () => {
      // 오리엔테이션 변경 후 약간의 지연을 두고 재계산
      setTimeout(setViewportHeight, 100);
    });

    // iOS에서 주소창 숨김/표시 감지
    let lastHeight = window.innerHeight;
    window.addEventListener('resize', () => {
      const currentHeight = window.innerHeight;
      if (Math.abs(currentHeight - lastHeight) > 100) {
        // 높이 변화가 100px 이상이면 주소창 변화로 간주
        setTimeout(setViewportHeight, 300);
      }
      lastHeight = currentHeight;
    });

    // 정리 함수
    return () => {
      window.removeEventListener('resize', setViewportHeight);
    };
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

<style>
  /* iOS Safari viewport height 이슈 해결 */
  .ios-viewport-fix {
    min-height: 100vh;
    min-height: calc(var(--vh, 1vh) * 100);
    min-height: -webkit-fill-available;
    /* iOS에서 푸터가 항상 표시되도록 강제 */
    display: flex;
    flex-direction: column;
  }
  
  /* 메인 콘텐츠 영역 안전 영역 확보 */
  .main-content-safe {
    flex: 1 1 auto; /* flex-grow, flex-shrink, flex-basis 명시적 설정 */
    min-height: 0; /* flex-1이 제대로 작동하도록 */
    overflow-y: auto;
    width: 100%;
    /* iOS에서 콘텐츠가 부족해도 푸터가 하단에 고정되도록 */
    display: flex;
    flex-direction: column;
  }
  
  /* 실제 콘텐츠 래퍼 */
  .content-wrapper {
    flex: 1 1 auto;
    min-height: 0;
  }
  
  /* iOS Safari 추가 최적화 */
  @supports (-webkit-touch-callout: none) {
    .ios-viewport-fix {
      min-height: calc(var(--vh, 1vh) * 100);
      min-height: -webkit-fill-available;
      /* iOS에서 더 안정적인 레이아웃 */
      height: 100vh;
      height: calc(var(--vh, 1vh) * 100);
      height: -webkit-fill-available;
    }
    
    /* iOS에서 주소창이 숨겨질 때 레이아웃 안정성 확보 */
    .main-content-safe {
      padding-bottom: env(safe-area-inset-bottom, 0);
    }
    
    /* iOS에서 푸터 고정 */
    .footer-fixed {
      position: relative;
      margin-top: auto;
    }
  }
  
  /* 모바일 환경에서 추가 안전 마진 */
  @media (max-width: 768px) {
    .ios-viewport-fix {
      /* 모바일에서 더 안정적인 높이 계산 */
      min-height: calc(var(--vh, 1vh) * 100);
      /* iOS에서 푸터가 항상 보이도록 강제 높이 설정 */
      height: 100vh;
      height: calc(var(--vh, 1vh) * 100);
    }
    
    .main-content-safe {
      padding-bottom: max(env(safe-area-inset-bottom, 0), 1rem);
      /* 모바일에서 가로 스크롤 방지 */
      overflow-x: hidden;
    }
    
    /* 모바일에서 푸터가 항상 표시되도록 */
    .footer-fixed {
      flex-shrink: 0;
      margin-top: auto;
    }
  }
  
  /* 키보드가 올라올 때 레이아웃 조정 */
  @media (max-height: 500px) {
    .main-content-safe {
      padding-top: 0.5rem;
      padding-bottom: 0.5rem;
    }
    
    /* 키보드가 올라와도 푸터 유지 */
    .footer-fixed {
      position: relative;
      margin-top: auto;
    }
  }
  
  /* 매우 작은 화면에서 추가 최적화 */
  @media (max-height: 400px) {
    .main-content-safe {
      padding-top: 0.25rem;
      padding-bottom: 0.25rem;
    }
  }
  
  /* iOS에서 콘텐츠가 적을 때도 푸터 하단 고정 */
  @media (max-width: 768px) and (-webkit-min-device-pixel-ratio: 2) {
    .ios-viewport-fix {
      min-height: 100vh !important;
      min-height: calc(var(--vh, 1vh) * 100) !important;
      display: flex !important;
      flex-direction: column !important;
    }
    
    .footer-fixed {
      margin-top: auto !important;
      flex-shrink: 0 !important;
    }
  }
</style>

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
<div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors ios-viewport-fix">
  <!-- 헤더 -->
  <header class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
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
  <main class="main-content-safe">
    <div class="content-wrapper container mx-auto px-4 py-8">
      <slot />
    </div>
  </main>
  
  <!-- 푸터 -->
  <footer class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 footer-fixed">
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