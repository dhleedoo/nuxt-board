<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8 px-4">
    <!-- 헤더 섹션 -->
    <div class="max-w-4xl mx-auto mb-8">
      <div class="glass-dark rounded-3xl p-8 border border-white/10 shadow-xl">
        <div class="flex items-center justify-between">
          <!-- 타이틀 -->
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-gradient-sunset rounded-2xl flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
              </svg>
            </div>
            <div>
              <h1 class="text-3xl font-bold text-white">
                새 게시글 작성
              </h1>
              <p class="text-slate-300 mt-1">여러분의 생각을 자유롭게 공유해보세요</p>
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

    <!-- 작성 폼 섹션 -->
    <div class="max-w-4xl mx-auto">
      <BoardForm 
        mode="create"
        title-placeholder="게시글 제목을 입력하세요..."
        content-placeholder="• 다른 사용자에게 도움이 되는 내용을 작성해주세요
• 명확하고 구체적인 정보를 포함해주세요
• 예의 바른 언어를 사용해주세요"
        submit-button-text="게시글 발행"
        submitting-text="발행 중..."
        cancel-button-text="취소"
        :excel-headers="['제품명', '수량', '단가', '총액']"
        @submit="handleFormSubmit"
        @cancel="$router.push('/')"
      />
    </div>

    <!-- 성공 토스트 -->
    <div v-if="showSuccess" class="fixed bottom-8 right-8 glass-dark rounded-2xl p-4 border border-green-500/30 shadow-xl">
      <div class="flex items-center gap-3">
        <div v-if="!redirecting" class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
        </div>
        <div v-else class="w-8 h-8 rounded-full flex items-center justify-center">
          <svg class="w-5 h-5 animate-spin text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
        </div>
        <p class="text-green-400 font-medium">
          {{ redirecting ? '목록으로 이동 중...' : '게시글이 성공적으로 발행되었습니다!' }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 메타 데이터
useHead({
  title: '새 게시글 작성 - Nuxt Board',
  meta: [
    { name: 'description', content: '새로운 게시글을 작성하고 공유하세요.' }
  ]
})

// 제출 상태
const submitting = ref(false)
const showSuccess = ref(false)
const redirecting = ref(false)

// BoardForm 컴포넌트에서 제출된 데이터 처리
const handleFormSubmit = async (formData) => {
  submitting.value = true
  
  // 디버깅: 전달받은 데이터 확인
  console.log('📝 BoardForm에서 전달받은 데이터:', formData)
  console.log('📊 엑셀 데이터:', formData.excelData)
  console.log('📊 엑셀 데이터 타입:', typeof formData.excelData)
  console.log('📊 엑셀 데이터 길이:', formData.excelData?.length)
  
  try {
    // STEP 3-1: 엑셀 데이터를 포함하여 API 호출
    const response = await $fetch('/api/board', {
      method: 'POST',
      body: {
        title: formData.title,
        content: formData.content,
        excelData: formData.excelData
      }
    })
    
    if (response.success) {
      showSuccess.value = true
      
      // 1초 후 목록 페이지로 이동
      setTimeout(() => {
        redirecting.value = true
        setTimeout(() => {
          navigateTo('/')
        }, 200) // 로딩 상태를 잠깐 보여준 후 이동
      }, 1000)
    }
  } catch (error) {
    console.error('게시글 작성 실패:', error)
    alert('게시글 작성에 실패했습니다. 다시 시도해주세요.')
  } finally {
    submitting.value = false
  }
}
</script>