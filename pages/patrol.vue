<template>
  <div class="patrol-container">
    <!-- 헤더 섹션 -->
    <div class="patrol-header">
      <h1 class="patrol-title">3.3.9 시스템 기능상세 - Patrol 업무관리</h1>
      <p class="patrol-description">
        Map을 서버에 저장하여 순찰경로 및 위치를 표시하고 순찰위치 일정 반영 내역에서 순찰 기록을 남김 수 있도록 함
      </p>
    </div>

    <!-- 메인 컨텐츠 영역 -->
    <div class="patrol-main">
      <!-- 지도 영역 -->
      <div class="map-section">
        <ClientOnly>
          <PatrolMap :patrol-data="patrolData" />
          <template #fallback>
            <div class="map-loading">
              <div class="loading-content">
                <div class="loading-spinner"></div>
                <p>지도를 로딩 중입니다...</p>
              </div>
            </div>
          </template>
        </ClientOnly>
      </div>

      <!-- 순찰 일정 테이블 영역 -->
      <div class="schedule-section">
        <PatrolScheduleTable 
          :patrol-data="patrolData" 
          @update-status="handleStatusUpdate"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Nuxt 4 Composition API 스타일
interface PatrolLocation {
  id: string
  name: string
  time: string
  status: 'pending' | 'done'
  latitude: number
  longitude: number
}

// 순찰 데이터 (실제로는 API에서 가져올 예정)
const patrolData = ref<PatrolLocation[]>([
  {
    id: '1',
    name: 'CCR1 Location1',
    time: '00:00',
    status: 'pending',
    latitude: 37.5665,
    longitude: 126.9780
  },
  {
    id: '2', 
    name: 'CCR1 Location2',
    time: '03:00',
    status: 'pending',
    latitude: 37.5675,
    longitude: 126.9790
  },
  {
    id: '3',
    name: 'CCR1 Location3', 
    time: '',
    status: 'done',
    latitude: 37.5685,
    longitude: 126.9800
  },
  {
    id: '4',
    name: 'CCR1 Location1',
    time: '',
    status: 'done', 
    latitude: 37.5665,
    longitude: 126.9780
  },
  {
    id: '5',
    name: 'CCR1 Location2',
    time: '',
    status: 'done',
    latitude: 37.5675,
    longitude: 126.9790
  },
  {
    id: '6',
    name: 'CCR1 Location3',
    time: '',
    status: 'done',
    latitude: 37.5685,
    longitude: 126.9800
  }
])

// 순찰 상태 업데이트 핸들러
const handleStatusUpdate = async (locationId: string, newStatus: 'pending' | 'done') => {
  try {
    // API 호출로 상태 업데이트 (추후 구현)
    const response = await $fetch(`/api/patrol/${locationId}`, {
      method: 'PUT',
      body: { status: newStatus }
    })
    
    // 로컬 데이터 업데이트
    const location = patrolData.value.find(item => item.id === locationId)
    if (location) {
      location.status = newStatus
    }
    
    console.log('순찰 상태 업데이트 성공:', response)
  } catch (error) {
    console.error('순찰 상태 업데이트 실패:', error)
  }
}

// 순찰 데이터 실시간 업데이트 감지
watch(patrolData, () => {
  console.log('순찰 데이터 업데이트됨:', patrolData.value)
}, { deep: true })

// SEO 메타 설정
useSeoMeta({
  title: 'Patrol 업무관리 - Nuxt Board',
  description: '순찰 경로 및 일정을 관리하는 시스템'
})
</script>

<style scoped>
.patrol-container {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.patrol-header {
  margin-bottom: 30px;
  text-align: center;
}

.patrol-title {
  font-size: 24px;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 10px;
}

.patrol-description {
  color: #666;
  font-size: 14px;
  line-height: 1.5;
}

.patrol-main {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 20px;
  min-height: 600px;
}

.map-section {
  background: #f8f9fa;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}


.schedule-section {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

/* 지도 로딩 스타일 */
.map-loading {
  width: 100%;
  height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  border-radius: 8px;
}

.loading-content {
  text-align: center;
  color: #1976d2;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e3f2fd;
  border-top: 4px solid #1976d2;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 15px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 반응형 디자인 */
@media (max-width: 1024px) {
  .patrol-main {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .schedule-section {
    order: -1;
  }
}

@media (max-width: 768px) {
  .patrol-container {
    padding: 15px;
  }
  
  .patrol-title {
    font-size: 20px;
  }
  
}
</style>