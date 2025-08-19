# Nuxt-Board 개발 명령어 기록 📝

**윈도우 환경 기준 복습용 명령어 모음**

## 📋 Phase 1: Nuxt 기초 개념 이해

### 🚀 프로젝트 초기화

```powershell
# 현재 디렉토리에 Nuxt 3 프로젝트 생성
npx nuxi@latest init .

# 의존성 패키지 설치
npm install

# 개발 서버 실행
npm run dev

# 개발 서버 종료 (Ctrl + C)
```

### 🌐 접속 확인
- 브라우저에서 `http://localhost:3000` 접속
- "Welcome to Nuxt!" 메시지 확인

---

## 📝 실행 로그

### ✅ 프로젝트 초기화 완료!
- **완료 시간**: 방금 전
- **생성된 파일들**: 
  - `nuxt.config.ts` - Nuxt 설정 파일
  - `app.vue` - 메인 앱 컴포넌트
  - `package.json` - 의존성 관리 파일
  - `public/` - 정적 파일 폴더

### ✅ 의존성 설치 완료!
- **설치된 패키지**: 771개 패키지
- **소요 시간**: 약 2분

### ✅ 개발 서버 실행 성공!
```powershell
npm run dev
```
- **접속 URL**: http://localhost:3000
- **상태**: 정상 실행 중
- **Nuxt 버전**: 4.0.3
- **Nitro 버전**: 2.12.4

### ✅ 핫 리로드 체험 완료!
**수정된 파일**: `app/app.vue`
**결과**: 
- 🎉 페이지가 **자동으로** 업데이트됨
- 새로고침 **없이** 변경사항 즉시 반영
- "내 첫 번째 Nuxt 앱!" 제목 표시 성공

### 🔥 핫 리로드의 신기함
- 파일 저장 → **즉시** 브라우저 업데이트
- 새로고침 불필요 → **개발 속도 급상승**
- 상태 유지 → **사용자 입력값 보존**

### ✨ 파일 기반 라우팅 마법 체험 완료!
**생성된 파일들**:
```
pages/
├── index.vue    → "/" (홈 페이지)
└── about.vue    → "/about" (소개 페이지)
```

**체험할 수 있는 것들**:
- 🏠 `http://localhost:3000` → 홈 페이지 자동 표시
- 📖 `http://localhost:3000/about` → 소개 페이지 자동 표시  
- 🔗 NuxtLink로 부드러운 페이지 이동
- ⚡ 라우터 설정 파일 없이 자동 라우팅!

### 🔧 문제 해결: pages 폴더 인식 안됨
**문제**: app.vue와 pages 폴더가 충돌
**해결**: `app.vue`를 `app.vue.backup`으로 이름 변경
```powershell
mv app/app.vue app/app.vue.backup
```
**결과**: 이제 pages 폴더 기반 라우팅이 정상 작동!

### 🔄 개발 서버 재시작 완료!
**문제**: pages 폴더 인식을 위해서는 서버 재시작 필요
**해결**: 
```powershell
# 기존 서버 종료 후 재시작
npm run dev
```
**새로운 URL**: http://localhost:3001 (포트 변경됨)

### 🔧 최종 해결: app 폴더 완전 삭제
**근본 원인**: app 폴더(백업 파일 포함)가 pages 폴더 인식을 방해
**최종 해결**: 
```powershell
# app 폴더 완전 삭제
rm -rf app

# 개발 서버 재시작  
npm run dev
```
**최종 URL**: http://localhost:3002

### 🎯 포트 3000 고정 정책
**정책**: 앞으로 개발 서버는 **무조건 3000번 포트**로만 실행
**3000 포트 충돌 해결 명령어**:
```powershell
# 3000 포트 사용 프로세스 강제 종료
npx kill-port 3000

# 개발 서버 3000 포트로 시작
npm run dev
```
**현재 URL**: http://localhost:3000 ✅

### 🔄 Nuxt 서버 재시작 정책
**기본 원칙**: 새로운 폴더 생성 또는 설정 변경 시에만 재시작 필요

#### 🚨 재시작 필요한 경우
- **새 폴더 생성**: `server/`, `layouts/`, `components/`, `middleware/`
- **설정 파일 변경**: `nuxt.config.ts`, `package.json`, `.env`
- **모듈 설치**: `npm install` 새 패키지 추가

#### ✅ 재시작 불필요 (핫 리로드 자동)
- **기존 폴더 내 파일 생성**: `pages/new.vue`, `components/New.vue`
- **파일 내용 수정**: 모든 Vue, JS, CSS 파일
- **스타일링 변경**: CSS, 레이아웃 수정

#### 📋 자동 재시작 명령어
```powershell
# 표준 재시작 (포트 3000 고정)
npx kill-port 3000 && npm run dev
```

## 📁 프로젝트 구조 이해

### 🏗️ Nuxt-Board 폴더 구조
```
nuxt-board/
├── 📋 문서 파일들
│   ├── CLAUDE.md           # SuperClaude 학습 가이드
│   ├── COMMANDS_LOG.md     # 실행 명령어 기록 (이 파일)
│   ├── PHASE_GUIDE.md      # Phase별 구현 가이드
│   ├── PROJECT_ROADMAP.md  # 전체 로드맵
│   └── README.md          # Nuxt 기본 README
│
├── ⚙️ 설정 파일들
│   ├── nuxt.config.ts     # Nuxt 메인 설정 파일
│   ├── tsconfig.json      # TypeScript 설정
│   ├── package.json       # 프로젝트 정보 & 의존성
│   └── package-lock.json  # 의존성 버전 고정
│
├── 🗂️ 소스 코드 폴더들
│   ├── pages/             # 📍 파일 기반 라우팅 (핵심!)
│   │   ├── index.vue      → "/" (홈 페이지)
│   │   └── about.vue      → "/about" (소개 페이지)
│   │
│   └── public/           # 📦 정적 파일들
│       ├── favicon.ico   # 브라우저 탭 아이콘
│       └── robots.txt    # 검색엔진 설정
│
├── 📦 node_modules/       # 설치된 패키지들 (자동 생성)
└── 🧠 .nuxt/             # Nuxt 빌드 캐시 (자동 생성, 중요!)
```

### 📖 핵심 폴더 역할

#### 🎯 `pages/` 폴더 (가장 중요!)
- **파일 기반 자동 라우팅**의 핵심
- **규칙**: 파일명 = URL 경로
- **예시**: `about.vue` 파일 → `/about` 경로 자동 생성
- **장점**: Vue Router 설정 없이 페이지 추가 가능

#### ⚙️ 설정 파일들
- `nuxt.config.ts`: Nuxt 모든 설정 (모듈, SEO, 빌드 등)
- `package.json`: 의존성 관리 (Nuxt 4.0.3, Vue 3.5.18)
- `tsconfig.json`: TypeScript 컴파일 설정

#### 📦 `public/` 폴더
- 빌드 시 그대로 복사되는 정적 파일들
- `/favicon.ico`로 직접 URL 접근 가능
- 이미지, 아이콘, sitemap.xml 등 저장 위치

#### 🧠 `.nuxt/` 폴더 (Nuxt의 뇌!)
- **자동 생성**: 개발 서버 실행 시 자동으로 생성/관리
- **Auto-Import**: 컴포넌트, 함수들 자동 임포트 설정
- **TypeScript**: 완벽한 타입 정의와 자동완성 지원
- **라우팅**: pages/ 기반 자동 라우트 생성
- **주의**: 절대 수동 편집하지 말 것! (자동으로 덮어씌워짐)
- **문제 해결**: 삭제 후 `npm run dev`로 재생성 가능

---

## 🎨 Phase 2: 프로젝트 구조화 완료!

### ✅ 추가된 폴더 구조
```
nuxt-board/
├── layouts/             # ✨ 새로 추가!
│   └── default.vue      # 공통 레이아웃 (헤더, 푸터, 네비게이션)
├── components/          # ✨ 새로 추가!
│   ├── PhaseCard.vue    # 재사용 가능한 Phase 카드 컴포넌트
│   └── WelcomeMessage.vue # 환영 메시지 컴포넌트
└── pages/               # 기존 페이지들이 새 레이아웃 적용됨
    ├── index.vue        # 컴포넌트들 사용하도록 업데이트
    └── about.vue        # 자동으로 레이아웃 적용
```

### 🎯 Phase 2 핵심 학습 내용

#### 1. 레이아웃 시스템 (`layouts/default.vue`)
- **자동 적용**: 모든 페이지에 공통 헤더, 푸터 자동 적용
- **`<slot />` 개념**: 각 페이지 내용이 들어갈 위치 지정
- **일관된 디자인**: 전체 사이트 통일성 확보

#### 2. 컴포넌트 자동 Import 마법 ✨
```vue
<!-- import 문 없이 바로 사용 가능! -->
<PhaseCard title="컴포넌트 제목" />
<WelcomeMessage subtitle="환영 메시지" />
```
- **자동 인식**: `components/` 폴더의 모든 Vue 파일 자동 등록
- **타입 지원**: `.nuxt/components.d.ts`로 완벽한 TypeScript 지원
- **개발 효율성**: import/export 관리 불필요

#### 3. 컴포넌트 재사용성
- **PhaseCard**: 같은 구조, 다른 데이터로 재사용
- **Props 시스템**: 부모→자식 데이터 전달
- **조건부 렌더링**: `v-if`, `v-for` 등 Vue 디렉티브 활용

---

## 🚀 Phase 3: 서버 API 구축 완료!

### ✅ 추가된 서버 구조
```
nuxt-board/
└── server/              # ✨ 새로 추가!
    └── api/             # Nitro API 엔드포인트
        ├── hello.get.ts      # GET /api/hello (기본 테스트)
        └── board/            # 게시판 API 모음
            ├── index.get.ts  # GET /api/board (목록 조회)
            └── [id].get.ts   # GET /api/board/:id (상세 조회)
```

### 🎯 Phase 3 핵심 학습 내용

#### 1. Nitro 엔진 활용 ⚡
- **별도 Express 서버 불필요**: Nuxt 내장 서버로 API 구현
- **파일 기반 API 라우팅**: 파일명 = API 경로 자동 생성
- **TypeScript 완벽 지원**: 타입 안전성과 자동완성
- **핫 리로드**: API 코드 수정 시 즉시 반영

#### 2. RESTful API 패턴 구현 📡
```typescript
// GET /api/hello - 기본 API 테스트
server/api/hello.get.ts

// GET /api/board - 게시판 목록 조회  
server/api/board/index.get.ts

// GET /api/board/123 - 게시글 상세 조회
server/api/board/[id].get.ts
```

#### 3. 프론트엔드-백엔드 연동 🔗
- **$fetch() 함수**: Nuxt 내장 HTTP 클라이언트 사용
- **반응형 상태 관리**: 로딩, 에러, 성공 상태 처리
- **컴포넌트 자동 Import**: `<ApiTest />`, `<BoardList />` 즉시 사용
- **모달 팝업**: 게시글 상세보기 인터랙션 구현

#### 4. 실제 동작 확인 ✅
- ✅ **3개 게시글 목록** 정상 표시
- ✅ **게시글 클릭** → 상세보기 팝업 정상 작동
- ✅ **조회수 증가** 기능 실시간 반영
- ✅ **새로고침 버튼** API 재호출 기능

### 🚀 Phase 4에서 추가될 예정
```
├── server/utils/        # Oracle DB 연결 유틸리티
│   └── database.ts      # DB 커넥션 풀 관리
└── server/api/board/    # 확장된 CRUD API
    ├── index.post.ts    # POST - 게시글 작성
    ├── [id].put.ts      # PUT - 게시글 수정
    └── [id].delete.ts   # DELETE - 게시글 삭제
```

---

*이 파일은 학습 진행에 따라 자동으로 업데이트됩니다.*