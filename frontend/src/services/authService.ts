import api from '../lib/api'
import type { AuthResponse, User } from '../types'

export const authService = {
  signup: async (name: string, email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/signup', {
      user: { name, email, password }
    })
    return response.data
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/login', { email, password })
    return response.data
  },

  me: async (): Promise<{ user: User }> => {
    const response = await api.get('/me')
    return response.data
  },
}
