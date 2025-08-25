/**
 * Oracle Database 연결 및 유틸리티 모듈
 * 
 * 이 모듈은 Oracle Database와의 연결을 관리하고, 
 * 게시판 시스템의 데이터베이스 작업을 지원합니다.
 * 
 * 주요 기능:
 * - 연결 풀 관리 (Connection Pool)
 * - 쿼리 실행 및 결과 처리
 * - 엑셀 데이터 저장/조회 (BOARD 테이블의 EXCEL_DATA 컬럼)
 * - 성능 최적화된 쿼리 실행
 * 
 * 환경 변수:
 * - DB_USER: 데이터베이스 사용자명
 * - DB_PASSWORD: 데이터베이스 비밀번호
 * - DB_CONNECTION_STRING: 데이터베이스 연결 문자열
 */

import oracledb, { type Pool, type Connection, type ExecuteOptions, type Result } from 'oracledb'

// ========================================
// Oracle DB 연결 설정
// ========================================
const dbConfig = {
  user: process.env.DB_USER || 'test',                    // 기본 사용자: test
  password: process.env.DB_PASSWORD || '1111',            // 기본 비밀번호: 1111
  connectString: process.env.DB_CONNECTION_STRING || '192.168.0.118:1521/XE'  // 기본 연결 문자열
}

// ========================================
// 연결 풀 설정 (성능 최적화)
// ========================================
const poolConfig = {
  user: dbConfig.user,
  password: dbConfig.password,
  connectString: dbConfig.connectString,
  poolMin: 1,          // 최소 연결 수 (항상 1개 연결 유지)
  poolMax: 10,         // 최대 연결 수 (동시 요청 처리용)
  poolIncrement: 1,    // 연결 증가 단위 (1개씩 증가)
  poolTimeout: 60      // 유휴 연결 타임아웃 (60초 후 자동 해제)
}

// ========================================
// 전역 연결 풀 변수
// ========================================
let pool: Pool | null = null

/**
 * Oracle DB 연결 풀 초기화
 * 
 * 앱 시작 시 한 번만 호출되어 연결 풀을 생성합니다.
 * 연결 풀은 데이터베이스 연결을 재사용하여 성능을 향상시킵니다.
 * 
 * @returns {Promise<Pool>} 초기화된 연결 풀
 * @throws {Error} 연결 풀 생성 실패 시
 */
export async function initializePool(): Promise<Pool> {
  if (!pool) {
    try {
      console.log('🔗 Oracle DB 연결 풀 생성 중...')
      pool = await oracledb.createPool(poolConfig)
      console.log('✅ Oracle DB 연결 풀 생성 완료!')
      
      // 연결 테스트: 실제 DB 연결이 정상인지 확인
      const connection = await pool.getConnection()
      const result = await connection.execute('SELECT SYSDATE FROM DUAL')
      console.log(`📅 DB 연결 테스트 성공: ${result.rows?.[0]}`)
      await connection.close()
      
    } catch (error) {
      console.error('❌ Oracle DB 연결 풀 생성 실패:', error)
      throw error
    }
  }
  return pool
}

/**
 * DB 연결 가져오기
 * 
 * 연결 풀에서 사용 가능한 연결을 가져옵니다.
 * 연결 풀이 초기화되지 않은 경우 자동으로 초기화합니다.
 * 
 * @returns {Promise<Connection>} 데이터베이스 연결 객체
 * @throws {Error} 연결 풀 초기화 실패 시
 */
export async function getConnection(): Promise<Connection> {
  if (!pool) {
    await initializePool()
  }
  
  if (!pool) {
    throw new Error('DB 연결 풀이 초기화되지 않았습니다.')
  }
  
  return await pool.getConnection()
}

/**
 * 연결 풀 종료 (앱 종료 시 호출)
 * 
 * 모든 데이터베이스 연결을 안전하게 종료합니다.
 * 10초 대기 후 강제 종료하여 정리 작업을 완료합니다.
 */
export async function closePool(): Promise<void> {
  if (pool) {
    try {
      await pool.close(10) // 10초 대기 후 강제 종료
      pool = null
      console.log('🔚 Oracle DB 연결 풀 종료 완료')
    } catch (error) {
      console.error('❌ 연결 풀 종료 실패:', error)
    }
  }
}

/**
 * 안전한 쿼리 실행 헬퍼 함수 (성능 최적화)
 * 
 * 모든 데이터베이스 쿼리 실행에 사용되는 표준 함수입니다.
 * 연결 관리, 오류 처리, 성능 최적화를 자동으로 처리합니다.
 * 
 * @param query SQL 쿼리 문자열
 * @param binds 바인드 변수 객체 (SQL Injection 방지)
 * @param options 실행 옵션 (기본값 사용 권장)
 * @returns {Promise<Result<any>>} 쿼리 실행 결과
 */
export async function executeQuery(
  query: string, 
  binds: any = {}, 
  options: ExecuteOptions = {}
): Promise<Result<any>> {
  const connection = await getConnection()
  
  try {
    // ========================================
    // 성능 최적화된 기본 옵션 설정
    // ========================================
    const defaultOptions: ExecuteOptions = {
      outFormat: oracledb.OUT_FORMAT_OBJECT, // 객체 형태로 결과 반환
      autoCommit: true,                       // 자동 커밋 (INSERT/UPDATE/DELETE)
      fetchArraySize: 100,                    // 한 번에 가져올 행 수 증가 (성능 향상)
      maxRows: 1000,                          // 최대 행 수 제한 (메모리 사용량 제어)
      fetchInfo: {
        CONTENT: { type: oracledb.STRING },   // CLOB을 문자열로 변환
        TITLE: { type: oracledb.STRING },   // VARCHAR2도 문자열로 명시
        EXCEL_DATA: { type: oracledb.STRING }, // JSON 컬럼을 문자열로 변환 (파싱 후 사용)
      },
      ...options
    }
    
    console.log('🔍 SQL 실행:', query.substring(0, 100) + '...')
    const result = await connection.execute(query, binds, defaultOptions)
    console.log(`✅ 쿼리 성공: ${result.rowsAffected || result.rows?.length || 0}개 행 처리`)
    
    return result
  } catch (error) {
    console.error('❌ SQL 실행 실패:', error)
    throw error
  } finally {
    // 연결 반환 (풀로 돌려보냄)
    await connection.close()
  }
}

/**
 * BOARD 테이블에 Excel 데이터 저장 (JSON 타입 최적화)
 * @param boardId 게시글 ID
 * @param excelData JSON 형태의 엑셀 데이터
 * @returns 저장 성공 여부
 */
export async function saveExcelDataToBoard(boardId: number, excelData: any): Promise<boolean> {
  const updateQuery = `
    UPDATE BOARD 
    SET EXCEL_DATA = :excelData 
    WHERE BOARD_ID = :boardId
  `
  
  try {
    // Oracle DB 바인드 시 JSON 데이터를 문자열로 변환
    const excelDataString = excelData ? JSON.stringify(excelData) : null
    
    const result = await executeQuery(updateQuery, {
      boardId: boardId,
      excelData: excelDataString
    })
    
    if (result.rowsAffected && result.rowsAffected > 0) {
      console.log(`✅ Excel 데이터 저장 성공: BOARD_ID ${boardId}`)
      return true
    } else {
      throw new Error('Excel 데이터 저장에 실패했습니다.')
    }
  } catch (error) {
    console.error('❌ Excel 데이터 저장 실패:', error)
    throw error
  }
}