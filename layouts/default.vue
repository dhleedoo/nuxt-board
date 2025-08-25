<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
    <!-- 상단 헤더 - 모던 글래스모피즘 디자인 -->
    <header class="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-white/20 shadow-xl">
      <div class="max-w-7xl mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <!-- 로고 영역 -->
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <h1 class="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              <NuxtLink to="/" class="hover:scale-105 transition-transform duration-300">
                Nuxt Board
              </NuxtLink>
            </h1>
          </div>
          
          <!-- 네비게이션 메뉴 -->
          <nav class="hidden md:flex items-center gap-2">
            <NuxtLink 
              to="/" 
              class="nav-button"
              active-class="nav-button-active"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 1v6m8-6v6"/>
              </svg>
              게시판
            </NuxtLink>
            
            <NuxtLink 
              to="/create" 
              class="nav-button-primary"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
              글쓰기
            </NuxtLink>
          </nav>
          
          <!-- 모바일 메뉴 버튼 -->
          <button 
            @click="toggleMobileMenu" 
            class="md:hidden p-2 rounded-xl bg-white/80 border border-white/20 hover:bg-white/90 transition-all duration-300"
          >
            <svg v-if="!mobileMenuOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
            <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>
      
      <!-- 모바일 메뉴 -->
      <div v-if="mobileMenuOpen" class="md:hidden border-t border-white/20 bg-white/90 backdrop-blur-md">
        <div class="max-w-7xl mx-auto px-6 py-4 space-y-2">
          <NuxtLink 
            to="/" 
            @click="closeMobileMenu"
            class="mobile-nav-button"
            active-class="mobile-nav-button-active"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 1v6m8-6v6"/>
            </svg>
            게시판
          </NuxtLink>
          
          <NuxtLink 
            to="/create" 
            @click="closeMobileMenu"
            class="mobile-nav-button-primary"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            글쓰기
          </NuxtLink>
        </div>
      </div>
    </header>

    <!-- 메인 콘텐츠 영역 -->
    <main class="min-h-screen">
      <!-- 이 부분에 각 페이지 내용이 들어감 -->
      <slot />
    </main>

    <!-- 하단 푸터 -->
    <footer class="bg-gradient-to-r from-slate-800 to-slate-900 text-white">
      <div class="max-w-6xl mx-auto px-6 py-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- 프로젝트 정보 -->
          <div class="space-y-4">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </div>
              <h3 class="text-lg font-bold">Nuxt Board</h3>
            </div>
            <p class="text-slate-300 text-sm leading-relaxed">
              Nuxt 4 + Vue 3 + Oracle DB로 구축된 모던한 게시판 시스템입니다. 
              Tailwind CSS와 glassmorphism 디자인을 적용했습니다.
            </p>
          </div>
          
          <!-- 기술 스택 -->
          <div class="space-y-4">
            <h4 class="text-md font-semibold text-white">기술 스택</h4>
            <div class="space-y-2 text-sm">
              <div class="flex items-center gap-2 text-slate-300">
                <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Nuxt 4.0.3 + Vue 3.5.18</span>
              </div>
              <div class="flex items-center gap-2 text-slate-300">
                <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Oracle Database</span>
              </div>
              <div class="flex items-center gap-2 text-slate-300">
                <div class="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Tailwind CSS</span>
              </div>
              <div class="flex items-center gap-2 text-slate-300">
                <div class="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span>TypeScript</span>
              </div>
            </div>
          </div>
          
          <!-- 학습 단계 -->
          <div class="space-y-4">
            <h4 class="text-md font-semibold text-white">학습 진행률</h4>
            <div class="space-y-3">
              <div class="space-y-2">
                <div class="flex justify-between text-sm">
                  <span class="text-slate-300">CRUD 구현</span>
                  <span class="text-green-400 font-medium">100%</span>
                </div>
                <div class="w-full bg-slate-700 rounded-full h-2">
                  <div class="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full w-full"></div>
                </div>
              </div>
              
              <div class="space-y-2">
                <div class="flex justify-between text-sm">
                  <span class="text-slate-300">모던 UI/UX</span>
                  <span class="text-blue-400 font-medium">100%</span>
                </div>
                <div class="w-full bg-slate-700 rounded-full h-2">
                  <div class="bg-gradient-to-r from-blue-500 to-blue-400 h-2 rounded-full w-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 하단 구분선 및 저작권 -->
        <div class="border-t border-slate-700 mt-6 pt-6 text-center">
          <p class="text-slate-400 text-sm">
            &copy; {{ currentYear }} Nuxt Board | SuperClaude 프레임워크로 구축된 학습 프로젝트 ✨
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

// 모바일 메뉴 상태
const mobileMenuOpen = ref<boolean>(false)

// 현재 연도
const currentYear = computed(() => new Date().getFullYear())

// 모바일 메뉴 토글
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

// 모바일 메뉴 닫기
const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

// 페이지 이동시 모바일 메뉴 닫기
const router = useRouter()
router.beforeEach(() => {
  mobileMenuOpen.value = false
})
</script>

<style scoped>
/* 네비게이션 버튼 스타일 */
.nav-button {
  @apply flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
         transition-all duration-300 text-slate-600 hover:text-slate-800
         hover:bg-white/50 border border-transparent hover:border-white/30;
}

.nav-button-active {
  @apply bg-white/80 text-slate-800 border-white/40 shadow-sm;
}

.nav-button-primary {
  @apply flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-semibold
         bg-gradient-to-r from-blue-500 to-purple-600 text-white
         hover:from-blue-600 hover:to-purple-700 hover:shadow-lg 
         hover:shadow-blue-500/25 transition-all duration-300 active:scale-95;
}

/* 모바일 네비게이션 버튼 스타일 */
.mobile-nav-button {
  @apply flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium
         transition-all duration-300 text-slate-600 hover:text-slate-800
         hover:bg-white/70 border border-transparent hover:border-white/30;
}

.mobile-nav-button-active {
  @apply bg-white/90 text-slate-800 border-white/50 shadow-sm;
}

.mobile-nav-button-primary {
  @apply flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold
         bg-gradient-to-r from-blue-500 to-purple-600 text-white
         hover:from-blue-600 hover:to-purple-700 transition-all duration-300;
}

/* 반응형 디자인 조정 */
@media (max-width: 768px) {
  .nav-button-primary {
    @apply px-4 py-2;
  }
}
</style>