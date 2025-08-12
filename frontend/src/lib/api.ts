import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// リクエストインターセプター（トークンを自動で付与）
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// レスポンスインターセプター（401エラーの処理）
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message)
    
    if (error.response?.status === 401) {
      console.log('認証エラー: ログインページにリダイレクト')
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      
      // Zustandの状態もクリア
      import('../store/authStore').then(({ useAuthStore }) => {
        useAuthStore.getState().logout()
      })
      
      // 現在のURLがログインページでない場合のみリダイレクト
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api
