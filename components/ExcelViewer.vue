<template>
  <div class="excel-viewer glass-dark rounded-3xl border border-white/10 shadow-xl">
    <div class="viewer-header mb-4">
      <h3 class="text-lg font-semibold text-white mb-2">엑셀 데이터</h3>
      <p class="text-slate-300">게시글과 함께 등록된 엑셀 데이터입니다.</p>
    </div>
    
    <div v-if="excelData && excelData.length > 0" class="viewer-content">
      <div class="excel-grid">
        <div v-for="(row, rowIndex) in excelData" :key="rowIndex" class="grid-row">
          <div v-for="(cell, cellIndex) in row" :key="cellIndex" class="grid-cell">
            {{ cell || '' }}
          </div>
        </div>
      </div>
    </div>
    <div v-else class="no-data">
      <div class="text-center py-12">
        <svg class="w-16 h-16 mx-auto text-slate-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
        <p class="text-slate-400 text-lg">등록된 엑셀 데이터가 없습니다</p>
        <p class="text-slate-500 text-sm mt-2">게시글 작성 시 엑셀 데이터를 추가할 수 있습니다</p>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  excelData: {
    type: Array,
    default: () => []
  }
})
</script>

<style scoped>
.excel-viewer {
  padding: 1.5rem;
  overflow: hidden;
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.8) 50%, rgba(55, 48, 163, 0.7) 100%);
  position: relative;
}

.excel-viewer::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 51, 234, 0.08) 100%);
  border-radius: 1.5rem;
  pointer-events: none;
}

.viewer-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 1rem;
  position: relative;
  z-index: 1;
}

.excel-grid {
  display: grid;
  grid-template-columns: repeat(20, minmax(120px, 1fr)); /* 20열, 최소 120px, 최대 자동 */
  gap: 1px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 0.5rem;
  overflow-x: auto; /* 가로 스크롤 */
  overflow-y: hidden; /* 세로 스크롤 숨김 */
  max-width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.05);
  position: relative;
  z-index: 1;
}

.grid-row {
  display: contents;
}

.grid-cell {
  background: rgba(15, 23, 42, 0.7);
  padding: 12px 16px;
  color: #cbd5e1;
  min-height: 48px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  white-space: nowrap; /* 줄바꿈 방지 */
  overflow: hidden; /* 넘치는 텍스트 숨김 */
  text-overflow: ellipsis; /* ...으로 표시 */
  border: 1px solid rgba(255, 255, 255, 0.02);
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.grid-cell:hover {
  background: rgba(30, 41, 59, 0.9);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

/* 첫 번째 행 (헤더) 스타일 */
.grid-row:first-child .grid-cell {
  background: rgba(30, 41, 59, 0.95);
  color: #cbd5e1;
  font-weight: 600;
  text-align: center;
  justify-content: center;
  border-bottom: 2px solid rgba(255, 255, 255, 0.08);
}

.grid-row:first-child .grid-cell:hover {
  background: rgba(51, 65, 85, 0.98);
}

.no-data {
  padding: 2rem;
  text-align: center;
}

/* 스크롤바 스타일링 */
.excel-grid::-webkit-scrollbar {
  height: 8px;
}

.excel-grid::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.excel-grid::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
}

.excel-grid::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .excel-grid {
    grid-template-columns: repeat(10, minmax(100px, 1fr)); /* 모바일에서는 10열 */
  }
  
  .grid-cell {
    padding: 8px 12px;
    min-height: 40px;
    font-size: 13px;
  }
}
</style>
