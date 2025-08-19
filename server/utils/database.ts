// Oracle Database 연결 유틸리티  
import oracledb, { type Pool, type Connection, type ExecuteOptions, type Result } from 'oracledb'

// Oracle DB 연결 설정
const dbConfig = {
  user: process.env.DB_USER || 'test',
  password: process.env.DB_PASSWORD || '1111', 
  connectString: process.env.DB_CONNECTION_STRING || '192.168.0.118:1521/XE'
}

// 연결 풀 설정
const poolConfig = {
  user: dbConfig.user,
  password: dbConfig.password,
  connectString: dbConfig.connectString,
  poolMin: 1,          // 최소 연결 수
  poolMax: 10,         // 최대 연결 수  
  poolIncrement: 1,    // 연결 증가 단위
  poolTimeout: 60      // 유휴 연결 타임아웃 (초)
}

// 전역 연결 풀 변수
let pool: Pool | null = null

/**
 * Oracle DB 연결 풀 초기화
 */
export async function initializePool(): Promise<Pool> {
  if (!pool) {
    try {
      console.log('🔗 Oracle DB 연결 풀 생성 중...')
      pool = await oracledb.createPool(poolConfig)
      console.log('✅ Oracle DB 연결 풀 생성 완료!')
      
      // 연결 테스트
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
 * 안전한 쿼리 실행 헬퍼 함수
 * @param query SQL 쿼리
 * @param binds 바인드 변수
 * @param options 실행 옵션
 */
export async function executeQuery(
  query: string, 
  binds: any = {}, 
  options: ExecuteOptions = {}
): Promise<Result<any>> {
  const connection = await getConnection()
  
  try {
    // 기본 옵션 설정 (CLOB 처리 포함)
    const defaultOptions: ExecuteOptions = {
      outFormat: oracledb.OUT_FORMAT_OBJECT, // 객체 형태로 결과 반환
      autoCommit: true, // 자동 커밋
      fetchInfo: {
        CONTENT: { type: oracledb.STRING }, // CLOB을 문자열로 변환
        TITLE: { type: oracledb.STRING },   // VARCHAR2도 문자열로 명시
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
 * 게시판 테이블 존재 확인 (기존 테이블 사용)
 */
export async function ensureBoardTable(): Promise<void> {
  const checkTableQuery = `
    SELECT COUNT(*) as TABLE_COUNT 
    FROM USER_TABLES 
    WHERE TABLE_NAME = 'BOARD'
  `
  
  try {
    const result = await executeQuery(checkTableQuery)
    const tableExists = result.rows?.[0]?.TABLE_COUNT > 0
    
    if (tableExists) {
      console.log('✅ 기존 게시판 테이블을 사용합니다.')
    } else {
      console.log('❌ BOARD 테이블이 존재하지 않습니다.')
      throw new Error('BOARD 테이블을 먼저 생성해주세요.')
    }
  } catch (error) {
    console.error('❌ 테이블 확인 실패:', error)
    throw error
  }
}

// 샘플 데이터 삽입 함수 제거 (기존 데이터 사용)