<template>
  <div class="board-detail">
    <!-- 게시글 기본 정보 -->
    <div class="glass-dark rounded-3xl p-8 border border-white/10 shadow-xl mb-8">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </div>
          <div>
            <h1 class="text-3xl font-bold text-white">{{ boardData.title }}</h1>
            <div class="flex items-center gap-4 text-slate-300 mt-2">
              <span>작성자: {{ boardData.author || '익명' }}</span>
              <span>작성일: {{ formatDate(boardData.createdAt) }}</span>
              <span v-if="boardData.updatedAt">수정일: {{ formatDate(boardData.updatedAt) }}</span>
            </div>
          </div>
        </div>
        
        <!-- 수정/삭제 버튼 (작성자인 경우만 표시) -->
        <div v-if="isAuthor" class="flex gap-3">
          <button 
            @click="$emit('edit')"
            class="btn-secondary flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
            </svg>
            수정
          </button>
          
          <button 
            @click="$emit('delete')"
            class="btn-danger flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
            삭제
          </button>
        </div>
      </div>
      
      <!-- 게시글 내용 -->
      <div class="prose prose-invert max-w-none">
        <div class="text-slate-200 leading-relaxed whitespace-pre-wrap">{{ boardData.content }}</div>
      </div>
    </div>

    <!-- 엑셀 데이터 섹션 -->
    <div v-if="boardData.excelData && boardData.excelData.length > 0" class="safe-container">
      <div class="mb-6">
        <h2 class="text-2xl font-bold text-white mb-2">엑셀 데이터</h2>
        <p class="text-slate-300">게시글과 함께 등록된 엑셀 데이터입니다.</p>
      </div>
      
      <!-- ExcelEditor 컴포넌트를 읽기 전용으로 사용 -->
      <ExcelEditor
        :editable="false"
        :headers="excelHeaders"
        :initial-data="boardData.excelData"
      />
    </div>
  </div>
</template>

<script setup>
import ExcelEditor from './ExcelEditor.vue'

// Props 정의
const props = defineProps({
  boardData: {
    type: Object,
    required: true,
    default: () => ({
      title: '',
      content: '',
      author: '',
      createdAt: null,
      updatedAt: null,
      excelData: []
    })
  },
  isAuthor: {
    type: Boolean,
    default: false
  },
  excelHeaders: {
    type: Array,
    default: () => ['제품명', '수량', '단가', '총액']
  }
})

// Emits 정의
const emit = defineEmits(['edit', 'delete'])

// 날짜 포맷팅 함수
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
.board-detail {
  @apply w-full;
}

.prose {
  @apply text-slate-200;
}

.prose-invert {
  @apply text-slate-200;
}

/* safe-container 스타일 상속 */
.safe-container {
  background: rgba(30, 41, 59, 0.5);
  border-radius: 1rem;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1);
}
</style>
