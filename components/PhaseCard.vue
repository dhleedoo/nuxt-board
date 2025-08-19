<template>
  <div class="phase-card" :class="{ completed: isCompleted }">
    <div class="phase-header">
      <span class="phase-number">{{ phaseNumber }}</span>
      <h3 class="phase-title">{{ title }}</h3>
      <span class="phase-status">{{ isCompleted ? '✅' : '🔄' }}</span>
    </div>
    <p class="phase-description">{{ description }}</p>
    <div class="phase-achievements" v-if="achievements.length">
      <h4>달성한 것들:</h4>
      <ul>
        <li v-for="achievement in achievements" :key="achievement">
          ✅ {{ achievement }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
// Props 정의 - 부모 컴포넌트에서 데이터 받기
defineProps({
  phaseNumber: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  achievements: {
    type: Array,
    default: () => []
  }
})
</script>

<style scoped>
.phase-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #ddd;
  transition: all 0.3s ease;
}

.phase-card.completed {
  border-left-color: #00DC82;
  background: linear-gradient(135deg, #f8fff9, #f0fff4);
}

.phase-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.phase-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.phase-number {
  background: #00DC82;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: bold;
  font-size: 0.9rem;
}

.phase-title {
  flex: 1;
  margin: 0;
  color: #2d3748;
  font-size: 1.3rem;
}

.phase-status {
  font-size: 1.5rem;
}

.phase-description {
  color: #666;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.phase-achievements h4 {
  color: #00DC82;
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.phase-achievements ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.phase-achievements li {
  padding: 0.25rem 0;
  color: #2d3748;
  font-weight: 500;
}
</style>