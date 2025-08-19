<template>
  <div>
    <h1>📖 소개 페이지</h1>
    <p>이 페이지는 <code>/pages/about.vue</code> 파일로 만들어졌습니다!</p>
    
    <div class="magic-box">
      <h2>🎯 파일 기반 라우팅의 마법</h2>
      <ul>
        <li>✅ <code>pages/index.vue</code> → <code>/</code> 경로</li>
        <li>✅ <code>pages/about.vue</code> → <code>/about</code> 경로</li>
        <li>🚀 라우터 설정 파일 불필요!</li>
        <li>📁 파일 구조 = URL 구조</li>
      </ul>
    </div>
    
    <nav>
      <NuxtLink to="/">🏠 홈으로 돌아가기</NuxtLink>
    </nav>
  </div>
</template>

<style scoped>
h1 {
  color: #00DC82;
  text-align: center;
}

.magic-box {
  background: #f8f9fa;
  border-left: 4px solid #00DC82;
  padding: 1.5rem;
  margin: 2rem 0;
  border-radius: 4px;
}

.magic-box h2 {
  margin-top: 0;
  color: #333;
}

.magic-box ul {
  margin: 1rem 0;
}

.magic-box li {
  margin: 0.5rem 0;
  font-family: 'Courier New', monospace;
}

code {
  background: #e9ecef;
  padding: 2px 4px;
  border-radius: 3px;
  font-family: 'Courier New', monospace;
}

nav {
  text-align: center;
  margin-top: 2rem;
}

nav a {
  color: #0066cc;
  text-decoration: none;
  font-weight: bold;
  font-size: 1.1rem;
}

nav a:hover {
  text-decoration: underline;
}
</style>