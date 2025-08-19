<template>
  <div class="welcome-message">
    <h1 class="welcome-title">🎉 {{ title }}</h1>
    <p class="welcome-subtitle">{{ subtitle }}</p>
    <div class="highlight-box">
      <h3>🚀 지금까지 배운 것들:</h3>
      <div class="learning-grid">
        <div class="learning-item" v-for="item in learningItems" :key="item.name">
          <span class="learning-emoji">{{ item.emoji }}</span>
          <div>
            <strong>{{ item.name }}</strong>
            <p>{{ item.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 컴포넌트 props 정의
defineProps({
  title: {
    type: String,
    default: 'Nuxt-Board에 오신 것을 환영합니다!'
  },
  subtitle: {
    type: String,
    default: '파일 기반 라우팅과 컴포넌트 시스템을 체험해보세요'
  },
  learningItems: {
    type: Array,
    default: () => [
      {
        emoji: '📁',
        name: '파일 기반 라우팅',
        description: '파일 하나로 페이지 자동 생성'
      },
      {
        emoji: '⚡',
        name: '핫 리로드',
        description: '코드 수정 시 즉시 반영'
      },
      {
        emoji: '🧩',
        name: '컴포넌트 자동 Import',
        description: 'import 없이 컴포넌트 사용'
      },
      {
        emoji: '🎨',
        name: '레이아웃 시스템',
        description: '공통 UI 구조 관리'
      }
    ]
  }
})
</script>

<style scoped>
.welcome-message {
  text-align: center;
  margin: 2rem 0;
}

.welcome-title {
  font-size: 2.5rem;
  color: #00DC82;
  margin-bottom: 0.5rem;
}

.welcome-subtitle {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 2rem;
}

.highlight-box {
  background: linear-gradient(135deg, #f0f8ff, #e6f7ff);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid #e1f5fe;
  margin-top: 2rem;
}

.highlight-box h3 {
  color: #00DC82;
  margin-bottom: 1.5rem;
}

.learning-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  text-align: left;
}

.learning-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  background: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.learning-emoji {
  font-size: 2rem;
  flex-shrink: 0;
}

.learning-item strong {
  color: #2d3748;
  display: block;
  margin-bottom: 0.25rem;
}

.learning-item p {
  color: #666;
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.4;
}
</style>