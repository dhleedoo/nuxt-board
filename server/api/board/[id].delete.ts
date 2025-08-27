// 게시글 삭제 API - DELETE /api/board/[id]
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

    const postId = Number(id)

    // 게시글 존재 확인 및 정보 조회
    const checkQuery = `
      SELECT 
        BOARD_ID,
        TITLE,
        TO_CHAR(CREATED_AT, 'YYYY-MM-DD HH24:MI:SS') as CREATED_AT
      FROM BOARD 
      WHERE BOARD_ID = :id
    `
    
    const checkResult = await executeQuery(checkQuery, { id: postId })
    
    if (!checkResult.rows || checkResult.rows.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: `게시글 ID ${id}를 찾을 수 없습니다.`
      })
    }

    const postInfo = checkResult.rows[0]

    // 게시글 삭제
    const deleteQuery = `
      DELETE FROM BOARD 
      WHERE BOARD_ID = :postId
    `
    
    const result = await executeQuery(deleteQuery, { postId })
    
    if (result.rowsAffected && result.rowsAffected > 0) {
      // 게시글 삭제 성공
    } else {
              // 삭제할 게시글이 없음
    }

    return {
      success: true,
      message: "게시글 삭제 성공",
      data: {
        deletedPost: postInfo,
        deleted: true
      },
      meta: {
        endpoint: `/api/board/${id}`,
        method: "DELETE",
        source: "Oracle Database",
        rowsAffected: result.rowsAffected,
        timestamp: new Date().toLocaleString('ko-KR', {
          timeZone: 'Asia/Seoul'
        })
      }
    }
  } catch (error: any) {
    console.error('게시글 삭제 실패:', error)
    
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