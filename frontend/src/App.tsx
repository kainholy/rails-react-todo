import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import TodoPage from './pages/TodoPage'
import GuardedRoute from './components/GuardedRoute'
import './App.css'

function App() {
  const { isAuthenticated, isHydrated } = useAuthStore()

  // Zustandの永続化データが復元されるまで待つ
  if (!isHydrated) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        Loading...
      </div>
    )
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/todos" /> : <LoginPage />} 
        />
        <Route 
          path="/signup" 
          element={isAuthenticated ? <Navigate to="/todos" /> : <SignupPage />} 
        />
        <Route 
          path="/todos" 
          element={
            <GuardedRoute>
              <TodoPage />
            </GuardedRoute>
          } 
        />
        <Route path="/" element={<Navigate to="/todos" />} />
      </Routes>
    </Router>
  )
}

export default App
