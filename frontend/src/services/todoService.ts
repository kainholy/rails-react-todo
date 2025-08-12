import api from '../lib/api'
import type { Todo } from '../types'

export const todoService = {
  // Todo一覧取得
  getTodos: async (): Promise<Todo[]> => {
    const response = await api.get('/todos')
    return response.data.todos
  },

  // Todo作成
  createTodo: async (title: string): Promise<Todo> => {
    const response = await api.post('/todos', {
      todo: { title }
    })
    return response.data.todo
  },

  // Todo更新（完了状態切り替え、タイトル変更）
  updateTodo: async (id: number, updates: { title?: string; completed?: boolean }): Promise<Todo> => {
    const response = await api.patch(`/todos/${id}`, {
      todo: updates
    })
    return response.data.todo
  },

  // Todo削除
  deleteTodo: async (id: number): Promise<void> => {
    await api.delete(`/todos/${id}`)
  },
}
