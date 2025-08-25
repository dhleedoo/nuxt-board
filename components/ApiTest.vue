<template>
  <div class="api-test-container">
    <div class="glass-dark rounded-2xl p-6 border border-white/10">
      <h2 class="text-2xl font-bold text-white mb-6">엑셀 데이터 API 테스트</h2>
      
      <!-- 테스트 데이터 입력 -->
      <div class="mb-6">
        <h3 class="text-lg font-semibold text-white mb-3">테스트 데이터</h3>
        <textarea
          v-model="testData"
          class="w-full h-32 p-3 bg-slate-800 border border-slate-600 rounded-lg text-white"
          placeholder="테스트할 JSON 데이터를 입력하세요 (예: [['제품명', '수량'], ['노트북', '5']])"
        ></textarea>
      </div>
      
      <!-- API 테스트 버튼들 -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <button
          @click="testSaveExcel"
          :disabled="testing"
          class="btn-primary"
        >
          저장 테스트
        </button>
        
        <button
          @click="testGetAllExcel"
          :disabled="testing"
          class="btn-secondary"
        >
          전체 조회
        </button>
        
        <button
          @click="testGetExcelById"
          :disabled="testing || !lastSavedId"
          class="btn-secondary"
        >
          ID 조회
        </button>
        
        <button
          @click="testDeleteExcel"
          :disabled="testing || !lastSavedId"
          class="btn-danger"
        >
          삭제 테스트
        </button>
      </div>
      
      <!-- 결과 표시 -->
      <div v-if="result" class="mb-6">
        <h3 class="text-lg font-semibold text-white mb-3">API 응답 결과</h3>
        <div class="bg-slate-800 border border-slate-600 rounded-lg p-4">
          <pre class="text-green-400 text-sm overflow-auto">{{ JSON.stringify(result, null, 2) }}</pre>
        </div>
      </div>
      
      <!-- 에러 표시 -->
      <div v-if="error" class="mb-6">
        <h3 class="text-lg font-semibold text-red-400 mb-3">에러 발생</h3>
        <div class="bg-red-900/20 border border-red-600 rounded-lg p-4">
          <pre class="text-red-300 text-sm">{{ error }}</pre>
        </div>
      </div>
      
      <!-- 상태 표시 -->
      <div class="text-sm text-slate-400">
        <p>마지막 저장된 ID: {{ lastSavedId || '없음' }}</p>
        <p>테스트 상태: {{ testing ? '테스트 중...' : '대기 중' }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 상태 관리
const testData = ref(`[
  ["제품명", "수량", "단가", "총액"],
  ["노트북", "5", "1200000", "6000000"],
  ["마우스", "10", "50000", "500000"],
  ["키보드", "8", "80000", "640000"]
]`)

const testing = ref(false)
const result = ref(null)
const error = ref(null)
const lastSavedId = ref(null)

// API 테스트 함수들
const testSaveExcel = async () => {
  try {
    testing.value = true
    error.value = null
    result.value = null
    
    // JSON 파싱
    let parsedData
    try {
      parsedData = JSON.parse(testData.value)
    } catch (parseError) {
      throw new Error('JSON 형식이 올바르지 않습니다.')
    }
    
    // 임시로 테스트용 BOARD_ID 생성 (실제로는 게시글을 먼저 생성해야 함)
    const testBoardId = Math.floor(Math.random() * 1000) + 1000 // 1000-1999 범위
    
    const response = await $fetch('/api/excel', {
      method: 'POST',
      body: { 
        boardId: testBoardId,
        excelData: parsedData 
      }
    })
    
    result.value = response
    if (response.success && response.data?.boardId) {
      lastSavedId.value = response.data.boardId
    }
    
  } catch (err) {
    error.value = err.message || '알 수 없는 오류가 발생했습니다.'
    console.error('저장 테스트 실패:', err)
  } finally {
    testing.value = false
  }
}

const testGetAllExcel = async () => {
  try {
    testing.value = true
    error.value = null
    result.value = null
    
    const response = await $fetch('/api/excel?limit=10')
    
    result.value = response
    
  } catch (err) {
    error.value = err.message || '알 수 없는 오류가 발생했습니다.'
    console.error('전체 조회 테스트 실패:', err)
  } finally {
    testing.value = false
  }
}

const testGetExcelById = async () => {
  if (!lastSavedId.value) {
    error.value = '먼저 데이터를 저장해주세요.'
    return
  }
  
  try {
    testing.value = true
    error.value = null
    result.value = null
    
    const response = await $fetch(`/api/excel/${lastSavedId.value}`)
    
    result.value = response
    
  } catch (err) {
    error.value = err.message || '알 수 없는 오류가 발생했습니다.'
    console.error('ID 조회 테스트 실패:', err)
  } finally {
    testing.value = false
  }
}

const testDeleteExcel = async () => {
  if (!lastSavedId.value) {
    error.value = '먼저 데이터를 저장해주세요.'
    return
  }
  
  if (!confirm(`ID ${lastSavedId.value}의 데이터를 삭제하시겠습니까?`)) {
    return
  }
  
  try {
    testing.value = true
    error.value = null
    result.value = null
    
    const response = await $fetch(`/api/excel/${lastSavedId.value}`, {
      method: 'DELETE'
    })
    
    result.value = response
    if (response.success && response.data?.deleted) {
      lastSavedId.value = null
    }
    
  } catch (err) {
    error.value = err.message || '알 수 없는 오류가 발생했습니다.'
    console.error('삭제 테스트 실패:', err)
  } finally {
    testing.value = false
  }
}
</script>

<style scoped>
.api-test-container {
  @apply w-full;
}

.btn-primary {
  @apply bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed;
}

.btn-secondary {
  @apply bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed;
}

.btn-danger {
  @apply bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed;
}
</style>