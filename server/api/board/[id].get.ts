// 게시글 상세 조회 API - GET /api/board/[id] (Oracle DB 연동, 성능 최적화)
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

    // 게시글 조회 쿼리 - EXCEL_DATA 포함하여 한 번에 조회 (성능 최적화)
    const selectQuery = `
      SELECT /*+ INDEX(BOARD PK_BOARD) */ 
        BOARD_ID,
        TITLE,
        CONTENT,
        EXCEL_DATA,
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

    // EXCEL_DATA 처리 - JSON 타입이므로 파싱이 필요 없음 (이미 객체 형태)
    let excelData = null
    if (post.EXCEL_DATA) {
      // JSON 타입이므로 파싱이 필요 없음, 하지만 안전성을 위해 확인
      if (typeof post.EXCEL_DATA === 'string') {
        try {
          excelData = JSON.parse(post.EXCEL_DATA)
        } catch (parseError) {
          console.warn('⚠️ EXCEL_DATA JSON 파싱 실패:', parseError)
          excelData = post.EXCEL_DATA
        }
      } else {
        // 이미 객체 형태
        excelData = post.EXCEL_DATA
      }
    }

    return {
      success: true,
      message: "게시글 조회 성공 (Oracle DB)", 
      data: {
        BOARD_ID: Number(post.BOARD_ID) || 0,
        TITLE: String(post.TITLE || ''),
        CONTENT: String(post.CONTENT || ''),
        EXCEL_DATA: excelData,
        CREATED_AT: String(post.CREATED_AT || ''),
        UPDATED_AT: String(post.UPDATED_AT || '')
      },
      meta: {
        endpoint: `/api/board/${id}`,
        method: "GET",
        source: "Oracle Database",
        hasExcelData: excelData !== null,
        performance: "optimized",
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