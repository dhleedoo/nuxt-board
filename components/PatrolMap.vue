<template>
  <div class="patrol-map-container">
    <!-- 지도 영역 -->
    <div 
      id="patrol-map" 
      ref="mapContainer" 
      class="patrol-map"
    ></div>
    
    <!-- 지도 컨트롤 패널 -->
    <div class="map-controls">
      <div class="control-group">
        <button 
          @click="resetView" 
          class="control-btn"
          title="기본 위치로 돌아가기"
        >
          🎯 기본 위치
        </button>
        <button 
          @click="togglePatrolRoute" 
          class="control-btn"
          :class="{ 'active': showPatrolRoute }"
          title="순찰 경로 표시/숨김"
        >
          🛣️ 순찰 경로
        </button>
        <button 
          @click="toggleLocationTracking" 
          class="control-btn"
          :class="{ 'active': isTrackingLocation, 'error': locationError }"
          title="내 위치 추적"
        >
          {{ isTrackingLocation ? '📍 추적중' : '📱 내 위치' }}
        </button>
        <button 
          v-if="userLocation"
          @click="moveToUserLocation" 
          class="control-btn user-location-btn"
          title="내 위치로 지도 이동"
        >
          🎯 내 위치로
        </button>
      </div>
      
      <!-- 범례 -->
      <div class="map-legend">
        <div class="legend-item">
          <span class="legend-marker pending"></span>
          <span class="legend-text">대기 중</span>
        </div>
        <div class="legend-item">
          <span class="legend-marker completed"></span>
          <span class="legend-text">완료</span>
        </div>
        <div class="legend-item">
          <span class="legend-marker user-location"></span>
          <span class="legend-text">내 위치</span>
        </div>
      </div>
      
      <!-- 위치 정보 표시 -->
      <div v-if="userLocation" class="location-info">
        <div class="location-coords">
          <small>위도: {{ userLocation.latitude.toFixed(6) }}</small>
          <small>경도: {{ userLocation.longitude.toFixed(6) }}</small>
          <small v-if="userLocation.accuracy" 
                :class="{ 'low-accuracy': userLocation.accuracy > 100 }">
            정확도: {{ Math.round(userLocation.accuracy) }}m
          </small>
        </div>
      </div>
      
      <!-- 위치 오류 표시 -->
      <div v-if="locationError" class="location-error">
        <small>{{ locationError }}</small>
      </div>
      
      <!-- 위치 정확도 개선 가이드 -->
      <div v-if="userLocation && userLocation.accuracy && userLocation.accuracy > 100" class="accuracy-guide">
        <div class="guide-header">
          <span>🛰️ 위치 정확도 개선</span>
        </div>
        <div class="guide-tips">
          <small>• 실외로 이동해보세요</small>
          <small>• 하늘이 열린 곳에서 시도</small>
          <small>• 잠시 기다려주세요</small>
          <button @click="retryHighAccuracy" class="retry-btn">
            🔄 재시도
          </button>
        </div>
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

interface Props {
  patrolData: PatrolLocation[]
}

const props = defineProps<Props>()

// 반응형 데이터
const mapContainer = ref<HTMLElement>()
let map: any = null
const markers: any[] = []
let patrolRoute: any = null
const showPatrolRoute = ref(true)
let leafletLib: any = null

// 사용자 위치 관련 변수
let userLocationMarker: any = null
const userLocation = ref<{latitude: number, longitude: number, accuracy?: number} | null>(null)
const isTrackingLocation = ref(false)
const locationError = ref<string | null>(null)
let watchId: number | null = null

// 기본 지도 중심 (서울 시청 기준)
const defaultCenter: [number, number] = [37.5665, 126.9780]
const defaultZoom = 15

// Leaflet 라이브러리 로드
const loadLeaflet = async (): Promise<any> => {
  if (leafletLib) return leafletLib
  
  if (!process.client) return null

  try {
    // CSS 먼저 로드
    await import('leaflet/dist/leaflet.css')
    
    // Leaflet 라이브러리 로드
    const leafletModule = await import('leaflet')
    
    console.log('📦 Leaflet 모듈 구조:', leafletModule)
    console.log('📦 Keys:', Object.keys(leafletModule))
    
    // 다양한 방법으로 Leaflet 객체 찾기
    leafletLib = leafletModule.default || leafletModule.L || leafletModule || (window as any).L
    
    console.log('🗺️ Leaflet 객체:', leafletLib)
    console.log('🗺️ Map 함수 존재:', typeof leafletLib?.map)
    
    if (leafletLib && Object.keys(leafletLib).length > 0) {
      console.log('🔍 Leaflet 객체의 키들:', Object.keys(leafletLib))
    }
    
    if (!leafletLib || typeof leafletLib.map !== 'function') {
      // 전역 L 객체 확인
      if ((window as any).L && typeof (window as any).L.map === 'function') {
        leafletLib = (window as any).L
        console.log('🌐 전역 L 객체 사용')
      } else {
        throw new Error('Leaflet 모듈이 올바르게 로드되지 않았습니다')
      }
    }
    
    return leafletLib
  } catch (error) {
    console.error('❌ Leaflet 로드 실패:', error)
    return null
  }
}

// 지도 초기화
const initializeMap = async () => {
  if (!mapContainer.value || !process.client) return

  try {
    const L = await loadLeaflet()
    if (!L) {
      console.error('Leaflet 라이브러리를 로드할 수 없습니다')
      return
    }

    console.log('🚀 지도 초기화 시작...')

    // Leaflet 지도 생성
    map = L.map(mapContainer.value, {
      center: defaultCenter,
      zoom: defaultZoom,
      zoomControl: true,
      attributionControl: true
    })

    // OpenStreetMap 타일 레이어 추가
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(map)

    // 순찰 지점 마커 추가
    await addPatrolMarkers()
    
    // 순찰 경로 추가
    await addPatrolRoute()

    console.log('✅ 지도 초기화 완료!')
  } catch (error) {
    console.error('❌ 지도 초기화 실패:', error)
  }
}

// 순찰 지점 마커 추가
const addPatrolMarkers = async () => {
  if (!map || !process.client) return

  try {
    const L = await loadLeaflet()
    if (!L) return

    // 기존 마커 제거
    markers.forEach(marker => map?.removeLayer(marker))
    markers.length = 0

    props.patrolData.forEach((location, index) => {
      // 마커 아이콘 설정 (상태에 따라 다른 색상)
      const markerIcon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div class="marker-pin ${location.status}">
            <span class="marker-number">${index + 1}</span>
          </div>
        `,
        iconSize: [30, 40],
        iconAnchor: [15, 40],
        popupAnchor: [0, -40]
      })

      // 마커 생성
      const marker = L.marker([location.latitude, location.longitude], {
        icon: markerIcon
      }).addTo(map!)

      // 팝업 내용 설정
      const popupContent = `
        <div class="marker-popup">
          <h4>${location.name}</h4>
          <p><strong>시간:</strong> ${location.time || '미정'}</p>
          <p><strong>상태:</strong> 
            <span class="status-badge ${location.status}">
              ${location.status === 'done' ? '완료' : '대기 중'}
            </span>
          </p>
        </div>
      `
      
      marker.bindPopup(popupContent)
      markers.push(marker)
    })

    console.log(`📍 마커 ${markers.length}개 추가 완료`)
  } catch (error) {
    console.error('❌ 마커 추가 실패:', error)
  }
}

// 순찰 경로 추가
const addPatrolRoute = async () => {
  if (!map || !process.client || props.patrolData.length < 2) return

  try {
    const L = await loadLeaflet()
    if (!L) return

    // 기존 경로 제거
    if (patrolRoute) {
      map.removeLayer(patrolRoute)
    }

    // 순찰 지점들의 좌표 배열 생성
    const routePoints: [number, number][] = props.patrolData.map(location => [
      location.latitude,
      location.longitude
    ])

    // 폴리라인으로 경로 표시
    patrolRoute = L.polyline(routePoints, {
      color: '#ff6b35',
      weight: 3,
      opacity: 0.8,
      dashArray: '10, 5'
    }).addTo(map)

    // 경로 영역에 맞게 지도 뷰 조정
    const group = new L.FeatureGroup([patrolRoute, ...markers])
    map.fitBounds(group.getBounds().pad(0.1))

    console.log('🛣️ 순찰 경로 추가 완료')
  } catch (error) {
    console.error('❌ 경로 추가 실패:', error)
  }
}

// 기본 위치로 리셋
const resetView = async () => {
  if (!map || !process.client) return
  
  try {
    const L = await loadLeaflet()
    if (!L) return
    
    if (markers.length > 0) {
      // 모든 마커가 보이도록 뷰 조정
      const group = new L.FeatureGroup(markers)
      map.fitBounds(group.getBounds().pad(0.1))
    } else {
      // 기본 위치로 이동
      map.setView(defaultCenter, defaultZoom)
    }
  } catch (error) {
    console.error('❌ 뷰 리셋 실패:', error)
  }
}

// 순찰 경로 표시/숨김 토글
const togglePatrolRoute = () => {
  if (!map || !patrolRoute) return
  
  showPatrolRoute.value = !showPatrolRoute.value
  
  if (showPatrolRoute.value) {
    map.addLayer(patrolRoute)
  } else {
    map.removeLayer(patrolRoute)
  }
}

// 사용자 위치 추적 토글
const toggleLocationTracking = () => {
  if (isTrackingLocation.value) {
    stopLocationTracking()
  } else {
    startLocationTracking()
  }
}

// 사용자 위치 추적 시작
const startLocationTracking = () => {
  if (!navigator.geolocation) {
    locationError.value = '위치 서비스를 지원하지 않는 브라우저입니다'
    return
  }

  locationError.value = null
  isTrackingLocation.value = true

  // 먼저 한 번 현재 위치를 빠르게 가져오기 (WiFi/Network 기반)
  navigator.geolocation.getCurrentPosition(
    (position) => {
      console.log('🚀 빠른 위치 확인 (WiFi/네트워크):', position.coords.accuracy + 'm')
    },
    (error) => {
      console.log('❌ 빠른 위치 확인 실패:', error.message)
    },
    { enableHighAccuracy: false, timeout: 5000, maximumAge: 300000 }
  )

  // 위치 권한 요청 및 실시간 추적 (GPS 우선)
  watchId = navigator.geolocation.watchPosition(
    // 성공 콜백
    (position) => {
      const coords = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy
      }
      
      // 위치 정확도 확인 및 로그
      console.log('📍 위치 정확도:', coords.accuracy + 'm')
      if (coords.accuracy > 100) {
        console.warn('⚠️ 위치 정확도가 낮습니다 (' + coords.accuracy + 'm). GPS 신호를 확인해주세요.')
      }
      
      const isFirstLocation = !userLocation.value
      userLocation.value = coords
      updateUserLocationMarker(coords)
      
      // 처음 위치를 찾았을 때 자동으로 그 위치로 이동
      if (isFirstLocation) {
        setTimeout(() => {
          moveToUserLocation()
        }, 500) // 마커가 생성된 후 이동
      }
      
      console.log('📍 사용자 위치 업데이트:', coords)
    },
    // 오류 콜백
    (error) => {
      let errorMessage = '위치를 가져올 수 없습니다'
      
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = '위치 권한이 거부되었습니다'
          break
        case error.POSITION_UNAVAILABLE:
          errorMessage = '위치 정보를 사용할 수 없습니다'
          break
        case error.TIMEOUT:
          errorMessage = '위치 요청 시간이 초과되었습니다'
          break
      }
      
      locationError.value = errorMessage
      isTrackingLocation.value = false
      console.error('❌ 위치 추적 오류:', error)
    },
    // 옵션 (더 정확한 위치를 위한 설정)
    {
      enableHighAccuracy: true, // GPS 사용 (더 정확하지만 배터리 소모)
      timeout: 15000, // 15초 타임아웃 (GPS 신호 대기 시간 증가)
      maximumAge: 0 // 캐시 사용 안함 (항상 최신 위치 요청)
    }
  )
}

// 사용자 위치 추적 중지
const stopLocationTracking = () => {
  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId)
    watchId = null
  }
  
  isTrackingLocation.value = false
  locationError.value = null
  
  // 사용자 위치 마커 제거
  if (userLocationMarker && map) {
    map.removeLayer(userLocationMarker)
    userLocationMarker = null
  }
  
  userLocation.value = null
  console.log('🔴 위치 추적 중지')
}

// 사용자 위치 마커 업데이트
const updateUserLocationMarker = async (coords: {latitude: number, longitude: number}) => {
  if (!map || !process.client) return

  try {
    const L = await loadLeaflet()
    if (!L) return

    // 기존 사용자 위치 마커 제거
    if (userLocationMarker) {
      map.removeLayer(userLocationMarker)
    }

    // 사용자 위치 마커 아이콘 생성
    const userIcon = L.divIcon({
      className: 'user-location-marker',
      html: `
        <div class="user-location-pin">
          <div class="user-location-pulse"></div>
          <div class="user-location-dot">👤</div>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
      popupAnchor: [0, -20]
    })

    // 사용자 위치 마커 생성
    userLocationMarker = L.marker([coords.latitude, coords.longitude], {
      icon: userIcon
    }).addTo(map)

    // 팝업 추가 (정확도 정보 포함)
    const accuracyText = coords.accuracy ? 
      `<p><strong>정확도:</strong> ${Math.round(coords.accuracy)}m ${coords.accuracy > 100 ? '⚠️' : '✅'}</p>` : ''
    
    const popupContent = `
      <div class="user-location-popup">
        <h4>👤 내 현재 위치</h4>
        <p><strong>위도:</strong> ${coords.latitude.toFixed(6)}</p>
        <p><strong>경도:</strong> ${coords.longitude.toFixed(6)}</p>
        ${accuracyText}
        <p><small>실시간 추적 중...</small></p>
      </div>
    `
    
    userLocationMarker.bindPopup(popupContent)

    console.log('📍 사용자 위치 마커 업데이트 완료')
  } catch (error) {
    console.error('❌ 사용자 위치 마커 업데이트 실패:', error)
  }
}

// 내 위치로 지도 이동
const moveToUserLocation = () => {
  if (!map || !userLocation.value) return
  
  // 부드러운 애니메이션으로 이동
  map.flyTo([userLocation.value.latitude, userLocation.value.longitude], 17, {
    animate: true,
    duration: 1.5 // 1.5초 애니메이션
  })
  
  // 사용자 위치 마커 팝업 자동 열기
  if (userLocationMarker) {
    setTimeout(() => {
      userLocationMarker.openPopup()
    }, 1500) // 애니메이션 완료 후 팝업 열기
  }
  
  console.log('🎯 내 위치로 지도 이동 (애니메이션)')
}

// 고정밀도 위치 재시도
const retryHighAccuracy = () => {
  console.log('🔄 고정밀도 위치 재시도 시작...')
  
  // 현재 추적 중지
  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId)
  }
  
  // 새로운 고정밀도 요청
  watchId = navigator.geolocation.watchPosition(
    (position) => {
      const coords = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy
      }
      
      console.log('🔄 재시도 결과 - 위치 정확도:', coords.accuracy + 'm')
      
      if (coords.accuracy <= 100) {
        console.log('✅ 위치 정확도 개선됨!')
      } else {
        console.log('⚠️ 여전히 정확도가 낮습니다. 위치를 변경해보세요.')
      }
      
      userLocation.value = coords
      updateUserLocationMarker(coords)
    },
    (error) => {
      console.error('❌ 재시도 실패:', error)
      locationError.value = '고정밀도 위치를 가져올 수 없습니다'
    },
    {
      enableHighAccuracy: true,
      timeout: 20000, // 20초로 증가
      maximumAge: 0
    }
  )
}

// 순찰 데이터가 변경될 때 마커 업데이트
watch(() => props.patrolData, async () => {
  if (map && process.client) {
    try {
      await addPatrolMarkers()
      await addPatrolRoute()
    } catch (error) {
      console.error('❌ 데이터 업데이트 실패:', error)
    }
  }
}, { deep: true })

// 컴포넌트 마운트 시 지도 초기화
onMounted(() => {
  nextTick(() => {
    setTimeout(() => {
      initializeMap()
    }, 100) // 약간의 지연 시간 추가
  })
})

// 컴포넌트 언마운트 시 지도 정리
onUnmounted(() => {
  // 위치 추적 중지
  stopLocationTracking()
  
  // 지도 정리
  if (map) {
    map.remove()
    map = null
  }
  leafletLib = null
})
</script>

<style scoped>
.patrol-map-container {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.patrol-map {
  width: 100%;
  height: 100%;
  min-height: 500px;
}

/* 지도 컨트롤 패널 */
.map-controls {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.control-btn {
  background: white;
  border: 2px solid #ddd;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  white-space: nowrap;
}

.control-btn:hover {
  background: #f0f9ff;
  border-color: #4a90e2;
  transform: translateY(-1px);
}

.control-btn.active {
  background: #4a90e2;
  color: white;
  border-color: #4a90e2;
}

/* 범례 */
.map-legend {
  background: white;
  border-radius: 6px;
  padding: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 2px solid #ddd;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 5px;
}

.legend-item:last-child {
  margin-bottom: 0;
}

.legend-marker {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.legend-marker.pending {
  background: #e74c3c;
}

.legend-marker.completed {
  background: #27ae60;
}

.legend-marker.user-location {
  background: #3498db;
  border-color: #2980b9;
}

.legend-text {
  font-size: 11px;
  font-weight: 500;
  color: #333;
}

/* 위치 정보 및 오류 표시 */
.location-info {
  background: rgba(52, 152, 219, 0.9);
  color: white;
  border-radius: 6px;
  padding: 8px;
  font-size: 11px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.location-coords {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.low-accuracy {
  color: #f39c12 !important;
  font-weight: bold;
}

.location-error {
  background: rgba(231, 76, 60, 0.9);
  color: white;
  border-radius: 6px;
  padding: 8px;
  font-size: 11px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.control-btn.error {
  border-color: #e74c3c;
  color: #e74c3c;
}

.user-location-btn {
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
  border-color: #2980b9;
  font-weight: 600;
}

.user-location-btn:hover {
  background: linear-gradient(135deg, #2980b9, #21618c);
  border-color: #21618c;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(52, 152, 219, 0.3);
}

/* 위치 정확도 개선 가이드 */
.accuracy-guide {
  background: rgba(243, 156, 18, 0.95);
  color: white;
  border-radius: 6px;
  padding: 10px;
  font-size: 11px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 2px solid #e67e22;
}

.guide-header {
  font-weight: bold;
  margin-bottom: 8px;
  text-align: center;
}

.guide-tips {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.retry-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 10px;
  cursor: pointer;
  margin-top: 6px;
  transition: all 0.2s ease;
}

.retry-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .map-controls {
    top: 5px;
    right: 5px;
  }
  
  .control-btn {
    padding: 6px 8px;
    font-size: 11px;
  }
  
  .map-legend {
    padding: 8px;
  }
}
</style>

<!-- 전역 스타일 (마커 커스텀) -->
<style>
.custom-marker {
  background: transparent;
  border: none;
}

.marker-pin {
  width: 30px;
  height: 40px;
  border-radius: 50% 50% 50% 0;
  position: relative;
  transform: rotate(-45deg);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.marker-pin.pending {
  background: #e74c3c;
}

.marker-pin.done {
  background: #27ae60;
}

.marker-number {
  color: white;
  font-weight: bold;
  font-size: 12px;
  transform: rotate(45deg);
}

.marker-popup {
  min-width: 150px;
  text-align: center;
}

.marker-popup h4 {
  margin: 0 0 8px 0;
  color: #2c3e50;
  font-size: 14px;
}

.marker-popup p {
  margin: 4px 0;
  font-size: 12px;
  color: #666;
}

.status-badge {
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 10px;
  font-weight: bold;
  color: white;
}

.status-badge.pending {
  background: #e74c3c;
}

.status-badge.done {
  background: #27ae60;
}

/* 사용자 위치 마커 스타일 */
.user-location-marker {
  background: transparent;
  border: none;
}

.user-location-pin {
  position: relative;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-location-pulse {
  position: absolute;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(52, 152, 219, 0.3);
  border: 2px solid #3498db;
  animation: pulse 2s ease-in-out infinite;
}

.user-location-dot {
  position: relative;
  width: 20px;
  height: 20px;
  background: #3498db;
  border: 3px solid white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  z-index: 1;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.3);
    opacity: 0.5;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.user-location-popup {
  min-width: 180px;
  text-align: center;
}

.user-location-popup h4 {
  margin: 0 0 8px 0;
  color: #3498db;
  font-size: 14px;
}

.user-location-popup p {
  margin: 4px 0;
  font-size: 12px;
  color: #666;
}
</style>