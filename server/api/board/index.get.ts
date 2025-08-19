// 게시판 목록 조회 API - GET /api/board (페이지네이션 지원)
import { executeQuery, ensureBoardTable } from '~/server/utils/database'

export default defineEventHandler(async (event) => {
  try {
    // 게시판 테이블 존재 확인
    await ensureBoardTable()
    
    // 쿼리 파라미터 파싱
    const query = getQuery(event)
    const page = Number(query.page) || 1
    const limit = Number(query.limit) || 10
    const keyword = (query.keyword as string) || ''
    
    // 페이지네이션 계산
    const offset = (page - 1) * limit
    const maxRow = page * limit
    
    // WHERE 조건 설정
    let whereClause = ''
    const bindParams: any = { offset, maxRow }
    
    if (keyword.trim()) {
      whereClause = 'WHERE TITLE LIKE :keyword'
      bindParams.keyword = `%${keyword.trim()}%`
    }
    
    // 페이지네이션 쿼리 (Oracle 방식)
    const listQuery = `
      SELECT * FROM (
        SELECT 
          BOARD_ID, 
          TITLE, 
          CONTENT, 
          TO_CHAR(CREATED_AT, 'YYYY-MM-DD HH24:MI:SS') as CREATED_AT,
          TO_CHAR(UPDATED_AT, 'YYYY-MM-DD HH24:MI:SS') as UPDATED_AT,
          ROW_NUMBER() OVER (ORDER BY BOARD_ID DESC) AS RN
        FROM BOARD
        ${whereClause}
      ) WHERE RN > :offset AND RN <= :maxRow
      ORDER BY BOARD_ID DESC
    `
    
    const result = await executeQuery(listQuery, bindParams)
    
    // 전체 게시글 수 조회
    const countBindParams: any = {}
    if (keyword.trim()) {
      countBindParams.keyword = `%${keyword.trim()}%`
    }
    
    const countQuery = `
      SELECT COUNT(*) AS TOTAL_COUNT FROM BOARD
      ${whereClause}
    `
    
    const countResult = await executeQuery(countQuery, countBindParams)
    const totalCount = Number(countResult.rows?.[0]?.TOTAL_COUNT || 0)
    const totalPages = Math.ceil(totalCount / limit)
    
    // Oracle CLOB 데이터를 안전한 문자열로 변환
    const boardData = (result.rows || []).map((row: any) => ({
      BOARD_ID: Number(row.BOARD_ID) || 0,
      TITLE: String(row.TITLE || '제목 없음'),
      CONTENT: String(row.CONTENT || '내용 없음'),
      CREATED_AT: String(row.CREATED_AT || ''),
      UPDATED_AT: String(row.UPDATED_AT || '')
    }))
    
    // API 응답 (페이지네이션 정보 포함)
    return {
      success: true,
      message: "게시판 목록 조회 성공 (페이지네이션)",
      data: boardData,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      meta: {
        endpoint: "/api/board",
        method: "GET",
        source: "Oracle Database",
        keyword: keyword || null,
        timestamp: new Date().toLocaleString('ko-KR', {
          timeZone: 'Asia/Seoul'
        })
      }
    }
  } catch (error: any) {
    console.error('게시판 목록 조회 실패:', error)
    
    // 에러 응답
    throw createError({
      statusCode: 500,
      statusMessage: `데이터베이스 오류: ${error.message || error}`
    })
  }
})