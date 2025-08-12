import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

interface GuardedRouteProps {
  children: React.ReactNode
}

const GuardedRoute: React.FC<GuardedRouteProps> = ({ children }) => {
  const { isAuthenticated, isHydrated } = useAuthStore()

  // Zustandの永続化データが復元されるまで待つ
  if (!isHydrated) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        Loading...
      </div>
    )
  }

  // 復元完了後、認証されていない場合はログインページへ
  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  return <>{children}</>
}

export default GuardedRoute
