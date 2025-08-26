<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8 px-4">
    <!-- 헤더 섹션 -->
    <div class="max-w-4xl mx-auto mb-8">
      <div class="glass-dark rounded-3xl p-8 border border-white/10 shadow-xl">
        <div class="flex items-center justify-between">
          <!-- 타이틀 -->
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <div>
              <h1 class="text-3xl font-bold text-white">게시글 상세보기</h1>
              <p class="text-slate-300 mt-1">게시글의 자세한 내용을 확인하세요</p>
            </div>
          </div>
          
          <!-- 뒤로 가기 버튼 -->
          <button 
            @click="$router.push('/')"
            class="btn-secondary flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
            목록으로
          </button>
        </div>
      </div>
    </div>

    <!-- 로딩 상태 -->
    <div v-if="loading" class="max-w-4xl mx-auto">
      <div class="glass-dark rounded-2xl p-8 border border-white/10 text-center">
        <div class="animate-spin w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full mx-auto mb-4"></div>
        <p class="text-lg text-white font-medium">게시글을 불러오는 중...</p>
      </div>
    </div>

    <!-- 게시글 상세 내용 -->
    <div v-else-if="boardData" class="max-w-4xl mx-auto">
      <BoardDetail 
        :board-data="boardData"
        :is-author="isAuthor"
        @edit="handleEdit"
        @delete="handleDelete"
      />
    </div>

    <!-- 에러 상태 -->
    <div v-else class="max-w-4xl mx-auto">
      <div class="glass-dark rounded-2xl p-8 border border-white/10 text-center">
        <div class="w-16 h-16 bg-red-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
          </svg>
        </div>
        <h3 class="text-xl font-bold text-red-400 mb-2">게시글을 찾을 수 없습니다</h3>
        <p class="text-slate-300 mb-6">요청하신 게시글이 존재하지 않거나 삭제되었습니다.</p>
        <button @click="$router.push('/')" class="btn-primary">
          목록으로 돌아가기
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import BoardDetail from '~/components/BoardDetail.vue'

// 라우트 정보
const route = useRoute()
const postId = route.params.id

// 메타 데이터
useHead({
  title: `게시글 상세보기 - Nuxt Board`,
  meta: [
    { name: 'description', content: '게시글의 자세한 내용을 확인하세요.' }
  ]
})

// 상태 관리
const loading = ref(true)
const boardData = ref(null)
const isAuthor = ref(true) // TODO: 실제 사용자 인증 로직으로 대체

// 게시글 데이터 로드
const loadBoardData = async () => {
  try {
    loading.value = true
    const response = await $fetch(`/api/board/${postId}`)
    
    if (response.success && response.data) {
      boardData.value = {
        title: response.data.TITLE || '',
        content: response.data.CONTENT || '',
        author: response.data.AUTHOR || '익명',
        createdAt: response.data.CREATED_AT || null,
        updatedAt: response.data.UPDATED_AT || null,
        excelData: response.data.EXCEL_DATA || []
      }
      
      // TODO: 실제 사용자 인증 로직으로 대체
      // isAuthor.value = checkIfUserIsAuthor(response.data.AUTHOR_ID)
    } else {
      throw new Error('게시글을 찾을 수 없습니다.')
    }
  } catch (error) {
    console.error('게시글 로드 실패:', error)
    boardData.value = null
  } finally {
    loading.value = false
  }
}

// 수정 버튼 클릭 처리
const handleEdit = () => {
  navigateTo(`/edit/${postId}`)
}

// 삭제 버튼 클릭 처리
const handleDelete = async () => {
  if (!confirm('정말로 이 게시글을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
    return
  }
  
  try {
    const response = await $fetch(`/api/board/${postId}`, {
      method: 'DELETE'
    })
    
    if (response.success) {
      alert('게시글이 성공적으로 삭제되었습니다.')
      navigateTo('/')
    }
  } catch (error) {
    console.error('게시글 삭제 실패:', error)
    alert('게시글 삭제에 실패했습니다. 다시 시도해주세요.')
  }
}

// 컴포넌트 마운트 시 게시글 로드
onMounted(() => {
  loadBoardData()
})
</script>
