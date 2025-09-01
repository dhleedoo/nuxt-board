<template>
  <div class="patrol-schedule">
    <!-- 테이블 헤더 -->
    <div class="table-header">
      <div class="header-cell location-header">Patrol 위치</div>
      <div class="header-cell time-header">Patrol 시간</div>
    </div>

    <!-- 테이블 바디 -->
    <div class="table-body">
      <div 
        v-for="location in patrolData" 
        :key="location.id"
        class="table-row"
        :class="{ 'completed': location.status === 'done' }"
      >
        <!-- 위치 정보 컬럼 -->
        <div class="table-cell location-cell">
          <span class="location-name">{{ location.name }}</span>
        </div>

        <!-- 시간 정보 컬럼 -->
        <div class="table-cell time-cell">
          <div class="time-content">
            <!-- 시간 표시 (있는 경우만) -->
            <span v-if="location.time" class="patrol-time">
              {{ location.time }}
            </span>
            
            <!-- 완료 상태 체크박스 -->
            <div class="status-control">
              <label class="checkbox-container">
                <input 
                  type="checkbox"
                  :checked="location.status === 'done'"
                  @change="toggleStatus(location)"
                  class="status-checkbox"
                >
                <span class="checkmark">
                  <svg v-if="location.status === 'done'" 
                       width="12" height="12" viewBox="0 0 24 24" 
                       fill="none" stroke="currentColor" stroke-width="3">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                </span>
                <span class="status-text">
                  {{ location.status === 'done' ? 'Done' : 'Pending' }}
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 진행률 표시 -->
    <div class="progress-section">
      <div class="progress-info">
        <span class="progress-text">
          완료: {{ completedCount }} / {{ totalCount }} 
          ({{ progressPercentage }}%)
        </span>
      </div>
      <div class="progress-bar">
        <div 
          class="progress-fill" 
          :style="{ width: progressPercentage + '%' }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Props 타입 정의
interface PatrolLocation {
  id: string
  name: string
  time: string
  status: 'pending' | 'done'
  latitude: number
  longitude: number
}

// Props 정의
interface Props {
  patrolData: PatrolLocation[]
}

// Emits 정의
interface Emits {
  (e: 'update-status', locationId: string, newStatus: 'pending' | 'done'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 완료된 항목 수 계산
const completedCount = computed(() => {
  return props.patrolData.filter(location => location.status === 'done').length
})

// 전체 항목 수
const totalCount = computed(() => {
  return props.patrolData.length
})

// 진행률 퍼센테지 계산
const progressPercentage = computed(() => {
  if (totalCount.value === 0) return 0
  return Math.round((completedCount.value / totalCount.value) * 100)
})

// 상태 토글 함수
const toggleStatus = (location: PatrolLocation) => {
  const newStatus = location.status === 'done' ? 'pending' : 'done'
  
  // 부모 컴포넌트에 상태 변경 이벤트 발생
  emit('update-status', location.id, newStatus)
  
  // 사용자 피드백
  console.log(`${location.name} 상태 변경: ${location.status} → ${newStatus}`)
}

// 위치별 순찰 완료 시간 업데이트 (실제로는 서버에서 처리)
const updateCompletionTime = (location: PatrolLocation) => {
  if (location.status === 'done' && !location.time) {
    const now = new Date()
    const timeString = now.toTimeString().substring(0, 5) // HH:MM 형식
    // 이 부분은 실제로는 서버 API 호출로 처리
    console.log(`${location.name} 완료 시간: ${timeString}`)
  }
}
</script>

<style scoped>
.patrol-schedule {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* 테이블 헤더 */
.table-header {
  display: grid;
  grid-template-columns: 1fr 1fr;
  background: #4a90e2;
  color: white;
  font-weight: bold;
  font-size: 14px;
}

.header-cell {
  padding: 15px;
  text-align: center;
  border-right: 1px solid rgba(255, 255, 255, 0.2);
}

.header-cell:last-child {
  border-right: none;
}

/* 테이블 바디 */
.table-body {
  flex: 1;
  overflow-y: auto;
}

.table-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  border-bottom: 1px solid #e0e0e0;
  transition: background-color 0.2s ease;
}

.table-row:hover {
  background-color: #f8f9fa;
}

.table-row.completed {
  background-color: #f0f9ff;
}

.table-cell {
  padding: 12px 15px;
  border-right: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
}

.table-cell:last-child {
  border-right: none;
}

/* 위치 컬럼 */
.location-cell {
  justify-content: center;
}

.location-name {
  font-weight: 500;
  color: #2c3e50;
}

/* 시간 컬럼 */
.time-cell {
  justify-content: center;
}

.time-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.patrol-time {
  font-weight: bold;
  color: #34495e;
  font-size: 16px;
}

/* 체크박스 스타일 */
.checkbox-container {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
}

.status-checkbox {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.checkmark {
  width: 20px;
  height: 20px;
  border: 2px solid #ddd;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  background: white;
}

.status-checkbox:checked + .checkmark {
  background: #27ae60;
  border-color: #27ae60;
  color: white;
}

.status-checkbox:not(:checked) + .checkmark {
  background: #f8f9fa;
  border-color: #ddd;
}

.status-text {
  font-size: 12px;
  font-weight: 500;
  color: #666;
  min-width: 50px;
}

.status-checkbox:checked ~ .status-text {
  color: #27ae60;
}

/* 진행률 섹션 */
.progress-section {
  padding: 15px;
  background: #f8f9fa;
  border-top: 1px solid #e0e0e0;
}

.progress-info {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
}

.progress-text {
  font-size: 14px;
  font-weight: 500;
  color: #34495e;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #27ae60, #2ecc71);
  border-radius: 4px;
  transition: width 0.3s ease;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .table-header,
  .table-row {
    grid-template-columns: 1fr;
  }
  
  .header-cell,
  .table-cell {
    border-right: none;
    border-bottom: 1px solid #e0e0e0;
  }
  
  .time-header {
    border-top: 1px solid rgba(255, 255, 255, 0.2);
  }
  
  .time-content {
    flex-direction: row;
    justify-content: space-between;
  }
}
</style>