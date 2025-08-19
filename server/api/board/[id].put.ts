// 게시글 수정 API - PUT /api/board/[id]
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

    // PUT 요청 본문 데이터 파싱
    const body = await readBody(event)
    
    // 필수 필드 검증
    if (!body.title || !body.content) {
      throw createError({
        statusCode: 400,
        statusMessage: '제목과 내용은 필수 항목입니다.'
      })
    }

    // 데이터 정리
    const updateData = {
      id: Number(id),
      title: body.title.trim(),
      content: body.content.trim(),
      author: body.author?.trim() || '익명'
    }

    // 유효성 검사
    if (updateData.title.length > 200) {
      throw createError({
        statusCode: 400,
        statusMessage: '제목은 200자를 초과할 수 없습니다.'
      })
    }

    if (updateData.content.length > 4000) {
      throw createError({
        statusCode: 400,
        statusMessage: '내용은 4000자를 초과할 수 없습니다.'
      })
    }

    // 게시글 존재 확인 (기존 테이블 구조 사용)
    const checkQuery = `SELECT BOARD_ID FROM BOARD WHERE BOARD_ID = :id`
    const checkResult = await executeQuery(checkQuery, { id: updateData.id })
    
    if (!checkResult.rows || checkResult.rows.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: `게시글 ID ${id}를 찾을 수 없습니다.`
      })
    }

    // 게시글 수정 쿼리 (기존 테이블 구조 사용)
    const updateQuery = `
      UPDATE BOARD 
      SET 
        TITLE = :title,
        CONTENT = :content,
        UPDATED_AT = CURRENT_TIMESTAMP
      WHERE BOARD_ID = :id
    `
    
    const result = await executeQuery(updateQuery, {
      title: updateData.title,
      content: updateData.content,
      id: updateData.id
    })

    // 수정된 게시글 조회 (기존 테이블 구조 사용)
    const selectQuery = `
      SELECT 
        BOARD_ID,
        TITLE,
        CONTENT,
        EXCEL_DATA,
        TO_CHAR(CREATED_AT, 'YYYY-MM-DD HH24:MI:SS') as CREATED_AT,
        TO_CHAR(UPDATED_AT, 'YYYY-MM-DD HH24:MI:SS') as UPDATED_AT
      FROM BOARD 
      WHERE BOARD_ID = :id
    `
    
    const updatedResult = await executeQuery(selectQuery, { id: updateData.id })

    return {
      success: true,
      message: "게시글 수정 성공",
      data: updatedResult.rows?.[0],
      meta: {
        endpoint: `/api/board/${id}`,
        method: "PUT",
        source: "Oracle Database",
        rowsAffected: result.rowsAffected,
        timestamp: new Date().toLocaleString('ko-KR', {
          timeZone: 'Asia/Seoul'
        })
      }
    }
  } catch (error: any) {
    console.error('게시글 수정 실패:', error)
    
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