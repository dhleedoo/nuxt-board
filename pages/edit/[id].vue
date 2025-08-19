<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8 px-4">
    <!-- 헤더 섹션 -->
    <div class="max-w-4xl mx-auto mb-8">
      <div class="glass-dark rounded-3xl p-8 border border-white/10 shadow-xl">
        <div class="flex items-center justify-between">
          <!-- 타이틀 -->
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-gradient-ocean rounded-2xl flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
              </svg>
            </div>
            <div>
              <h1 class="text-3xl font-bold text-white">
                게시글 수정
              </h1>
              <p class="text-slate-300 mt-1">기존 게시글을 수정하세요</p>
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
    <div v-if="loadingPost" class="max-w-4xl mx-auto">
      <div class="glass-dark rounded-2xl p-8 border border-white/10 text-center">
        <div class="animate-spin w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full mx-auto mb-4"></div>
        <p class="text-lg text-white font-medium">게시글을 불러오는 중...</p>
      </div>
    </div>

    <!-- 수정 폼 섹션 -->
    <div v-else-if="form.title" class="max-w-4xl mx-auto">
      <form @submit.prevent="updatePost" class="space-y-6">
        <!-- 제목 입력 -->
        <div class="glass-dark rounded-2xl p-6 border border-white/10">
          <label for="title" class="block text-sm font-semibold text-white mb-3">
            제목 <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <input
              id="title"
              v-model="form.title"
              type="text"
              placeholder="게시글 제목을 입력하세요..."
              class="w-full px-4 py-4 bg-slate-800/50 border border-slate-600/50 rounded-xl
                     focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500
                     transition-all duration-300 placeholder-slate-400 text-lg font-medium text-white"
              :class="{ 'border-red-300 focus:border-red-500 focus:ring-red-500/20': errors.title }"
            />
            <div class="absolute right-4 top-4 text-sm text-slate-400">
              {{ form.title.length }}/100
            </div>
          </div>
          <p v-if="errors.title" class="text-red-500 text-sm mt-2 flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
            </svg>
            {{ errors.title }}
          </p>
        </div>

        <!-- 내용 입력 -->
        <div class="glass-dark rounded-2xl p-6 border border-white/10">
          <label for="content" class="block text-sm font-semibold text-white mb-3">
            내용 <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <textarea
              id="content"
              v-model="form.content"
              rows="12"
              placeholder="게시글 내용을 작성하세요..."
              class="w-full px-4 py-4 bg-slate-800/50 border border-slate-600/50 rounded-xl
                     focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500
                     transition-all duration-300 placeholder-slate-400 leading-relaxed resize-none text-white"
              :class="{ 'border-red-300 focus:border-red-500 focus:ring-red-500/20': errors.content }"
            ></textarea>
            <div class="absolute right-4 bottom-4 text-sm text-slate-400">
              {{ form.content.length }}/2000
            </div>
          </div>
          <p v-if="errors.content" class="text-red-500 text-sm mt-2 flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
            </svg>
            {{ errors.content }}
          </p>
        </div>

        <!-- 버튼 영역 -->
        <div class="glass-dark rounded-2xl p-6 border border-white/10">
          <div class="flex flex-col sm:flex-row gap-4 sm:justify-end">
            <button
              type="button"
              @click="$router.push('/')"
              class="btn-secondary order-2 sm:order-1"
              :disabled="submitting"
            >
              취소
            </button>
            
            <button
              type="button"
              @click="deletePost"
              class="bg-red-500 text-white px-6 py-3 rounded-xl font-semibold 
                     transition-all duration-300 hover:bg-red-600 hover:shadow-lg 
                     hover:shadow-red-500/25 active:scale-95 flex items-center 
                     justify-center gap-2 order-3 sm:order-2"
              :disabled="submitting"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
              삭제
            </button>
            
            <button
              type="submit"
              class="btn-primary order-1 sm:order-3 flex items-center justify-center gap-2"
              :disabled="submitting || !isFormValid"
            >
              <svg v-if="submitting" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              {{ submitting ? '수정 중...' : '수정 완료' }}
            </button>
          </div>
        </div>
      </form>
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
          {{ redirecting ? '목록으로 이동 중...' : '게시글이 성공적으로 수정되었습니다!' }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'

// 라우트 정보
const route = useRoute()
const postId = route.params.id

// 메타 데이터
useHead({
  title: `게시글 수정 - Nuxt Board`,
  meta: [
    { name: 'description', content: '게시글을 수정하세요.' }
  ]
})

// 폼 데이터
const form = ref({
  title: '',
  content: ''
})

// 상태 관리
const loadingPost = ref(true)
const submitting = ref(false)
const showSuccess = ref(false)
const redirecting = ref(false)

// 에러 상태
const errors = ref({
  title: '',
  content: ''
})

// 폼 유효성 검사
const isFormValid = computed(() => {
  return form.value.title.trim().length > 0 && 
         form.value.content.trim().length > 0 &&
         form.value.title.length <= 100 &&
         form.value.content.length <= 2000
})

// 실시간 유효성 검사
watch(() => form.value.title, (newTitle) => {
  if (newTitle.trim().length === 0) {
    errors.value.title = '제목을 입력해주세요.'
  } else if (newTitle.length > 100) {
    errors.value.title = '제목은 100자 이내로 입력해주세요.'
  } else {
    errors.value.title = ''
  }
})

watch(() => form.value.content, (newContent) => {
  if (newContent.trim().length === 0) {
    errors.value.content = '내용을 입력해주세요.'
  } else if (newContent.length > 2000) {
    errors.value.content = '내용은 2000자 이내로 입력해주세요.'
  } else {
    errors.value.content = ''
  }
})

// 게시글 로드
const loadPost = async () => {
  try {
    loadingPost.value = true
    const response = await $fetch(`/api/board/${postId}`)
    
    if (response.success && response.data) {
      form.value = {
        title: response.data.TITLE || '',
        content: response.data.CONTENT || ''
      }
    } else {
      throw new Error('게시글을 찾을 수 없습니다.')
    }
  } catch (error) {
    console.error('게시글 로드 실패:', error)
    // 에러 상태는 v-else에서 처리됨
  } finally {
    loadingPost.value = false
  }
}

// 게시글 수정
const updatePost = async () => {
  if (!isFormValid.value) return
  
  submitting.value = true
  
  try {
    const response = await $fetch(`/api/board/${postId}`, {
      method: 'PUT',
      body: {
        title: form.value.title.trim(),
        content: form.value.content.trim()
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
    console.error('게시글 수정 실패:', error)
    alert('게시글 수정에 실패했습니다. 다시 시도해주세요.')
  } finally {
    submitting.value = false
  }
}

// 게시글 삭제
const deletePost = async () => {
  if (!confirm('정말로 이 게시글을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
    return
  }
  
  submitting.value = true
  
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
  } finally {
    submitting.value = false
  }
}

// 컴포넌트 마운트 시 게시글 로드
onMounted(() => {
  loadPost()
})
</script>