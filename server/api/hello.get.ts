// 첫 번째 API 엔드포인트 - GET /api/hello
export default defineEventHandler(async (event) => {
  // 현재 시간 가져오기
  const currentTime = new Date().toLocaleString('ko-KR', {
    timeZone: 'Asia/Seoul'
  })
  
  // API 응답 데이터
  return {
    success: true,
    message: "🎉 첫 번째 Nitro API 성공!",
    timestamp: currentTime,
    info: {
      endpoint: "/api/hello",
      method: "GET",
      description: "별도 Express 서버 없이 Nuxt Nitro로 API 구현"
    },
    phase: {
      current: "Phase 3: 서버 API 구축",
      achievement: "파일 기반 API 라우팅 체험"
    }
  }
})