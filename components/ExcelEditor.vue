<template>
  <!-- 
    ExcelEditor 컴포넌트 - SpreadJS 기반 엑셀 데이터 입력기
    
    [주요 기능]
    - SpreadJS 워크북 초기화 및 기본 설정
    - 초기 데이터 로딩 (BoardCreate/Edit 모두 동일한 방식)
    - 셀 편집 이벤트 처리 및 데이터 관리
    - 시트 데이터 추출 및 저장
    
    [현재 구현 방식]
    - fromJSON 사용하지 않음 (가벼운 초기화)
    - setArray로 배치 데이터 입력
    - suspendPaint/resumePaint로 렌더링 최적화
    - EditEnded 이벤트로 셀 편집 완료 감지
  -->
  <div class="excel-wrapper" data-excel-editor>
      <gc-spread-sheets class="spread-host" @workbookInitialized="initWorkbook">
      </gc-spread-sheets>
  </div>
</template>
  
<script>
  // SpreadJS 관련 라이브러리 및 스타일 import
  import '@mescius/spread-sheets/styles/gc.spread.sheets.excel2016colorful.css'
  import { GcSpreadSheets } from '@mescius/spread-sheets-vue'
  import * as GC from "@mescius/spread-sheets";
  import '@mescius/spread-sheets-resources-ko';

  // ========================================
  // SpreadJS 라이선싱 설정
  // ========================================
  // var SpreadJSKey = "xxx";          // 실제 라이선스 키 입력
  // GC.Spread.Sheets.LicenseKey = SpreadJSKey;

  export default {
      name: 'ExcelEditor',
      components: {
          GcSpreadSheets
      },
      
      // ========================================
      // Props 정의 - 외부에서 전달받는 설정값
      // ========================================
      props: {
          // 편집 모드 설정
          // - true: 일반 편집 모드 (기본값)
          // - false: 읽기 전용 모드 (시트 보호 활성화)
          editable: {
              type: Boolean,
              default: true
          },
          
          // 초기 데이터 설정
          // - BoardCreate: 빈 배열 [] (새로 작성)
          // - BoardEdit: 기존 데이터 배열 (수정)
          // - 2차원 배열 형태: [[행1], [행2], ...]
          initialData: {
              type: Array,
              default: () => []
          }
      },
      
      // ========================================
      // 이벤트 정의
      // ========================================
      emits: ['data-change'],
      
      // ========================================
      // 컴포넌트 상태 데이터 - SpreadJS 핵심 객체 관리
      // ========================================
      data() {
        return {
          // SpreadJS 핵심 객체들
          spread: null,        // SpreadJS 워크북 메인 객체 (전체 엑셀 문서)
          sheet: null,         // 현재 활성 시트 객체 (편집 대상)
          
          // 컴포넌트 상태 관리
          isInitialized: false // 초기화 완료 여부 (안전한 데이터 접근 보장)
        }
      },
      
      // ========================================
      // 생명주기 훅 - 컴포넌트 마운트/언마운트 관리
      // ========================================
      mounted() {
        // 컴포넌트 마운트 완료 후 초기화 상태 확인
        // - SpreadJS가 DOM에 완전히 마운트된 후 실행
        // - 초기화 대기 상태를 로그로 확인 (개발 모드에서만)
        this.$nextTick(() => {
          if (!this.isInitialized && process.env.NODE_ENV === 'development') {
            console.log('🔄 ExcelEditor 마운트 완료, 초기화 대기 중...');
          }
        });
      },
      
      beforeUnmount() {
        // 컴포넌트 언마운트 시 메모리 정리
        // - SpreadJS 객체 참조 해제로 메모리 누수 방지
        // - 컴포넌트 상태 초기화
        try {
          // SpreadJS 객체 참조 해제
          if (this.spread) {
            this.spread = null;
          }
          
          this.sheet = null;
          this.isInitialized = false;
          if (process.env.NODE_ENV === 'development') {
            console.log('✅ ExcelEditor 정리 작업 완료');
          }
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.warn('⚠️ ExcelEditor 정리 작업 중 오류:', error);
          }
        }
      },
      
      // ========================================
      // 메서드 정의
      // ========================================
      methods: {
        /**
         * SpreadJS 워크북 초기화 및 기본 설정
         * 
         * [핵심 기능]
         * - SpreadJS 워크북 객체 초기화 및 기본 설정
         * - 한국어 로케일 설정 및 기본 스타일 적용
         * - BoardCreate와 BoardEdit에서 동일한 동작 보장
         * 
         * [현재 구현 방식]
         * - fromJSON 사용하지 않음 (가벼운 초기화)
         * - setArray로 배치 데이터 입력
         * - suspendPaint/resumePaint로 렌더링 최적화
         * 
         * [처리 순서]
         * 1. 한국어 로케일 설정
         * 2. SpreadJS 객체 참조 저장
         * 3. 기본 시트 설정 (가벼운 방식)
         * 4. 초기 데이터 로딩 (조건부)
         * 5. 편집 모드 및 이벤트 설정
         * 
         * @param {Object} spread - SpreadJS 워크북 객체 (DOM 마운트 후 자동 전달)
         */
        initWorkbook(spread) {
            try {
                if (process.env.NODE_ENV === 'development') {
                    console.log('🔄 ExcelEditor 초기화 시작...');
                }
                
                // ========================================
                // 1. 한국어 로케일 설정
                // ========================================
                // SpreadJS의 모든 텍스트와 메시지를 한국어로 표시
                GC.Spread.Common.CultureManager.culture("ko-kr");
                
                // ========================================
                // 2. SpreadJS 핵심 객체 참조 저장
                // ========================================
                // spread: 전체 워크북 객체 (엑셀 문서 전체)
                // sheet: 현재 활성 시트 객체 (편집 대상)
                this.spread = spread;
                this.sheet = spread.getActiveSheet();
                
                // ========================================
                // 3. 객체 유효성 검사
                // ========================================
                // SpreadJS 라이브러리 로딩 실패, DOM 마운트 문제 등 방지
                if (!this.spread) {
                    throw new Error('SpreadJS 객체를 가져올 수 없습니다.');
                }
                
                // ========================================
                // 4. 기본 시트 설정 (가벼운 방식)
                // ========================================
                // fromJSON 제거로 BoardCreate와 BoardEdit에서 동일한 동작 보장
                // 성능 향상: 무거운 JSON 파싱 제거, 일관된 동작 보장
                
                // 기본 시트 객체 획득 및 유효성 검사
                this.sheet = this.spread.getActiveSheet();
                
                if (!this.sheet) {
                    throw new Error('시트를 가져올 수 없습니다.');
                }
                
                // 기본 열 너비 설정 (A~E열 각각 150px)
                // - A열(0번): 제품명, B열(1번): 수량, C열(2번): 단가, D열(3번): 총액, E열(4번): 비고
                for (let i = 0; i < 5; i++) {
                    this.sheet.setColumnWidth(i, 150);
                }
                
                // 기본 행 높이 설정 (0번 행: 헤더용)
                this.sheet.setRowHeight(0, 25);
                
                // ========================================
                // 5. 초기 데이터 설정 (BoardCreate와 동일한 방식)
                // ========================================
                // BoardCreate: 빈 배열 [] → 데이터 설정 안함
                // BoardEdit: 기존 데이터 배열 → setArray로 배치 입력
                
                if (this.initialData && this.initialData.length > 0) {
                    // ========================================
                    // 5a. 렌더링 최적화
                    // ========================================
                    // suspendPaint: 렌더링 일시 중단으로 성능 향상
                    // resumePaint: 렌더링 재개
                    this.spread.suspendPaint();
                    
                    // ========================================
                    // 5b. 데이터 배열 변환
                    // ========================================
                    // 20열 구조로 통일 (빈 셀은 빈 문자열로 채움)
                    // - 기존 데이터가 20열보다 적으면 나머지는 빈 문자열
                    // - 기존 데이터가 20열보다 많으면 20열까지만 사용
                    const dataArray = this.initialData.map((row, rowIndex) => {
                        const newRow = new Array(20).fill(''); // 20열 기본값
                        row.forEach((cell, colIndex) => {
                            if (colIndex < 20) {
                                newRow[colIndex] = cell;
                            }
                        });
                        return newRow;
                    });
                    
                    // ========================================
                    // 5c. 배치 데이터 입력
                    // ========================================
                    // setArray: 2차원 배열을 한 번에 입력 (setValue 반복 대신)
                    // - 1번 행부터 시작 (0번 행은 헤더용으로 예약)
                    // - 0번 열부터 시작 (A열부터)
                    this.sheet.setArray(1, 0, dataArray);
                    
                    // 렌더링 재개
                    this.spread.resumePaint();
                    
                    if (process.env.NODE_ENV === 'development') {
                        console.log('✅ 초기 데이터 설정 완료 (BoardCreate와 동일한 방식)');
                    }
                }
                
                // ========================================
                // 6. 편집 모드 및 기본 옵션 설정
                // ========================================
                // 편집 가능 여부에 따른 시트 보호 설정
                if (!this.editable) {
                    this.sheet.options.isProtected = true;
                    if (process.env.NODE_ENV === 'development') {
                        console.log('✅ 읽기 전용 모드 설정 완료');
                    }
                }
                
                // SpreadJS 기본 편집 옵션 설정
                this.sheet.options.allowUserEdit = true;    // 사용자 편집 허용
                this.sheet.options.allowUserResize = true;  // 사용자 크기 조정 허용
                this.sheet.options.allowUserFormat = true;  // 🆕 사용자 서식 편집 허용 (추가!)
                // ========================================
                // 7. 셀 편집 이벤트 바인딩
                // ========================================
                // EditEnded: 셀 편집 완료 시 발생하는 이벤트
                // - 키보드 Enter, Tab 등으로 셀 이동 시 자동 발생
                // - 마우스 클릭으로 셀 이동 시에도 편집 완료 처리
                // - 개발 모드에서만 로그 출력 (프로덕션 성능 최적화)
                this.sheet.bind(GC.Spread.Sheets.Events.EditEnded, (e, args) => {
                    if (process.env.NODE_ENV === 'development') {
                        console.log('📝 셀 편집 완료:', args);
                    }
                });
                
                // 초기화 완료 상태 설정
                this.isInitialized = true;
                if (process.env.NODE_ENV === 'development') {
                    console.log('✅ ExcelEditor 초기화 완료');
                }
                
            } catch (error) {
                console.error('❌ ExcelEditor 초기화 실패:', error);
                this.isInitialized = false;
                
                // 오류 발생 시 빈 배열 전송
                // 이유: 
                // 1. 부모 컴포넌트에서 데이터 변경 이벤트를 기다리고 있을 수 있음
                // 2. 초기화 실패 시에도 컴포넌트가 정상적으로 동작하도록 보장
                // 3. 에러 상황에서도 UI가 깨지지 않도록 안전한 기본값 제공
                this.$emit('data-change', []);
            }
        },
        
        /**
         * 현재 시트의 데이터를 2차원 배열로 추출
         * 
         * [핵심 기능]
         * - 시트의 모든 데이터를 2차원 배열 형태로 변환
         * - 빈 행은 제외하고 데이터가 있는 행만 반환
         * - 열 구조는 유지 (빈 셀도 빈 문자열로 저장)
         * 
         * [처리 로직]
         * 1. 시트 크기 확인 (행/열 개수)
         * 2. 모든 행을 순회하며 데이터 존재 여부 확인
         * 3. 데이터가 있는 행만 결과 배열에 추가
         * 4. 20열 구조로 통일 (빈 셀은 빈 문자열)
         * 
         * [성능 최적화]
         * - 개발 모드에서만 상세 로그 출력
         * - try-catch로 개별 셀 오류 처리
         * - 불필요한 빈 행 제거
         * 
         * @returns {Array} 2차원 배열 형태의 시트 데이터 [[행1], [행2], ...]
         */
        getSheetData() {
            if (process.env.NODE_ENV === 'development') {
                console.log('🔍 getSheetData 시작');
            }
            
            if (!this.sheet) {
                if (process.env.NODE_ENV === 'development') {
                    console.warn('⚠️ 시트가 초기화되지 않았습니다.');
                }
                return [];
            }
            
            try {
                const rowCount = this.sheet.getRowCount();
                const colCount = this.sheet.getColumnCount();
                
                if (process.env.NODE_ENV === 'development') {
                    console.log(`📊 시트 크기: ${rowCount}행 x ${colCount}열`);
                }
                
                const data = [];
                
                // 모든 행을 순회하면서 데이터가 있는 행만 수집
                for (let row = 0; row < rowCount; row++) {
                    const rowData = [];
                    let hasData = false;
                    
                    // 20열까지 데이터 가져오기 (열 구조 유지)
                    for (let col = 0; col < 20; col++) {
                        try {
                            let cellValue = '';
                            if (row < rowCount && col < colCount) {
                                cellValue = this.sheet.getValue(row, col);
                            }
                            
                            // 빈 값이 아닌 경우 데이터가 있다고 표시
                            if (cellValue && cellValue.toString().trim() !== '') {
                                hasData = true;
                            }
                            
                            // 열 구조 유지: 빈 셀도 빈 문자열로 저장
                            rowData.push(cellValue || '');
                        } catch (cellError) {
                            if (process.env.NODE_ENV === 'development') {
                                console.warn(`⚠️ 셀 (${row}, ${col}) 값 가져오기 실패:`, cellError);
                            }
                            rowData.push('');
                        }
                    }
                    
                    // 데이터가 있는 행만 추가 (빈 행 제외)
                    if (hasData) {
                        data.push(rowData);
                        if (process.env.NODE_ENV === 'development') {
                            console.log(`📝 유효한 행 ${row} 데이터:`, rowData);
                            console.log(`📊 열 구조: A=${rowData[0]}, B=${rowData[1]}, C=${rowData[2]}, D=${rowData[3]}`);
                        }
                    }
                }
                
                if (process.env.NODE_ENV === 'development') {
                    console.log('📋 최종 시트 데이터 (열 구조 유지):', data);
                    console.log('📊 최종 데이터 길이:', data.length);
                    console.log('📊 각 행 길이:', data.map(row => row.length));
                }
                return data;
                
            } catch (error) {
                if (process.env.NODE_ENV === 'development') {
                    console.error('❌ getSheetData 실행 실패:', error);
                }
                return [];
            }
        },
        
        /**
         * 현재 시트 데이터를 안전하게 추출 및 반환
         * 
         * [핵심 기능]
         * - 저장 버튼 클릭 시 호출되는 메서드
         * - Promise 기반으로 비동기 처리
         * - 셀 편집 완료를 보장하여 데이터 무결성 확보
         * 
         * [처리 순서]
         * 1. 시트 객체 유효성 검사
         * 2. 시트 상태 정보 로깅 (개발 모드)
         * 3. 100ms 지연으로 셀 편집 완료 보장
         * 4. getSheetData() 호출로 실제 데이터 추출
         * 5. 결과 데이터 검증 및 반환
         * 
         * [안전성 보장]
         * - 100ms 지연으로 편집 중인 셀의 값 완전 저장
         * - try-catch로 오류 상황에서도 빈 배열 반환
         * - 시트 미초기화 시 안전한 기본값 반환
         * 
         * @returns {Promise<Array>} 현재 엑셀 데이터 (2차원 배열)
         */
        async saveData() {
            return new Promise((resolve) => {
                try {
                    if (process.env.NODE_ENV === 'development') {
                        console.log('🚀 saveData 시작');
                    }
                    
                    if (!this.sheet) {
                        if (process.env.NODE_ENV === 'development') {
                            console.warn('⚠️ 시트가 초기화되지 않았습니다.');
                        }
                        resolve([]);
                        return;
                    }

                    if (process.env.NODE_ENV === 'development') {
                        console.log('✅ 시트 존재 확인됨');
                        console.log('📊 시트 상태:', {
                            isInitialized: this.isInitialized,
                            rowCount: this.sheet.getRowCount(),
                            colCount: this.sheet.getColumnCount()
                        });
                    }

                    // 셀 편집 완료를 위한 지연 처리
                    setTimeout(() => {
                        try {
                            const data = this.getSheetData();
                            if (process.env.NODE_ENV === 'development') {
                                console.log('💾 getSheetData 결과:', data);
                                console.log('📊 데이터 타입:', typeof data);
                                console.log('📊 데이터 길이:', data.length);
                                console.log('📊 데이터 내용:', JSON.stringify(data));
                            }
                            
                            resolve(data);
                        } catch (error) {
                            if (process.env.NODE_ENV === 'development') {
                                console.error('❌ getSheetData 실행 중 오류:', error);
                            }
                            resolve([]);
                        }
                    }, 100);
                    
                } catch (error) {
                    if (process.env.NODE_ENV === 'development') {
                        console.error('❌ saveData 실행 실패:', error);
                    }
                    resolve([]);
                }
            });
        }
      }    
  }
</script>
  
<style scoped>
/* 
  ExcelEditor 컴포넌트 스타일
  - SpreadJS 컨테이너의 크기와 테두리 설정
  - 반응형 디자인을 위한 기본 스타일
*/

.excel-wrapper {
    margin-top: 24px;
}

.spread-host {
    width: 100%;
    height: 600px;
    border: 1px solid #dee2e6;
    border-radius: 8px;
    overflow: hidden;
}
</style>