# Phase별 상세 구현 가이드

Nuxt-Board 프로젝트의 단계별 구현 가이드입니다.

## 📋 전체 개발 스케줄

| Phase | 기간 | 복잡도 | 핵심 학습 목표 | 성취감 지표 |
|-------|------|--------|----------------|------------|
| **Phase 1** | 1.5일 | 2/10 | Nuxt 기초 체득 | "파일로 페이지가 만들어진다!" |
| **Phase 2** | 1.5일 | 3/10 | 컴포넌트 구조화 | "재사용 가능한 컴포넌트 이해" |
| **Phase 3** | 2.5일 | 5/10 | 서버 API 이해 | "백엔드 없이도 API 구현!" |
| **Phase 4** | 3.0일 | 6/10 | CRUD 완성 | "실제 동작하는 게시판 완성" |
| **Phase 5** | 1.5일 | 4/10 | UX 완성도 향상 | "완성도 있는 웹앱 구현" |

**총 개발 기간**: 10일

## 🚀 Phase 1: Nuxt 기초 개념 이해 (1.5일)

### 학습 목표
- Nuxt와 Vue의 차이점 체감
- 파일 기반 라우팅 개념 습득
- 개발 환경 설정 및 기본 구조 이해

### 구현 목표
- "Hello World" Nuxt 앱 실행
- 기본 페이지 라우팅 동작 확인
- Nuxt 개발 서버 실행 및 핫 리로드 체험

### 주요 작업
1. **프로젝트 초기화** (0.5일)
   ```bash
   npx nuxi@latest init nuxt-board
   cd nuxt-board
   npm install
   ```

2. **기본 페이지 생성** (0.5일)
   - `pages/index.vue` - 홈 페이지
   - `pages/about.vue` - 소개 페이지
   - 페이지 간 이동 테스트

3. **Nuxt 특징 체험** (0.5일)
   - 파일 기반 라우팅 실습
   - `<NuxtLink>` 컴포넌트 사용
   - 개발 도구 및 핫 리로드 체험

### 완료 기준
- ✅ `npm run dev` 실행 성공
- ✅ `http://localhost:3000` 접속 가능
- ✅ 페이지 간 이동 정상 작동
- ✅ 코드 수정 시 자동 새로고침 확인

### 예상 어려움과 해결책
- **어려움**: "왜 Vue와 다른가?"
- **해결**: 파일 하나 추가할 때마다 라우팅이 자동 생성되는 것을 직접 체험

## 🏗️ Phase 2: 프로젝트 구조 이해 (1.5일)

### 학습 목표
- Nuxt 디렉토리 구조 숙지
- 컴포넌트 구조화 방법 습득
- 레이아웃 시스템 이해

### 구현 목표
- 공통 레이아웃 구성
- 기본 네비게이션 메뉴 구현
- 컴포넌트 재사용성 체험

### 주요 작업
1. **레이아웃 시스템** (0.5일)
   ```vue
   <!-- layouts/default.vue -->
   <template>
     <div>
       <header>
         <nav>
           <NuxtLink to="/">홈</NuxtLink>
           <NuxtLink to="/about">소개</NuxtLink>
         </nav>
       </header>
       <main>
         <slot />
       </main>
       <footer>
         <p>&copy; 2024 Nuxt Board</p>
       </footer>
     </div>
   </template>
   ```

2. **기본 컴포넌트** (0.5일)
   - `components/Header.vue` - 헤더 컴포넌트
   - `components/Navigation.vue` - 네비게이션
   - `components/Footer.vue` - 푸터 컴포넌트

3. **컴포넌트 통합** (0.5일)
   - 레이아웃에 컴포넌트 적용
   - Auto-import 기능 체험
   - 기본 스타일링 적용

### 완료 기준
- ✅ 모든 페이지에 공통 레이아웃 적용
- ✅ 네비게이션 메뉴 정상 작동
- ✅ 컴포넌트 자동 import 동작 확인
- ✅ 기본적인 CSS 스타일 적용

### 핵심 포인트
- **Auto-import**: 컴포넌트를 import 없이 사용 가능
- **레이아웃 재사용**: 모든 페이지가 동일한 구조 유지
- **컴포넌트 분리**: 재사용 가능한 단위로 분리

## 🗄️ Phase 3: 서버사이드 API 이해 (2.5일)

### 학습 목표
- Nitro 엔진 개념 학습
- Oracle DB 연결 설정
- 풀스택 개발 개념 이해

### 구현 목표
- Oracle DB 연결 성공
- 기본 데이터 조회 API 구현
- 프론트엔드에서 데이터 출력 확인

### 주요 작업
1. **데이터베이스 설정** (1일)
   ```typescript
   // server/utils/database.ts
   import oracledb from 'oracledb'

   export async function getConnection() {
     return await oracledb.getConnection({
       user: process.env.DB_USER,
       password: process.env.DB_PASSWORD,
       connectString: process.env.DB_CONNECT_STRING
     })
   }
   ```

2. **첫 번째 API** (1일)
   ```typescript
   // server/api/board/index.get.ts
   export default defineEventHandler(async (event) => {
     const connection = await getConnection()
     
     const result = await connection.execute(
       'SELECT * FROM BOARD ORDER BY CREATED_AT DESC'
     )
     
     await connection.close()
     
     return {
       success: true,
       data: result.rows
     }
   })
   ```

3. **프론트엔드 연동** (0.5일)
   ```vue
   <!-- pages/index.vue -->
   <script setup>
   const { data: boards } = await $fetch('/api/board')
   </script>

   <template>
     <div>
       <h1>게시판</h1>
       <ul>
         <li v-for="board in boards.data" :key="board.id">
           {{ board.title }}
         </li>
       </ul>
     </div>
   </template>
   ```

### 완료 기준
- ✅ Oracle DB 연결 성공
- ✅ `/api/board` 엔드포인트 정상 응답
- ✅ 프론트엔드에 DB 데이터 출력
- ✅ 개발자 도구에서 API 호출 확인

### 핵심 포인트
- **Nitro 엔진**: 별도 Express 서버 없이 API 구현 가능
- **파일 기반 API**: `server/api/` 디렉토리의 파일이 자동으로 엔드포인트가 됨
- **$fetch**: Nuxt 내장 HTTP 클라이언트

## ⚙️ Phase 4: CRUD 완전 구현 (3일)

### 학습 목표
- 게시판 핵심 기능 완성
- RESTful API 패턴 학습
- 실무 개발 패턴 체득

### 구현 목표
- 게시글 CRUD 모든 기능 동작
- 기본적인 에러 처리 구현
- 사용자 피드백 시스템 구축

### 주요 작업
1. **API 엔드포인트 완성** (1.5일)
   - `GET /api/board` - 목록 조회
   - `GET /api/board/[id]` - 상세 조회
   - `POST /api/board` - 게시글 작성
   - `PUT /api/board/[id]` - 게시글 수정
   - `DELETE /api/board/[id]` - 게시글 삭제

2. **페이지 구현** (1일)
   - `pages/create.vue` - 작성 페이지
   - `pages/board/[id].vue` - 상세 페이지
   - `pages/board/[id]/edit.vue` - 수정 페이지

3. **컴포넌트 개발** (0.5일)
   - `components/BoardList.vue` - 목록 컴포넌트
   - `components/BoardForm.vue` - 폼 컴포넌트
   - `components/BoardDetail.vue` - 상세 컴포넌트

### 완료 기준
- ✅ 게시글 작성 → 목록에 표시
- ✅ 게시글 클릭 → 상세 페이지 이동
- ✅ 수정/삭제 버튼 정상 작동
- ✅ 에러 발생 시 적절한 메시지 표시

### 핵심 패턴
- **RESTful API**: 명사형 URL + HTTP 메서드 조합
- **폼 처리**: `@submit` 이벤트 + 유효성 검사
- **상태 관리**: `ref()`와 `reactive()` 적절한 사용

## 🎨 Phase 5: 사용자 경험 개선 (1.5일)

### 학습 목표
- 기본 기능의 완성도 향상
- 사용자 경험 고려사항 학습
- 반응형 디자인 적용

### 구현 목표
- 검색 기능 정상 작동
- 페이지네이션 구현
- 기본적인 반응형 디자인 적용

### 주요 작업
1. **검색 기능** (0.5일)
   ```vue
   <template>
     <div>
       <input 
         v-model="searchQuery" 
         @input="handleSearch"
         placeholder="검색어를 입력하세요"
       />
       <BoardList :boards="filteredBoards" />
     </div>
   </template>
   ```

2. **페이지네이션** (0.5일)
   - 페이지당 10개 게시글 표시
   - 이전/다음 버튼 구현
   - 페이지 번호 표시

3. **UI/UX 개선** (0.5일)
   - 로딩 상태 표시
   - 성공/에러 메시지 토스트
   - 기본 반응형 CSS 적용

### 완료 기준
- ✅ 검색어 입력 시 실시간 필터링
- ✅ 페이지네이션 정상 작동
- ✅ 모바일에서도 기본적인 사용 가능
- ✅ 사용자 액션에 대한 적절한 피드백

## 🎓 학습 효과 체크리스트

### 기술적 이해도
- [ ] Nuxt 3와 Vue 3의 차이점을 설명할 수 있다
- [ ] 파일 기반 라우팅의 장점을 이해한다
- [ ] Nitro 엔진을 통한 풀스택 개발을 체험했다
- [ ] RESTful API 설계 원칙을 적용할 수 있다
- [ ] Oracle DB 연동을 스스로 구현할 수 있다

### 실무 역량
- [ ] 컴포넌트 기반으로 생각하고 설계할 수 있다
- [ ] 에러 처리와 사용자 피드백을 고려한다
- [ ] 코드를 체계적으로 구조화할 수 있다
- [ ] 문제 발생 시 단계별로 접근할 수 있다
- [ ] 기본적인 성능과 UX를 고려한다

## 🚀 다음 단계 학습 제안

### 즉시 확장 가능한 기능
1. **인증 시스템** - JWT 기반 로그인/회원가입
2. **파일 업로드** - 이미지/첨부파일 기능
3. **댓글 시스템** - 게시글별 댓글 기능
4. **카테고리** - 게시글 분류 시스템

### 고급 학습 주제
1. **상태 관리** - Pinia 도입
2. **테스팅** - Vitest + @vue/test-utils
3. **배포** - Vercel, Netlify 배포 경험
4. **성능 최적화** - 이미지 최적화, 캐싱 전략

---

**각 Phase를 완료할 때마다 성취감을 느끼며, 단계적으로 실력이 향상되는 것을 체감할 수 있도록 설계되었습니다. 🎯**