/**
 * 게시글 작성 API
 * 
 * 엔드포인트: POST /api/board
 * 기능: 새로운 게시글을 생성하고 엑셀 데이터를 포함하여 저장
 * 
 * 요청 데이터:
 * - title: 게시글 제목 (필수, 100자 이내)
 * - content: 게시글 내용 (필수, 2000자 이내)
 * - excelData: 엑셀 형태의 추가 데이터 (선택, 2차원 배열)
 * 
 * 응답: 생성된 게시글 정보 (BOARD_ID 포함)
 * 
 * 데이터베이스: Oracle DB의 BOARD 테이블 사용
 * - EXCEL_DATA 컬럼: JSON 타입으로 엑셀 데이터 저장
 */

import { executeQuery } from '~/server/utils/database'
import oracledb from 'oracledb'

export default defineEventHandler(async (event) => {
  try {
    // ========================================
    // 1. 요청 데이터 파싱 및 검증
    // ========================================
    
    // 요청 본문에서 데이터 추출
    const body = await readBody(event)
    const { title, content, excelData } = body
    
    // ========================================
    // 2. 필수 입력값 검증
    // ========================================
    
    // 제목과 내용 존재 여부 확인
    if (!title || !content) {
      throw createError({
        statusCode: 400,
        statusMessage: '제목과 내용을 모두 입력해주세요.'
      })
    }
    
    // 제목 유효성 검사
    if (title.trim().length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: '제목을 입력해주세요.'
      })
    }
    
    if (title.length > 100) {
      throw createError({
        statusCode: 400,
        statusMessage: '제목은 100자 이내로 입력해주세요.'
      })
    }
    
    // 내용 유효성 검사
    if (content.trim().length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: '내용을 입력해주세요.'
      })
    }
    
    if (content.length > 2000) {
      throw createError({
        statusCode: 400,
        statusMessage: '내용은 2000자 이내로 입력해주세요.'
      })
    }
    
    // ========================================
    // 3. 엑셀 데이터 처리
    // ========================================
    
    // Excel 데이터를 JSON 타입으로 변환하여 저장
    // Oracle DB의 JSON 컬럼에 바인딩하기 위해 문자열로 변환
    let excelDataJson = null
    if (excelData && Array.isArray(excelData) && excelData.length > 0) {
      excelDataJson = JSON.stringify(excelData)
    }
    
    // ========================================
    // 4. 게시글 데이터베이스 저장
    // ========================================
    
    // BOARD 테이블에 새 게시글 삽입 (EXCEL_DATA 컬럼 포함)
    const insertQuery = `
      INSERT INTO BOARD (
        TITLE,           -- 게시글 제목
        CONTENT,         -- 게시글 내용
        EXCEL_DATA,      -- 엑셀 데이터 (JSON)
        CREATED_AT,      -- 생성일시
        UPDATED_AT       -- 수정일시
      ) VALUES (
        :title,          -- 제목 바인드 변수
        :content,        -- 내용 바인드 변수
        :excelData,      -- 엑셀 데이터 바인드 변수
        SYSDATE,         -- 현재 시스템 날짜
        SYSDATE          -- 현재 시스템 날짜
      )
      RETURNING BOARD_ID INTO :boardId  -- 생성된 BOARD_ID 반환
    `
    
    // 쿼리 실행 및 결과 반환
    const insertResult = await executeQuery(insertQuery, {
      title: title.trim(),
      content: content.trim(),
      excelData: excelDataJson,
      boardId: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }  // 출력 바인드 변수
    })
    
    // ========================================
    // 5. 생성된 게시글 ID 추출
    // ========================================
    
    // RETURNING 절에서 반환된 BOARD_ID 추출
    const newBoardId = insertResult.outBinds?.boardId?.[0]
    
    if (!newBoardId) {
      throw new Error('게시글 ID를 가져올 수 없습니다.')
    }
    
    // ========================================
    // 6. 생성된 게시글 정보 조회 및 반환
    // ========================================
    
    // 방금 생성된 게시글의 전체 정보를 조회
    const selectQuery = `
      SELECT 
        BOARD_ID,        -- 게시글 고유 ID
        TITLE,           -- 제목
        CONTENT,         -- 내용
        EXCEL_DATA,      -- 엑셀 데이터 (JSON)
        TO_CHAR(CREATED_AT, 'YYYY-MM-DD HH24:MI:SS') as CREATED_AT,    -- 생성일시 (포맷팅)
        TO_CHAR(UPDATED_AT, 'YYYY-MM-DD HH24:MI:SS') as UPDATED_AT     -- 수정일시 (포맷팅)
      FROM BOARD 
      WHERE BOARD_ID = :boardId
    `
    
    const selectResult = await executeQuery(selectQuery, { boardId: newBoardId })
    const createdPost = selectResult.rows?.[0]
    
    // EXCEL_DATA 파싱
    let parsedExcelData = null
    if (createdPost.EXCEL_DATA) {
      try {
        parsedExcelData = JSON.parse(createdPost.EXCEL_DATA)
      } catch (parseError) {
        console.warn('⚠️ EXCEL_DATA JSON 파싱 실패:', parseError)
        parsedExcelData = createdPost.EXCEL_DATA
      }
    }
    
    // 성공 응답
    return {
      success: true,
      message: "게시글이 성공적으로 작성되었습니다.",
      data: {
        BOARD_ID: Number(createdPost.BOARD_ID) || 0,
        TITLE: String(createdPost.TITLE || ''),
        CONTENT: String(createdPost.CONTENT || ''),
        EXCEL_DATA: parsedExcelData,
        CREATED_AT: String(createdPost.CREATED_AT || ''),
        UPDATED_AT: String(createdPost.UPDATED_AT || '')
      },
      meta: {
        endpoint: "/api/board",
        method: "POST",
        source: "Oracle Database",
        rowsAffected: insertResult.rowsAffected,
        excelDataSaved: !!excelDataJson,
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