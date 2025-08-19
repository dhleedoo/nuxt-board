// 게시글 상세 조회 API - GET /api/board/[id] (Oracle DB 연동)
import { executeQuery } from '~/server/utils/database'

export default defineEventHandler(async (event) => {
  try {
    // URL에서 ID 파라미터 추출
    const id = getRouterParam(event, 'id')
    
    if (!id || isNaN(Number(id))) {
      throw createError({
        statusCode: 400,
        statusMessage: '유효하지 않은 게시글 ID입니다.'
      })
    }

    // 게시글 조회 쿼리 (EXCEL_DATA 제외, 안전한 컬럼만)
    const selectQuery = `
      SELECT 
        BOARD_ID,
        TITLE,
        CONTENT,
        TO_CHAR(CREATED_AT, 'YYYY-MM-DD HH24:MI:SS') as CREATED_AT,
        TO_CHAR(UPDATED_AT, 'YYYY-MM-DD HH24:MI:SS') as UPDATED_AT
      FROM BOARD 
      WHERE BOARD_ID = :id
    `
    
    const result = await executeQuery(selectQuery, { id: Number(id) })
    
    if (!result.rows || result.rows.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: `게시글 ID ${id}를 찾을 수 없습니다.`
      })
    }

    const post = result.rows[0]

    // 기존 테이블에는 VIEWS 컬럼이 없으므로 조회수 증가 기능 제거
    // 필요시 VIEWS 컬럼을 추가하거나 별도 테이블로 관리 가능

    return {
      success: true,
      message: "게시글 조회 성공 (Oracle DB)", 
      data: post,
      meta: {
        endpoint: `/api/board/${id}`,
        method: "GET",
        source: "Oracle Database",
        timestamp: new Date().toLocaleString('ko-KR', {
          timeZone: 'Asia/Seoul'
        })
      }
    }
  } catch (error: any) {
    console.error('게시글 상세 조회 실패:', error)
    
    // 이미 createError로 생성된 에러는 그대로 전파
    if (error.statusCode) {
      throw error
    }
    
    // 그 외 데이터베이스 오류
    throw createError({
      statusCode: 500,
      statusMessage: `데이터베이스 오류: ${error.message || error}`
    })
  }
})