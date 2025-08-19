// stores/board.ts - 게시판 전용 Pinia 스토어
import { defineStore } from 'pinia'

// 게시글 타입 정의 (TypeScript 활용)
interface BoardPost {
  BOARD_ID: number
  TITLE: string
  CONTENT: string
  CREATED_AT: string
}

// API 응답 타입 정의
interface BoardResponse {
  success: boolean
  data: BoardPost[]
  message?: string
  pagination?: {
    page: number
    totalCount: number
    totalPages: number
  }
  meta?: {
    timestamp: string
  }
}

// 단일 게시글 API 응답 타입
interface SingleBoardResponse {
  success: boolean
  data: BoardPost
  message?: string
}

// 스토어 상태 타입 정의
interface BoardState {
  // 게시글 데이터
  posts: BoardPost[]
  selectedPost: BoardPost | null
  
  // UI 상태
  loading: boolean
  error: string | null
  
  // 페이지네이션 상태
  currentPage: number
  totalPages: number
  totalCount: number
  itemsPerPage: number
  
  // 검색 상태
  searchKeyword: string
  
  // 메타 정보
  lastUpdate: string
}

export const useBoardStore = defineStore('board', {
  // 🎯 상태 정의 (state)
  state: (): BoardState => ({
    // 게시글 데이터
    posts: [],
    selectedPost: null,
    
    // UI 상태
    loading: false,
    error: null,
    
    // 페이지네이션 상태
    currentPage: 1,
    totalPages: 0,
    totalCount: 0,
    itemsPerPage: 3,
    
    // 검색 상태  
    searchKeyword: '',
    
    // 메타 정보
    lastUpdate: ''
  }),

  // 🎯 계산된 속성 (getters)
  getters: {
    // 현재 페이지에 표시할 페이지 번호들 (최대 5개)
    visiblePages: (state): number[] => {
      const pages: number[] = []
      const maxVisible = 5
      let start = Math.max(1, state.currentPage - Math.floor(maxVisible / 2))
      let end = Math.min(state.totalPages, start + maxVisible - 1)
      
      if (end - start < maxVisible - 1) {
        start = Math.max(1, end - maxVisible + 1)
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      
      return pages
    },

    // 검색 중인지 여부
    isSearching: (state): boolean => {
      return state.searchKeyword.trim().length > 0
    },

    // 데이터가 있는지 여부
    hasPosts: (state): boolean => {
      return state.posts.length > 0
    },

    // 페이지네이션이 필요한지 여부
    needsPagination: (state): boolean => {
      return state.totalPages > 1
    }
  },

  // 🎯 액션 (actions) - 비동기 처리 포함
  actions: {
    // 게시글 목록 로드
    async fetchPosts(page: number = 1): Promise<void> {
      this.loading = true
      this.error = null

      try {
        // 🔥 테스트용: 로딩 상태를 2초간 유지
        // await new Promise(resolve => setTimeout(resolve, 2000))
        // API 호출 파라미터 구성
        const params = new URLSearchParams({
          page: page.toString(),
          limit: this.itemsPerPage.toString()
        })

        // 검색 키워드가 있으면 추가
        if (this.searchKeyword.trim()) {
          params.append('keyword', this.searchKeyword.trim())
        }

        // API 호출
        const response: BoardResponse = await $fetch(`/api/board?${params}`)

        if (response.success) {
          // 상태 업데이트
          this.posts = response.data
          this.lastUpdate = response.meta?.timestamp || new Date().toLocaleString('ko-KR', {
            timeZone: 'Asia/Seoul'
          })
          
          // 페이지네이션 정보 업데이트
          if (response.pagination) {
            this.currentPage = response.pagination.page
            this.totalCount = response.pagination.totalCount
            this.totalPages = response.pagination.totalPages
          }
        } else {
          throw new Error(response.message || '데이터 로드 실패')
        }
      } catch (err: any) {
        this.error = err.message || 'API 호출 중 오류가 발생했습니다.'
        console.error('게시글 로드 실패:', err)
      } finally {
        this.loading = false
      }
    },

    // 특정 게시글 상세 로드
    async fetchPost(postId: number): Promise<BoardPost | null> {
      try {
        const response: SingleBoardResponse = await $fetch(`/api/board/${postId}`)
        if (response.success) {
          this.selectedPost = response.data
          return response.data
        }
        throw new Error(response.message || '게시글 로드 실패')
      } catch (err: any) {
        this.error = err.message || '게시글 로드 실패'
        console.error('게시글 상세 로드 실패:', err)
        return null
      }
    },

    // 게시글 삭제
    async deletePost(postId: number): Promise<boolean> {
      try {
        this.loading = true
        const response: { success: boolean; message?: string } = await $fetch(`/api/board/${postId}`, {
          method: 'DELETE'
        })

        if (response.success) {
          // 로컬 상태에서 게시글 제거
          this.posts = this.posts.filter(post => post.BOARD_ID !== postId)
          this.totalCount = Math.max(0, this.totalCount - 1)
          
          // 현재 페이지에 게시글이 없고 이전 페이지가 있다면 이전 페이지로 이동
          if (this.posts.length === 0 && this.currentPage > 1) {
            await this.fetchPosts(this.currentPage - 1)
          }
          
          return true
        }
        
        throw new Error(response.message || '삭제 실패')
      } catch (err: any) {
        this.error = err.message || '삭제 중 오류가 발생했습니다.'
        console.error('게시글 삭제 실패:', err)
        return false
      } finally {
        this.loading = false
      }
    },

    // 페이지 변경
    async changePage(page: number): Promise<void> {
      if (page >= 1 && page <= this.totalPages) {
        await this.fetchPosts(page)
      }
    },

    // 검색 실행
    async performSearch(keyword?: string): Promise<void> {
      this.searchKeyword = (keyword ?? this.searchKeyword).trim()
      this.currentPage = 1
      await this.fetchPosts(1)
    },

    // 검색 초기화
    async clearSearch(): Promise<void> {
      this.searchKeyword = ''
      this.currentPage = 1
      await this.fetchPosts(1)
    },

    // 데이터 새로고침
    async refreshPosts(): Promise<void> {
      await this.fetchPosts(this.currentPage)
    },

    // 선택된 게시글 초기화
    clearSelectedPost(): void {
      this.selectedPost = null
    },

    // 에러 상태 초기화
    clearError(): void {
      this.error = null
    },

    // 전체 상태 초기화
    resetState(): void {
      this.$reset()
    }
  }
})