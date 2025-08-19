# 🚀 Nuxt-Board: Nuxt 4 풀스택 게시판 프로젝트

**Nuxt 4 + Vue 3 + Oracle DB + Tailwind CSS + Pinia**로 구현한 완전한 CRUD 게시판 시스템

---

## 📋 프로젝트 개요

### 🎯 **학습 목표**
- Nuxt 4 최신 기능 완전 습득
- 풀스택 개발 경험 (프론트엔드 + 백엔드 + DB)
- 실무급 웹 애플리케이션 구현

### ✨ **구현된 주요 기능**
- ✅ **완전한 CRUD**: 게시글 작성/조회/수정/삭제
- ✅ **Oracle DB 연동**: 실제 데이터베이스 CRUD 작업
- ✅ **Pinia 상태관리**: 반응형 상태 관리 시스템
- ✅ **Tailwind CSS**: 현대적인 반응형 디자인
- ✅ **컴포넌트 시스템**: 재사용 가능한 Vue 3 컴포넌트
- ✅ **API 서버**: Nitro 엔진 기반 RESTful API

### 🛠️ **기술 스택**
```yaml
Frontend: "Nuxt 4.0.3 + Vue 3.5.18 + Tailwind CSS"
Backend: "Nitro Engine (내장) + RESTful API"
Database: "Oracle Database + TypeScript 타입 지원"
State: "Pinia 3.0.3 상태 관리"
Language: "TypeScript 완전 지원"
```

---

## 🚀 빠른 시작 가이드 (Windows 기준)

### **📁 1단계: 프로젝트 복제**
```powershell
# Git에서 프로젝트 복제
git clone [프로젝트-URL] nuxt-board
cd nuxt-board

# 또는 ZIP 다운로드 후 압축 해제하여 진행
```

### **📦 2단계: 의존성 설치**
```powershell
# Node.js 패키지 설치 (필수!)
npm install

# 설치 완료 확인 (약 1-2분 소요)
# 총 패키지 수: 700개 이상
```

### **🗄️ 3단계: Oracle DB 연결 설정**
```powershell
# .env.copy 파일을 .env로 복사 (환경변수 설정)
copy .env.copy .env

# .env 파일 편집 (메모장 또는 VS Code로)
notepad .env
```

### **⚡ 4단계: 개발 서버 실행**
```powershell
# 개발 서버 시작 (3000번 포트)
npm run dev

# 브라우저에서 자동 열림 또는 수동 접속
# http://localhost:3000
```

### **🔧 5단계: 포트 충돌 해결 (필요시)**
```powershell
# 3000번 포트가 사용 중인 경우
npx kill-port 3000

# 개발 서버 재시작
npm run dev
```

---

## 🏗️ 프로젝트 구조

```
nuxt-board/
├── 📋 문서 파일들
│   ├── README.md              # 이 파일 (시작 가이드)
│   ├── CLAUDE.md             # SuperClaude 학습 가이드
│   ├── COMMANDS_LOG.md       # 실행 명령어 기록
│   ├── PHASE_GUIDE.md        # Phase별 구현 가이드
│   └── ADVANCED_ROADMAP.md   # 고급 기능 로드맵
│
├── ⚙️ 설정 파일들
│   ├── nuxt.config.ts        # Nuxt 설정 (Tailwind, Pinia 포함)
│   ├── package.json          # 프로젝트 의존성
│   └── .env                  # 환경변수 (DB 연결정보)
│
├── 🎨 프론트엔드
│   ├── pages/                # 📍 파일 기반 라우팅
│   │   ├── index.vue         → "/" (홈 페이지)
│   │   ├── about.vue         → "/about" (소개 페이지) 
│   │   ├── create.vue        → "/create" (게시글 작성)
│   │   └── edit/[id].vue     → "/edit/:id" (게시글 수정)
│   │
│   ├── components/           # 🧩 재사용 컴포넌트
│   │   ├── BoardList.vue     # 게시글 목록
│   │   ├── BoardListSimplified.vue # 간단한 목록
│   │   ├── PhaseCard.vue     # Phase 카드
│   │   ├── WelcomeMessage.vue # 환영 메시지
│   │   ├── ApiTest.vue       # API 테스트
│   │   └── AdminDashboard.vue # 관리자 대시보드
│   │
│   ├── layouts/              # 🏗️ 레이아웃 시스템
│   │   └── default.vue       # 기본 레이아웃 (헤더, 푸터)
│   │
│   ├── stores/               # 🗂️ Pinia 상태 관리
│   │   └── board.ts          # 게시판 상태 관리
│   │
│   └── assets/css/           # 🎨 스타일링
│       └── main.css          # Tailwind CSS 설정
│
├── 🗄️ 백엔드 API
│   └── server/
│       ├── api/board/        # 📡 게시판 API 엔드포인트
│       │   ├── index.get.ts  # GET /api/board (목록 조회)
│       │   ├── index.post.ts # POST /api/board (게시글 작성)
│       │   ├── [id].get.ts   # GET /api/board/:id (상세 조회)
│       │   ├── [id].put.ts   # PUT /api/board/:id (수정)
│       │   └── [id].delete.ts # DELETE /api/board/:id (삭제)
│       │
│       └── utils/            # 🔧 유틸리티 함수
│           └── database.ts   # Oracle DB 연결 관리
│
└── 📦 자동 생성 폴더들
    ├── node_modules/         # 설치된 패키지들
    ├── .nuxt/               # Nuxt 빌드 캐시
    └── public/              # 정적 파일들
```

---

## 🔧 개발 환경 요구사항

### **필수 소프트웨어**
```yaml
Node.js: "18.0.0 이상 (LTS 권장)"
npm: "8.0.0 이상"
```

---

## 📚 API 엔드포인트

### **게시판 API**
```http
GET    /api/board          # 게시글 목록 조회
POST   /api/board          # 새 게시글 작성
GET    /api/board/:id      # 특정 게시글 조회
PUT    /api/board/:id      # 게시글 수정
DELETE /api/board/:id      # 게시글 삭제
```

### **API 테스트 방법**
```powershell
# 1. 개발 서버 실행 후
npm run dev

# 2. 브라우저에서 직접 테스트
# http://localhost:3000/api/board

# 3. 또는 PowerShell에서 curl 사용
curl http://localhost:3000/api/board
```

---

## 🚨 문제 해결 가이드

### **1. 포트 충돌 해결**
```powershell
# 문제: EADDRINUSE :::3000
# 해결: 3000번 포트 사용 프로세스 종료
npx kill-port 3000
npm run dev
```

### **2. Oracle DB 연결 실패**
```powershell
# 문제: ORA-12545: Connect failed
# 해결책:
# 1. Oracle DB 서비스 시작 확인
# 2. .env 파일의 DB 정보 재확인
# 3. 방화벽 설정 확인 (1521 포트)
```

### **3. 의존성 설치 오류**
```powershell
# 문제: npm install 실패
# 해결: 캐시 정리 후 재설치
npm cache clean --force
rm -rf node_modules
npm install
```

### **4. TypeScript 오류**
```powershell
# 문제: Cannot find module 'oracledb'
# 해결: 타입 정의 재설치
npm install @types/oracledb --save-dev
npm run dev
```

---

## 🎯 다음 단계 개발 가이드

### **Phase 5: UX 개선** (추천!)
```powershell
# 검색 기능, 페이지네이션, 반응형 디자인 추가
# 상세 가이드: ADVANCED_ROADMAP.md 참조
```

### **고급 기능 확장**
- 🔐 **JWT 인증 시스템**: 로그인/회원가입
- 📎 **파일 업로드**: 이미지 첨부 기능  
- 💬 **실시간 댓글**: WebSocket 기반
- 🌐 **배포**: Vercel/Netlify 배포

---

## 📖 학습 자료

### **프로젝트 내 가이드**
- **PHASE_GUIDE.md**: Phase별 상세 구현 가이드
- **COMMANDS_LOG.md**: 실행했던 모든 명령어 기록
- **ADVANCED_ROADMAP.md**: Phase 6-10 고급 기능 로드맵
- **CLAUDE.md**: SuperClaude 학습 전문 가이드

### **공식 문서**
- [Nuxt 4 공식 문서](https://nuxt.com/docs)
- [Vue 3 공식 문서](https://vuejs.org/guide/)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)
- [Pinia 상태관리 문서](https://pinia.vuejs.org/)

---

## ✨ 프로젝트 특징

### **🏆 학습 성과**
```yaml
완료된_Phase: "Phase 1-4 (기초부터 CRUD까지)"
학습_기간: "10일 과정 (현재 40% 완료)"
기술_역량: "Nuxt 4 중급 → 실무급 풀스택 개발자"
포트폴리오: "취업 가능 수준의 웹 애플리케이션"
```

### **🚀 실무 경험**
- **파일 기반 라우팅**: pages/ 폴더로 자동 라우팅
- **API 서버**: Nitro 엔진으로 별도 Express 서버 없이 API 구현
- **상태 관리**: Pinia로 현대적인 상태 관리
- **TypeScript**: 완전한 타입 안전성과 자동완성
- **반응형 디자인**: Tailwind CSS로 모바일 최적화

---

**🎉 Nuxt 4로 풀스택 개발의 첫 걸음을 시작해보세요! 🚀**