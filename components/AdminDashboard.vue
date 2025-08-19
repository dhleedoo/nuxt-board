<template>
  <div class="bg-slate-800 p-4 rounded-xl">
    <h3 class="text-white text-lg font-bold mb-3">🔥 Pinia의 실무적 이점 시연</h3>
    
    <!-- 실시간 상태 공유 시연 -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
      <div class="bg-blue-900/30 p-4 rounded-lg border border-blue-500/30">
        <h4 class="text-blue-300 font-semibold mb-2">📊 실시간 통계</h4>
        <p class="text-white">총 게시글: <span class="text-blue-400 font-bold">{{ boardStore.totalCount }}</span></p>
        <p class="text-white">현재 페이지: <span class="text-blue-400 font-bold">{{ boardStore.currentPage }}/{{ boardStore.totalPages }}</span></p>
        <p class="text-white">로딩 상태: 
          <span :class="boardStore.loading ? 'text-yellow-400 animate-pulse' : 'text-green-400'" class="font-bold">
            {{ boardStore.loading ? '🔄 API 호출 중...' : '✅ 대기 중' }}
          </span>
        </p>
      </div>
      
      <div class="bg-green-900/30 p-4 rounded-lg border border-green-500/30">
        <h4 class="text-green-300 font-semibold mb-2">🔍 검색 상태</h4>
        <p class="text-white">검색 중: 
          <span :class="boardStore.isSearching ? 'text-yellow-400' : 'text-gray-400'" class="font-bold">
            {{ boardStore.isSearching ? 'Yes' : 'No' }}
          </span>
        </p>
        <p class="text-white">키워드: 
          <span class="text-green-400 font-mono">
            "{{ boardStore.searchKeyword || '없음' }}"
          </span>
        </p>
      </div>
      
      <div class="bg-purple-900/30 p-4 rounded-lg border border-purple-500/30">
        <h4 class="text-purple-300 font-semibold mb-2">📝 마지막 업데이트</h4>
        <p class="text-white text-sm mb-2">{{ boardStore.lastUpdate || '데이터 로드 중...' }}</p>
        <div class="flex gap-2">
          <button 
            @click="boardStore.refreshPosts()"
            :disabled="boardStore.loading"
            class="px-3 py-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white text-sm rounded transition-colors flex items-center gap-1"
          >
            <span v-if="boardStore.loading" class="animate-spin">🔄</span>
            {{ boardStore.loading ? 'API 호출 중...' : '새로고침' }}
          </button>
          <button 
            @click="forceUpdate"
            :disabled="boardStore.loading"
            class="px-3 py-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white text-sm rounded transition-colors"
          >
            즉시 업데이트
          </button>
        </div>
      </div>
    </div>
    
    <!-- 다른 페이지에서의 쉬운 사용 시연 -->
    <div class="bg-slate-700 p-3 rounded-lg">
      <h4 class="text-white font-semibold mb-2">🚀 다른 페이지에서의 즉시 사용 (코드 재사용 100%)</h4>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <button 
          @click="boardStore.performSearch('테스트')"
          :disabled="boardStore.loading"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors text-sm"
        >
          '테스트' 검색하기
        </button>
        <button 
          @click="boardStore.changePage(1)"
          :disabled="boardStore.loading"
          class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors text-sm"
        >
          첫 페이지로 이동
        </button>
        <button 
          @click="boardStore.clearSearch()"
          :disabled="boardStore.loading"
          class="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded transition-colors text-sm"
        >
          검색 초기화
        </button>
        <button 
          @click="showLastPost"
          class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded transition-colors text-sm"
        >
          최신 게시글 보기
        </button>
      </div>
    </div>
    
    <!-- 최신 게시글 미리보기 -->
    <div v-if="boardStore.hasPosts" class="mt-3 bg-slate-600 p-3 rounded-lg">
      <h4 class="text-white font-semibold mb-2">📰 최신 게시글 미리보기</h4>
      <div class="text-sm text-gray-300">
        <p><strong>제목:</strong> {{ boardStore.posts[0]?.TITLE }}</p>
        <p><strong>ID:</strong> {{ boardStore.posts[0]?.BOARD_ID }}</p>
        <p><strong>작성일:</strong> {{ formatDate(boardStore.posts[0]?.CREATED_AT) }}</p>
      </div>
    </div>
    
    <!-- 코드 없이 상태 공유 증명 -->
    <div class="mt-3 p-2 bg-yellow-900/20 border border-yellow-600/30 rounded-lg">
      <p class="text-yellow-200 text-xs">
        <strong>💡 증명:</strong> 위 모든 데이터는 BoardList에서 관리하는 것과 <strong>동일한 상태</strong>입니다. 
        API 호출, 상태 관리 로직을 <strong>전혀 복사하지 않고도</strong> 실시간으로 공유됩니다!
      </p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useBoardStore } from '~/stores/board'

// 🎉 단 한 줄로 모든 게시판 기능 사용 가능!
const boardStore = useBoardStore()

// 최신 게시글 상세보기
const showLastPost = async () => {
  if (boardStore.hasPosts) {
    const post = boardStore.posts[0]
    await boardStore.fetchPost(post.BOARD_ID)
    alert(`최신 게시글: "${boardStore.selectedPost?.TITLE}"`)
  }
}

// 강제 업데이트 (타임스탬프 변화를 즉시 보기 위해)
const forceUpdate = () => {
  // 스토어의 lastUpdate를 현재 시간으로 강제 업데이트
  boardStore.$patch({
    lastUpdate: new Date().toLocaleString('ko-KR', {
      timeZone: 'Asia/Seoul'
    })
  })
}

// 날짜 포맷팅
const formatDate = (dateStr) => {
  if (!dateStr) return '없음'
  return new Date(dateStr).toLocaleDateString('ko-KR')
}

// 타임스탬프 포맷팅  
const formatTimestamp = (timestamp) => {
  if (!timestamp || timestamp === '') return '업데이트 없음'
  
  // 유효한 날짜인지 확인
  const date = new Date(timestamp)
  if (isNaN(date.getTime())) {
    return '업데이트 없음'
  }
  
  return date.toLocaleString('ko-KR', {
    timeZone: 'Asia/Seoul'
  })
}

// 컴포넌트 마운트 시 데이터 로드 (AdminDashboard가 스토어 상태를 즉시 보여주도록)
onMounted(async () => {
  // 스토어에 데이터가 없다면 자동으로 로드
  if (boardStore.posts.length === 0) {
    await boardStore.fetchPosts()
  }
})
</script>