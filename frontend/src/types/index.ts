export interface User {
  id: number
  name: string
  email: string
}

export interface Todo {
  id: number
  title: string
  completed: boolean
  user_id: number
  created_at: string
  updated_at: string
}

export interface AuthResponse {
  user: User
  token: string
}

export interface TodosResponse {
  todos: Todo[]
}

export interface TodoResponse {
  todo: Todo
}
