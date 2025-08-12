import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '../types'

interface AuthState {
  token: string | null
  user: User | null
  isAuthenticated: boolean
  isHydrated: boolean
  setAuth: (token: string, user: User) => void
  logout: () => void
  setHydrated: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      isHydrated: false,
      setAuth: (token, user) => {
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
        set({ token, user, isAuthenticated: true })
      },
      logout: () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        set({ token: null, user: null, isAuthenticated: false })
      },
      setHydrated: () => {
        set({ isHydrated: true })
      },
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        // Zustandの永続化データが復元された後に実行される
        state?.setHydrated()
      },
    }
  )
)
