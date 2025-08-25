<template>
  <!-- 
    BoardForm 컴포넌트
    - 게시글 생성/수정을 위한 폼 컴포넌트
    - 제목, 내용, 엑셀 데이터를 입력받음
    - ExcelEditor 컴포넌트를 통합하여 엑셀 형태의 데이터 입력 지원
  -->
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- ========================================
         제목 입력 영역
         ======================================== -->
    <div class="glass-dark rounded-2xl p-6 border border-white/10">
      <label :for="titleId" class="block text-sm font-semibold text-white mb-3">
        {{ titleLabel }} <span class="text-red-500">*</span>
      </label>
      <div class="relative">
        <input
          :id="titleId"
          v-model="form.title"
          type="text"
          :placeholder="titlePlaceholder"
          class="w-full px-4 py-4 bg-slate-800/50 border border-slate-600/50 rounded-xl
                 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500
                 transition-all duration-300 placeholder-slate-400 text-lg font-medium text-white"
          :class="{ 'border-red-300 focus:border-red-500 focus:ring-red-500/20': errors.title }"
        />
        <!-- 글자 수 표시 -->
        <div class="absolute right-4 top-4 text-sm text-slate-400">
          {{ form.title.length }}/{{ titleMaxLength }}
        </div>
      </div>
      <!-- 제목 오류 메시지 -->
      <p v-if="errors.title" class="text-red-500 text-sm mt-2 flex items-center gap-1">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
        </svg>
        {{ errors.title }}
      </p>
    </div>

    <!-- ========================================
         내용 입력 영역
         ======================================== -->
    <div class="glass-dark rounded-2xl p-6 border border-white/10">
      <label :for="contentId" class="block text-sm font-semibold text-white mb-3">
        {{ contentLabel }} <span class="text-red-500">*</span>
      </label>
      <div class="relative">
        <textarea
          :id="contentId"
          v-model="form.content"
          rows="12"
          :placeholder="contentPlaceholder"
          class="w-full px-4 py-4 bg-slate-800/50 border border-slate-600/50 rounded-xl
                 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500
                 transition-all duration-300 placeholder-slate-400 leading-relaxed resize-none text-white"
          :class="{ 'border-red-300 focus:border-red-500 focus:ring-red-500/20': errors.content }"
        ></textarea>
        <!-- 글자 수 표시 -->
        <div class="absolute right-4 bottom-4 text-sm text-slate-400">
          {{ form.content.length }}/{{ contentMaxLength }}
        </div>
      </div>
      <!-- 내용 오류 메시지 -->
      <p v-if="errors.content" class="text-red-500 text-sm mt-2 flex items-center gap-1">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
        </svg>
        {{ errors.content }}
      </p>
    </div>

    <!-- ========================================
         ExcelEditor 컴포넌트 - 엑셀 데이터 입력 영역
         ======================================== -->
    <div class="safe-container">
      <div class="mb-4">
        <h3 class="text-lg font-semibold text-white mb-2">엑셀 데이터</h3>
        <p class="text-slate-300 text-sm">추가 데이터를 엑셀 형태로 입력하세요</p>
      </div>
      
      <!-- ExcelEditor 컴포넌트 사용 -->
      <ExcelEditor
        ref="excelEditor"
        :editable="true"
        :initial-data="form.excelData"
      />
    </div>

    <!-- ========================================
         버튼 영역
         ======================================== -->
    <div class="glass-dark rounded-2xl p-6 border border-white/10">
      <div class="flex flex-col sm:flex-row gap-4 sm:justify-end">
        <!-- 취소 버튼 -->
        <button
          type="button"
          @click="$emit('cancel')"
          class="btn-secondary order-2 sm:order-1"
          :disabled="submitting"
        >
          {{ cancelButtonText }}
        </button>
        
        <!-- 저장 버튼 -->
        <button
          type="submit"
          class="btn-primary order-1 sm:order-2 flex items-center justify-center gap-2"
          :disabled="submitting || !isFormValid"
        >
          <!-- 로딩 스피너 -->
          <svg v-if="submitting" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
          <!-- 저장 아이콘 -->
          <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
          </svg>
          {{ submitting ? submittingText : submitButtonText }}
        </button>
      </div>
    </div>
  </form>
</template>

<script setup>
  // ========================================
  // Vue 3 Composition API imports
  // ========================================
  import { ref, computed, watch, getCurrentInstance } from 'vue'
  import ExcelEditor from './ExcelEditor.vue'

  // ========================================
  // Props 정의
  // ========================================
  const props = defineProps({
    // 폼 모드 (생성/수정)
    mode: {
      type: String,
      required: true,
      validator: (value) => ['create', 'edit'].includes(value)
    },
    // 제목 관련 props
    titleLabel: {
      type: String,
      default: '제목'
    },
    titlePlaceholder: {
      type: String,
      default: '제목을 입력하세요...'
    },
    titleMaxLength: {
      type: Number,
      default: 100
    },
    // 내용 관련 props
    contentLabel: {
      type: String,
      default: '내용'
    },
    contentPlaceholder: {
      type: String,
      default: '내용을 작성하세요...'
    },
    contentMaxLength: {
      type: Number,
      default: 2000
    },
    // 버튼 텍스트 props
    submitButtonText: {
      type: String,
      default: '저장'
    },
    submittingText: {
      type: String,
      default: '저장 중...'
    },
    cancelButtonText: {
      type: String,
      default: '취소'
    },
    // 초기 데이터
    initialData: {
      type: Object,
      default: () => ({ title: '', content: '', excelData: [] })
    }
  })

  // ========================================
  // 이벤트 정의
  // ========================================
  const emit = defineEmits(['submit', 'cancel'])

  // ========================================
  // 반응형 데이터
  // ========================================
  // 폼 데이터
  const form = ref({
    title: props.initialData?.title || '',
    content: props.initialData?.content || '',
    excelData: props.initialData?.excelData || []
  })

  // 에러 상태
  const errors = ref({
    title: '',
    content: ''
  })

  // 제출 상태
  const submitting = ref(false)

  // ========================================
  // 고유 ID 생성 (접근성 향상)
  // ========================================
  const titleId = `title-${Math.random().toString(36).substr(2, 9)}`
  const contentId = `content-${Math.random().toString(36).substr(2, 9)}`

  // ========================================
  // 디버깅: 초기 데이터 확인
  // ========================================
  console.log('🔍 BoardForm 초기 데이터:', props.initialData);
  console.log('🔍 form.excelData 초기값:', form.value.excelData);

  // ========================================
  // 계산된 속성
  // ========================================
  // 폼 유효성 검사
  const isFormValid = computed(() => {
    return form.value.title.trim().length > 0 && 
           form.value.content.trim().length > 0 &&
           form.value.title.length <= props.titleMaxLength &&
           form.value.content.length <= props.contentMaxLength
  })

  // ========================================
  // 감시자 (Watchers)
  // ========================================
  // 제목 실시간 유효성 검사
  watch(() => form.value.title, (newTitle) => {
    if (newTitle.trim().length === 0) {
      errors.value.title = '제목을 입력해주세요.'
    } else if (newTitle.length > props.titleMaxLength) {
      errors.value.title = `제목은 ${props.titleMaxLength}자 이내로 입력해주세요.`
    } else {
      errors.value.title = ''
    }
  })

  // 내용 실시간 유효성 검사
  watch(() => form.value.content, (newContent) => {
    if (newContent.trim().length === 0) {
      errors.value.content = '내용을 입력해주세요.'
    } else if (newContent.length > props.contentMaxLength) {
      errors.value.content = `내용은 ${props.contentMaxLength}자 이내로 입력해주세요.`
    } else {
      errors.value.content = ''
    }
  })

  // ========================================
  // 메서드
  // ========================================
  /**
   * 폼 제출 처리
   * - ExcelEditor에서 현재 데이터를 가져와서 부모 컴포넌트에 전달
   * - 여러 방법으로 ExcelEditor 컴포넌트 인스턴스에 접근 시도
   */
  const handleSubmit = async () => {
    if (!isFormValid.value) return
    
    console.log('🚀 BoardForm handleSubmit 시작');
    submitting.value = true
    
    // ExcelEditor에서 현재 데이터를 가져옴 (저장 시에만)
    let currentExcelData = []
    
    try {
      // ========================================
      // 방법 1: ref를 통한 직접 접근
      // ========================================
      const excelEditor = getCurrentInstance()?.refs.excelEditor
      console.log('🔍 ExcelEditor ref (방법1):', excelEditor);
      
      if (excelEditor && typeof excelEditor.saveData === 'function') {
        console.log('✅ ExcelEditor.saveData 메서드 존재 확인');
        // saveData가 Promise를 반환하므로 await 사용
        currentExcelData = await excelEditor.saveData() || []
        console.log('💾 ExcelEditor.saveData 결과:', currentExcelData);
        console.log('📊 결과 데이터 타입:', typeof currentExcelData);
        console.log('📊 결과 데이터 길이:', currentExcelData.length);
      } else {
        console.warn('⚠️ ExcelEditor ref 또는 saveData 메서드가 없습니다');
        
        // ========================================
        // 방법 2: DOM을 통한 간접 접근 (Vue 3 방식)
        // ========================================
        const excelEditorElement = document.querySelector('[data-excel-editor]')
        console.log('🔍 ExcelEditor DOM 요소 (방법2):', excelEditorElement);
        
        if (excelEditorElement) {
          // Vue 3에서 컴포넌트 인스턴스에 접근하는 여러 방법 시도
          let component = null;
          
          // 방법 2-1: __vueParentComponent
          if (excelEditorElement.__vueParentComponent) {
            const vueComponent = excelEditorElement.__vueParentComponent;
            console.log('🔍 Vue 컴포넌트 전체:', vueComponent);
            
            // 여러 방법으로 saveData 메서드 찾기
            if (vueComponent.exposed && typeof vueComponent.exposed.saveData === 'function') {
              component = vueComponent.exposed;
              console.log('✅ 방법 2-1a (exposed):', component);
            } else if (vueComponent.ctx && typeof vueComponent.ctx.saveData === 'function') {
              component = vueComponent.ctx;
              console.log('✅ 방법 2-1b (ctx):', component);
            } else if (vueComponent.proxy && typeof vueComponent.proxy.saveData === 'function') {
              component = vueComponent.proxy;
              console.log('✅ 방법 2-1c (proxy):', component);
            } else {
              console.log('🔍 Vue 컴포넌트 구조:', {
                exposed: vueComponent.exposed,
                ctx: vueComponent.ctx,
                proxy: vueComponent.proxy,
                hasExposed: !!vueComponent.exposed,
                hasCtx: !!vueComponent.ctx,
                hasProxy: !!vueComponent.proxy
              });
            }
          }
          
          // 방법 2-2: __vue_app__
          if (!component && excelEditorElement.__vue_app__) {
            component = excelEditorElement.__vue_app__;
            console.log('🔍 방법 2-2 (__vue_app__):', component);
          }
          
          // 방법 2-3: 모든 Vue 관련 속성 확인
          if (!component) {
            const vueProps = Object.getOwnPropertyNames(excelEditorElement).filter(prop => prop.startsWith('__vue'));
            console.log('🔍 Vue 관련 속성들:', vueProps);
            
            for (const prop of vueProps) {
              console.log(`🔍 ${prop}:`, excelEditorElement[prop]);
            }
          }
          
          if (component && typeof component.saveData === 'function') {
            console.log('✅ ExcelEditor.saveData 메서드 발견 (방법2)');
            currentExcelData = await component.saveData() || []
            console.log('💾 ExcelEditor.saveData 결과 (방법2):', currentExcelData);
          } else {
            console.warn('⚠️ ExcelEditor 컴포넌트 또는 saveData 메서드를 찾을 수 없습니다');
          }
        }
        
        // ========================================
        // 방법 3: fallback - 기존 데이터 사용
        // ========================================
        if (currentExcelData.length === 0) {
          console.log('🔄 fallback: 기존 form.excelData 사용');
          currentExcelData = form.value.excelData
        }
      }
    } catch (error) {
      console.error('❌ Excel 데이터 가져오기 실패:', error);
      currentExcelData = form.value.excelData // fallback
    }
    
    // ========================================
    // 제출할 데이터 구성 및 전송
    // ========================================
    // 디버깅: 제출할 데이터 확인
    const submitData = {
      title: form.value.title.trim(),
      content: form.value.content.trim(),
      excelData: currentExcelData
    }
    
    console.log('📤 BoardForm 제출 데이터:', submitData)
    console.log('📊 제출할 엑셀 데이터:', submitData.excelData)
    console.log('📊 엑셀 데이터 타입:', typeof submitData.excelData)
    console.log('📊 엑셀 데이터 길이:', submitData.excelData.length)
    
    try {
      // 부모 컴포넌트에 데이터 전달
      emit('submit', submitData)
      console.log('✅ submit 이벤트 발생 완료');
    } catch (error) {
      console.error('폼 제출 실패:', error)
    } finally {
      submitting.value = false
    }
  }

  // ========================================
  // 외부에서 제출 상태 제어할 수 있도록 expose
  // ========================================
  defineExpose({
    // 제출 상태 설정
    setSubmitting: (value) => {
      submitting.value = value
    },
    // 폼 초기화
    resetForm: () => {
      form.value.title = props.initialData?.title || ''
      form.value.content = props.initialData?.content || ''
      form.value.excelData = props.initialData?.excelData || []
      errors.value.title = ''
      errors.value.content = ''
    }
  })
</script>

<style scoped>
  /* 
    BoardForm 컴포넌트 스타일
    - 기존 스타일은 부모 컴포넌트에서 상속받음
    - 안전한 엑셀 컨테이너 스타일 적용
  */

  /* 
    안전한 엑셀 컨테이너 스타일
    - glass-dark와 유사하지만 문제 없는 속성들만 사용
    - 스크롤 문제를 일으키지 않는 안전한 속성들만 사용
  */
  .safe-container {
    background: rgba(30, 41, 59, 0.5);
    border-radius: 1rem;
    padding: 1.5rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
    /* 
      제거된 속성들:
      - position: relative 제거
      - transform 제거  
      - backdrop-filter 제거
    */
    /* 
      스크롤 문제를 일으키지 않는 안전한 속성들만 사용
    */
    overflow: hidden; /* SpreadJS가 컨테이너를 벗어나지 않도록 */
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1); /* 강한 음영 효과 */
  }
</style>