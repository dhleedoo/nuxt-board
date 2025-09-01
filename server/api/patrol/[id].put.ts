// 순찰 상태 업데이트 API (임시 구현 - DB 연결 없음)
export default defineEventHandler(async (event) => {
  try {
    const patrolId = getRouterParam(event, 'id')
    const body = await readBody(event)
    
    // 요청 데이터 검증
    if (!patrolId) {
      throw createError({
        statusCode: 400,
        statusMessage: '순찰 ID가 필요합니다'
      })
    }
    
    if (!body.status || !['pending', 'done'].includes(body.status)) {
      throw createError({
        statusCode: 400,
        statusMessage: '올바른 상태값이 필요합니다 (pending, done)'
      })
    }
    
    // 현재 시간 생성 (완료 시간 기록용)
    const completedAt = body.status === 'done' ? new Date().toISOString() : null
    
    // 임시 응답 데이터 (실제로는 DB에서 업데이트된 데이터 반환)
    const updatedPatrol = {
      id: patrolId,
      status: body.status,
      completedAt: completedAt,
      updatedAt: new Date().toISOString()
    }
    
    console.log(`✅ 순찰 상태 업데이트 (임시): ${patrolId} → ${body.status}`)
    
    return {
      success: true,
      message: '순찰 상태가 성공적으로 업데이트되었습니다',
      data: updatedPatrol
    }
    
  } catch (error) {
    console.error('순찰 상태 업데이트 실패:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: '순찰 상태 업데이트 중 오류가 발생했습니다'
    })
  }
})