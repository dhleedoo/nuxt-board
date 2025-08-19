<template>
  <div class="api-test">
    <h3>🚀 Nitro API 테스트</h3>
    
    <div class="test-buttons">
      <button @click="testApi" :disabled="loading" class="test-btn">
        {{ loading ? '🔄 테스트 중...' : '🎯 API 호출 테스트' }}
      </button>
      <button @click="clearResult" class="clear-btn">🗑️ 결과 지우기</button>
    </div>
    
    <!-- API 응답 결과 표시 -->
    <div v-if="apiResult" class="api-result">
      <h4>📡 API 응답 결과:</h4>
      <div class="result-card">
        <div class="result-status" :class="{ success: apiResult.success }">
          {{ apiResult.success ? '✅ 성공' : '❌ 실패' }}
        </div>
        <div class="result-content">
          <p><strong>메시지:</strong> {{ apiResult.message }}</p>
          <p><strong>시간:</strong> {{ apiResult.timestamp }}</p>
          <div v-if="apiResult.info" class="api-info">
            <h5>📋 API 정보:</h5>
            <ul>
              <li><strong>엔드포인트:</strong> {{ apiResult.info.endpoint }}</li>
              <li><strong>메서드:</strong> {{ apiResult.info.method }}</li>
              <li><strong>설명:</strong> {{ apiResult.info.description }}</li>
            </ul>
          </div>
          <div v-if="apiResult.phase" class="phase-info">
            <h5>🎯 Phase 정보:</h5>
            <p><strong>현재:</strong> {{ apiResult.phase.current }}</p>
            <p><strong>성취:</strong> {{ apiResult.phase.achievement }}</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 에러 메시지 -->
    <div v-if="error" class="error-message">
      <h4>❌ 에러 발생:</h4>
      <p>{{ error }}</p>
    </div>
    
    <!-- 파일 기반 API 설명 -->
    <div class="explanation">
      <h4>💡 파일 기반 API 라우팅</h4>
      <div class="explanation-grid">
        <div class="explanation-item">
          <strong>📁 server/api/hello.get.ts</strong>
          <p>→ GET /api/hello</p>
        </div>
        <div class="explanation-item">
          <strong>🔗 자동 라우팅</strong>
          <p>파일명 = API 경로</p>
        </div>
        <div class="explanation-item">
          <strong>⚡ Nitro 엔진</strong>
          <p>별도 Express 서버 불필요</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 반응형 데이터
const loading = ref(false)
const apiResult = ref(null)
const error = ref(null)

// API 호출 함수
const testApi = async () => {
  loading.value = true
  error.value = null
  apiResult.value = null
  
  try {
    // Nuxt의 $fetch를 사용한 API 호출
    const response = await $fetch('/api/hello')
    apiResult.value = response
  } catch (err) {
    error.value = err.message || 'API 호출 중 오류가 발생했습니다.'
  } finally {
    loading.value = false
  }
}

// 결과 지우기 함수
const clearResult = () => {
  apiResult.value = null
  error.value = null
}
</script>

<style scoped>
.api-test {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  margin: 2rem 0;
}

.api-test h3 {
  color: #00DC82;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

.test-buttons {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.test-btn {
  background: linear-gradient(135deg, #00DC82, #36E4DA);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s;
}

.test-btn:hover:not(:disabled) {
  transform: translateY(-2px);
}

.test-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.clear-btn {
  background: #6c757d;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}

.api-result {
  margin: 2rem 0;
}

.result-card {
  background: #f8f9fa;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e9ecef;
}

.result-status {
  padding: 1rem;
  font-weight: bold;
  background: #dc3545;
  color: white;
}

.result-status.success {
  background: #28a745;
}

.result-content {
  padding: 1.5rem;
}

.api-info, .phase-info {
  background: #e7f3ff;
  padding: 1rem;
  border-radius: 6px;
  margin: 1rem 0;
}

.api-info ul {
  margin: 0.5rem 0;
  padding-left: 1rem;
}

.error-message {
  background: #f8d7da;
  color: #721c24;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #f5c6cb;
  margin: 2rem 0;
}

.explanation {
  background: linear-gradient(135deg, #f0f8ff, #e6f7ff);
  padding: 1.5rem;
  border-radius: 8px;
  margin: 2rem 0;
}

.explanation h4 {
  color: #0066cc;
  margin-bottom: 1rem;
}

.explanation-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.explanation-item {
  background: white;
  padding: 1rem;
  border-radius: 6px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.explanation-item strong {
  color: #00DC82;
  display: block;
  margin-bottom: 0.5rem;
}

.explanation-item p {
  color: #666;
  margin: 0;
  font-size: 0.9rem;
}
</style>