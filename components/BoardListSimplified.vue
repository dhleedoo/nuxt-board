<template>
  <div class="bg-transparent py-4 px-2">
    <!-- 헤더 섹션 -->
    <div class="max-w-6xl mx-auto mb-4">
      <div class="glass-strong rounded-2xl p-4">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          <!-- 타이틀 -->
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 bg-gradient-neon rounded-xl flex items-center justify-center">
              <span class="text-lg">📋</span>
            </div>
            <div>
              <h1 class="text-lg font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                🟢 Pinia 방식 게시판 (420라인)
              </h1>
              <p class="text-slate-400 text-sm">총 {{ boardStore.totalCount }}개의 게시글</p>
            </div>
          </div>
          
          <!-- 검색 및 컨트롤 -->
          <div class="flex flex-col sm:flex-row gap-4">
            <!-- 검색 박스 -->
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>
              <input 
                v-model="boardStore.searchKeyword"
                type="text" 
                placeholder="제목으로 검색하세요..."
                @keyup.enter="boardStore.performSearch()"
                class="pl-12 pr-4 py-3 w-full sm:w-80 bg-white/10 border border-white/30 rounded-2xl 
                       focus:outline-none focus:ring-4 focus:ring-blue-400/30 focus:border-blue-400 
                       transition-all duration-300 placeholder-slate-400 text-white backdrop-blur-lg"
              />
            </div>
            
            <!-- 버튼들 -->
            <div class="flex gap-3">
              <button 
                @click="boardStore.performSearch()" 
                :disabled="boardStore.loading" 
                class="btn-primary flex items-center gap-2 whitespace-nowrap"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                검색
              </button>
              
              <button 
                @click="boardStore.refreshPosts()" 
                :disabled="boardStore.loading" 
                class="btn-secondary flex items-center gap-2 whitespace-nowrap"
              >
                <svg class="w-4 h-4" :class="{ 'animate-spin': boardStore.loading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
                {{ boardStore.loading ? '로딩 중...' : '새로고침' }}
              </button>
              
              <button 
                @click="navigateTo('/create')" 
                class="bg-gradient-to-r from-pink-500 to-orange-500 text-white px-6 py-3 rounded-xl font-semibold 
                       transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/25 
                       active:scale-95 flex items-center gap-2 whitespace-nowrap"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
                글쓰기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 메인 컨텐츠 영역 -->
    <div class="max-w-6xl mx-auto">
      <!-- 로딩 상태 -->
      <div v-if="boardStore.loading" class="flex items-center justify-center py-8">
        <div class="glass-strong rounded-2xl p-6 text-center fade-in">
          <div class="spinner-large mx-auto mb-6"></div>
          <p class="text-lg text-white font-medium mb-2">게시판 데이터를 불러오는 중...</p>
          <p class="text-sm text-slate-300">잠시만 기다려주세요</p>
        </div>
      </div>

      <!-- 에러 상태 -->
      <div v-else-if="boardStore.error" class="flex items-center justify-center py-20">
        <div class="glass-strong rounded-3xl p-12 text-center max-w-md">
          <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
            </svg>
          </div>
          <h4 class="text-xl font-bold text-red-600 mb-2">오류가 발생했습니다</h4>
          <p class="text-white mb-6">{{ boardStore.error }}</p>
          <button @click="boardStore.refreshPosts(); boardStore.clearError()" class="btn-primary">
            다시 시도
          </button>
        </div>
      </div>

      <!-- 게시글 목록 -->
      <div v-else-if="boardStore.hasPosts" class="space-y-3">
        <!-- 목록 메타 정보 -->
        <div class="glass rounded-xl p-3">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div class="flex items-center gap-6">
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span class="text-white font-medium">
                  {{ boardStore.currentPage }}/{{ boardStore.totalPages }} 페이지
                </span>
              </div>
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span class="text-sm text-slate-300">
                  {{ boardStore.lastUpdate || '데이터 로드 중...' }}
                </span>
              </div>
            </div>
            
            <div v-if="boardStore.isSearching" class="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full">
              <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <span class="text-sm text-blue-600 font-medium">"{{ boardStore.searchKeyword }}" 검색 결과</span>
              <button @click="boardStore.clearSearch()" class="text-blue-400 hover:text-blue-600 text-xs">×</button>
            </div>
          </div>
        </div>

        <!-- 게시글 카드 그리드 (3개씩 표시하도록 최적화) -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <article 
            v-for="(post, index) in boardStore.posts" 
            :key="post.BOARD_ID" 
            class="group glass-card hover-lift hover-glow cursor-pointer p-4 stagger-item
                   transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
            :style="{ 'animation-delay': `${index * 0.1 + 0.1}s` }"
            @click="viewPost(post.BOARD_ID)"
          >
            <!-- 카드 헤더 -->
            <div class="flex items-start justify-between mb-4">
              <div class="flex-1">
                <h3 class="text-lg font-bold text-white group-hover:text-blue-300 transition-colors duration-300 line-clamp-2 leading-tight">
                  {{ post.TITLE }}
                </h3>
                <div class="flex items-center gap-2 mt-2">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-400/30">
                    #{{ post.BOARD_ID }}
                  </span>
                </div>
              </div>
            </div>
            
            <!-- 컨텐츠 미리보기 -->
            <p class="text-slate-300 text-sm leading-relaxed mb-4 line-clamp-3">
              {{ getPreview(post.CONTENT) }}
            </p>
            
            <!-- 카드 푸터 -->
            <div class="flex items-center justify-between pt-4 border-t border-white/10">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 bg-gradient-ocean rounded-full flex items-center justify-center">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 7h14l-9-3-9-3v6H5z"/>
                  </svg>
                </div>
                <span class="text-xs font-medium text-slate-400">Pinia Store</span>
                <div class="flex items-center gap-1 text-xs text-slate-400">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                  {{ formatDate(post.CREATED_AT) }}
                </div>
              </div>
              
              <!-- 액션 버튼들 -->
              <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button 
                  @click.stop="showPostDetail(post)"
                  class="w-8 h-8 bg-blue-500/10 hover:bg-blue-500 text-blue-500 hover:text-white rounded-lg 
                         flex items-center justify-center transition-all duration-300"
                  title="상세보기"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                </button>
                
                <button 
                  @click.stop="editPost(post.BOARD_ID)"
                  class="w-8 h-8 bg-green-500/10 hover:bg-green-500 text-green-500 hover:text-white rounded-lg 
                         flex items-center justify-center transition-all duration-300"
                  title="수정하기"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                  </svg>
                </button>
                
                <button 
                  @click.stop="deletePost(post)"
                  class="w-8 h-8 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-lg 
                         flex items-center justify-center transition-all duration-300"
                  title="삭제하기"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                </button>
              </div>
            </div>
          </article>
        </div>
        
        <!-- 페이지네이션 -->
        <div v-if="boardStore.needsPagination" class="mt-4">
          <div class="glass rounded-xl p-3">
            <div class="flex items-center justify-center">
              <nav class="flex items-center gap-2">
                <button 
                  @click="boardStore.changePage(boardStore.currentPage - 1)" 
                  :disabled="boardStore.currentPage <= 1"
                  class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-white/10 border border-white/20 rounded-lg 
                         disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                  </svg>
                  이전
                </button>
                
                <div class="flex items-center gap-1 mx-4">
                  <button
                    v-for="page in boardStore.visiblePages"
                    :key="page"
                    @click="boardStore.changePage(page)"
                    :class="[
                      'w-10 h-10 text-sm font-medium rounded-lg transition-all duration-200',
                      page === boardStore.currentPage 
                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25 scale-110' 
                        : 'bg-white/10 text-white border border-white/20 hover:bg-blue-500/20 hover:border-blue-400 hover:text-blue-300'
                    ]"
                  >
                    {{ page }}
                  </button>
                </div>
                
                <button 
                  @click="boardStore.changePage(boardStore.currentPage + 1)" 
                  :disabled="boardStore.currentPage >= boardStore.totalPages"
                  class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-white/10 border border-white/20 rounded-lg 
                         disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                >
                  다음
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <!-- 빈 상태 -->
      <div v-else>
        <div class="flex items-center justify-center py-20">
          <div class="glass-strong rounded-3xl p-12 text-center max-w-md">
            <div class="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg class="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <h4 class="text-xl font-bold text-white mb-2">게시글이 없습니다</h4>
            <p class="text-slate-300 mb-6">
              {{ boardStore.isSearching ? '검색 결과가 없습니다. 다른 키워드로 시도해보세요.' : '첫 번째 게시글을 작성해보세요!' }}
            </p>
            <button 
              v-if="boardStore.isSearching"
              @click="boardStore.clearSearch()" 
              class="btn-secondary"
            >
              전체 목록 보기
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 상세보기 모달 -->
    <div v-if="boardStore.selectedPost" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" @click="boardStore.clearSelectedPost()">
      <div class="glass-strong rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden" @click.stop>
        <!-- 모달 헤더 -->
        <div class="flex items-center justify-between p-6 border-b border-white/20">
          <div class="flex-1">
            <h3 class="text-xl font-bold text-white pr-8">{{ boardStore.selectedPost.TITLE }}</h3>
            <div class="flex items-center gap-4 mt-2 text-sm text-slate-300">
              <span class="inline-flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
                </svg>
                ID: {{ boardStore.selectedPost.BOARD_ID }}
              </span>
              <span class="inline-flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                {{ formatDate(boardStore.selectedPost.CREATED_AT) }}
              </span>
            </div>
          </div>
          <button 
            @click="boardStore.clearSelectedPost()" 
            class="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all duration-200"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        
        <!-- 모달 바디 -->
        <div class="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div class="prose prose-slate max-w-none">
            <div class="bg-white/10 rounded-xl p-6 whitespace-pre-wrap leading-relaxed text-white border border-white/20">{{ boardStore.selectedPost.CONTENT }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useBoardStore } from '~/stores/board'

// Pinia 스토어 사용
const boardStore = useBoardStore()

// 게시글 상세보기 페이지로 이동
const viewPost = (postId) => {
  navigateTo(`/detail/${postId}`)
}

// 상세보기 페이지로 이동
const showPostDetail = (post) => {
  navigateTo(`/detail/${post.BOARD_ID}`)
}

// 게시글 수정 페이지로 이동
const editPost = (postId) => {
  navigateTo(`/edit/${postId}`)
}

// 게시글 삭제 (스토어 사용)
const deletePost = async (post) => {
  if (!confirm(`"${post.TITLE}" 게시글을 정말 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다.`)) {
    return
  }
  
  const success = await boardStore.deletePost(post.BOARD_ID)
  if (success) {
    alert('게시글이 성공적으로 삭제되었습니다.')
  } else if (boardStore.error) {
    alert(`삭제 실패: ${boardStore.error}`)
  }
}

// 내용 미리보기 (100자 제한)
const getPreview = (content) => {
  if (!content || typeof content !== 'string') {
    return '내용 없음'
  }
  const text = content.replace(/\*\*/g, '').replace(/\n/g, ' ')
  return text.length > 100 ? text.substring(0, 100) + '...' : text
}

// 날짜 포맷팅
const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('ko-KR')
}

// 타임스탬프 포맷팅
const formatTimestamp = (timestamp) => {
  if (!timestamp || timestamp === '') return '데이터 없음'
  
  const date = new Date(timestamp)
  if (isNaN(date.getTime())) return '데이터 없음'
  
  return date.toLocaleString('ko-KR', {
    timeZone: 'Asia/Seoul'
  })
}

// 컴포넌트 마운트 시 데이터 로드
onMounted(() => {
  boardStore.fetchPosts()
})
</script>

<style scoped>
/* Tailwind의 line-clamp 유틸리티 추가 */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>