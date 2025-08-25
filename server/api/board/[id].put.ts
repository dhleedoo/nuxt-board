// 게시글 수정 API - PUT /api/board/[id]
import { executeQuery } from '~/server/utils/database'

export default defineEventHandler(async (event) => {
  try {
    // BOARD 테이블과 EXCEL_DATA 컬럼 존재 확인
    // await ensureBoardTable() // This line is removed as per the edit hint.
    
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
      author: body.author?.trim() || '익명',
      excelData: body.excelData || null
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

    // 게시글 존재 확인
    const checkQuery = `SELECT BOARD_ID FROM BOARD WHERE BOARD_ID = :id`
    const checkResult = await executeQuery(checkQuery, { id: updateData.id })
    
    if (!checkResult.rows || checkResult.rows.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: `게시글 ID ${id}를 찾을 수 없습니다.`
      })
    }

    // Excel 데이터를 JSON 타입으로 직접 저장 (문자열 변환 불필요)
    let excelDataJson = null
    if (updateData.excelData && Array.isArray(updateData.excelData) && updateData.excelData.length > 0) {
      excelDataJson = JSON.stringify(updateData.excelData) // Oracle DB 바인드를 위해 문자열로 변환
    }

    // 게시글 수정 쿼리 (EXCEL_DATA 컬럼 포함)
    const updateQuery = `
      UPDATE BOARD 
      SET 
        TITLE = :title,
        CONTENT = :content,
        EXCEL_DATA = :excelData,
        UPDATED_AT = SYSDATE
      WHERE BOARD_ID = :id
    `
    
    const result = await executeQuery(updateQuery, {
      title: updateData.title,
      content: updateData.content,
      excelData: excelDataJson,
      id: updateData.id
    })

    // 수정된 게시글 조회
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
    const updatedPost = updatedResult.rows?.[0]
    
    // EXCEL_DATA 파싱
    let parsedExcelData = null
    if (updatedPost.EXCEL_DATA) {
      try {
        parsedExcelData = JSON.parse(updatedPost.EXCEL_DATA)
      } catch (parseError) {
        console.warn('⚠️ EXCEL_DATA JSON 파싱 실패:', parseError)
        parsedExcelData = updatedPost.EXCEL_DATA
      }
    }

    return {
      success: true,
      message: "게시글 수정 성공",
      data: {
        ...updatedPost,
        EXCEL_DATA: parsedExcelData
      },
      meta: {
        endpoint: `/api/board/${id}`,
        method: "PUT",
        source: "Oracle Database",
        rowsAffected: result.rowsAffected,
        excelDataSaved: !!excelDataJson,
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