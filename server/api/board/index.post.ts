// 게시글 작성 API - POST /api/board (Oracle DB 연동)
import { executeQuery } from '~/server/utils/database'

export default defineEventHandler(async (event) => {
  try {
    // 요청 본문 파싱
    const body = await readBody(event)
    const { title, content } = body
    
    // 입력 값 검증
    if (!title || !content) {
      throw createError({
        statusCode: 400,
        statusMessage: '제목과 내용을 모두 입력해주세요.'
      })
    }
    
    if (title.trim().length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: '제목을 입력해주세요.'
      })
    }
    
    if (content.trim().length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: '내용을 입력해주세요.'
      })
    }
    
    if (title.length > 100) {
      throw createError({
        statusCode: 400,
        statusMessage: '제목은 100자 이내로 입력해주세요.'
      })
    }
    
    if (content.length > 2000) {
      throw createError({
        statusCode: 400,
        statusMessage: '내용은 2000자 이내로 입력해주세요.'
      })
    }
    
    // 게시글 삽입 쿼리 (BOARD_ID는 자동 생성이므로 제외)
    const insertQuery = `
      INSERT INTO BOARD (
        TITLE, 
        CONTENT, 
        CREATED_AT, 
        UPDATED_AT
      ) VALUES (
        :title,
        :content,
        SYSDATE,
        SYSDATE
      )
    `
    
    const insertResult = await executeQuery(insertQuery, {
      title: title.trim(),
      content: content.trim()
    })
    
    // 방금 생성된 게시글 조회 (최신 게시글)
    const selectQuery = `
      SELECT 
        BOARD_ID,
        TITLE,
        CONTENT,
        TO_CHAR(CREATED_AT, 'YYYY-MM-DD HH24:MI:SS') as CREATED_AT,
        TO_CHAR(UPDATED_AT, 'YYYY-MM-DD HH24:MI:SS') as UPDATED_AT
      FROM BOARD 
      ORDER BY BOARD_ID DESC
      FETCH FIRST 1 ROWS ONLY
    `
    
    const selectResult = await executeQuery(selectQuery)
    const createdPost = selectResult.rows?.[0]
    
    // 성공 응답
    return {
      success: true,
      message: "게시글이 성공적으로 작성되었습니다.",
      data: {
        BOARD_ID: Number(createdPost.BOARD_ID) || 0,
        TITLE: String(createdPost.TITLE || ''),
        CONTENT: String(createdPost.CONTENT || ''),
        CREATED_AT: String(createdPost.CREATED_AT || ''),
        UPDATED_AT: String(createdPost.UPDATED_AT || '')
      },
      meta: {
        endpoint: "/api/board",
        method: "POST",
        source: "Oracle Database",
        rowsAffected: insertResult.rowsAffected,
        timestamp: new Date().toLocaleString('ko-KR', {
          timeZone: 'Asia/Seoul'
        })
      }
    }
  } catch (error: any) {
    console.error('게시글 작성 실패:', error)
    
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