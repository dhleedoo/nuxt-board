<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 py-4 px-4">
    <div class="max-w-6xl mx-auto space-y-4">
      <!-- WelcomeMessage 컴포넌트 - import 없이 바로 사용! -->
      <WelcomeMessage 
        title="🎉 Nuxt 4 풀스택 프로젝트 완성! 🚀"
        subtitle="Oracle DB + 모던 UI/UX를 갖춘 완전한 게시판 시스템을 구축했습니다!"
      />
      
      <!-- Phase 카드들 - PhaseCard 컴포넌트 재사용 -->
      <div class="phases-grid">
      <PhaseCard
        phase-number="Phase 1"
        title="Nuxt 기초 체득"
        description="파일 기반 라우팅과 핫 리로드의 신기함을 체험했습니다"
        :is-completed="true"
        :achievements="[
          'Nuxt 프로젝트 생성',
          '파일 기반 라우팅 이해',
          '핫 리로드 체험',
          '페이지 간 이동 구현',
          '.nuxt 폴더 역할 이해'
        ]"
      />
      
      <PhaseCard
        phase-number="Phase 2"
        title="프로젝트 구조화"
        description="컴포넌트와 레이아웃 시스템으로 재사용성을 완벽 구현했습니다"
        :is-completed="true"
        :achievements="[
          'layouts 폴더 및 공통 레이아웃 구축',
          '재사용 컴포넌트 시스템 완성',
          '자동 import 체험 완료',
          '모던 네비게이션 시스템 구축'
        ]"
      />

      <PhaseCard
        phase-number="Phase 3"
        title="Oracle DB 연동"
        description="완전한 CRUD API와 데이터베이스 연동을 성공했습니다"
        :is-completed="true"
        :achievements="[
          'Oracle DB 연결 풀 구축',
          'RESTful API 설계 및 구현',
          '완전한 CRUD 기능 구현',
          '에러 처리 및 유효성 검사'
        ]"
      />

      <PhaseCard
        phase-number="Phase 4"
        title="모던 UI/UX 구현"
        description="Tailwind CSS와 Glassmorphism을 적용한 최신 디자인을 완성했습니다"
        :is-completed="true"
        :achievements="[
          'Tailwind CSS 통합',
          'Glassmorphism 디자인 적용',
          '다양한 로딩 애니메이션',
          '스태거 애니메이션 및 마이크로 인터랙션'
        ]"
      />
      </div>
      
      <!-- Phase 3 API 테스트 섹션 -->
      <ApiTest />
      
      <!-- 기존 게시판 컴포넌트 -->
      <div class="bg-red-900/10 border border-red-500/20 rounded-2xl p-4">
        <BoardList />
      </div>
      
      <!-- Pinia 기반 게시판 컴포넌트 (새로 추가) -->
      <div class="bg-green-900/10 border border-green-500/20 rounded-2xl p-4">
        <BoardListSimplified />
      </div>
      
      <!-- Pinia 실무적 이점 시연 컴포넌트 -->
      <div class="bg-purple-900/10 border border-purple-500/20 rounded-2xl p-4">
        <AdminDashboard />
      </div>
      
      <!-- 완성 배너 -->
      <div class="completion-banner">
        <h3>🎉 모든 Phase 완성! 축하합니다! 🎉</h3>
        <p><strong>Nuxt 4 풀스택 게시판 시스템</strong> - 실무급 포트폴리오 프로젝트 완성!</p>
        <div class="achievement-stats">
          <div class="stat">
            <span class="number">4</span>
            <span class="label">Phase 완료</span>
          </div>
          <div class="stat">
            <span class="number">100%</span>
            <span class="label">CRUD 구현</span>
          </div>
          <div class="stat">
            <span class="number">15+</span>
            <span class="label">기능 구현</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.phases-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
}

.completion-banner {
  @apply bg-white/15 backdrop-blur-2xl border border-white/30 shadow-2xl rounded-3xl p-8 text-center;
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.1), rgba(139, 195, 74, 0.1));
  border: 1px solid rgba(76, 175, 80, 0.3);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05);
}

.completion-banner h3 {
  @apply text-2xl font-bold text-green-300 mb-4;
}

.completion-banner p {
  @apply text-lg text-green-200 mb-6;
}

.achievement-stats {
  @apply flex justify-center gap-8 mt-4;
}

.stat {
  @apply flex flex-col items-center p-4 rounded-xl min-w-24;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.stat .number {
  @apply text-3xl font-bold text-white leading-none;
}

.stat .label {
  @apply text-sm text-green-200 mt-2 font-medium;
}

@media (max-width: 768px) {
  .achievement-stats {
    @apply flex-col gap-4;
  }
  
  .stat {
    @apply mx-auto max-w-48;
  }
  
  .phases-grid {
    grid-template-columns: 1fr;
  }
}
</style>