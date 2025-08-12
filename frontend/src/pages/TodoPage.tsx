import { useState, useEffect } from 'react'
import { Button, Heading, Text, Container, Stack, Cluster } from 'smarthr-ui'
import { useAuthStore } from '../store/authStore'
import { todoService } from '../services/todoService'
import AddTodoForm from '../components/AddTodoForm'
import TodoList from '../components/TodoList'
import type { Todo } from '../types'

const TodoPage: React.FC = () => {
  const { user, logout } = useAuthStore()
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 初回マウント時にTodo一覧を取得
  useEffect(() => {
    loadTodos()
  }, [])

  const loadTodos = async () => {
    try {
      setError(null)
      const todoList = await todoService.getTodos()
      setTodos(todoList)
    } catch (err) {
      setError('Todoの読み込みに失敗しました')
      console.error('Todo読み込みエラー:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddTodo = async (title: string) => {
    setActionLoading(true)
    try {
      const newTodo = await todoService.createTodo(title)
      setTodos(prev => [newTodo, ...prev]) // 新しいTodoを先頭に追加
    } catch (err) {
      console.error('Todo作成エラー:', err)
      throw err // AddTodoFormのエラー処理に任せる
    } finally {
      setActionLoading(false)
    }
  }

  const handleUpdateTodo = async (id: number, updates: { title?: string; completed?: boolean }) => {
    try {
      const updatedTodo = await todoService.updateTodo(id, updates)
      setTodos(prev => prev.map(todo => 
        todo.id === id ? updatedTodo : todo
      ))
    } catch (err) {
      console.error('Todo更新エラー:', err)
      throw err
    }
  }

  const handleDeleteTodo = async (id: number) => {
    try {
      await todoService.deleteTodo(id)
      setTodos(prev => prev.filter(todo => todo.id !== id))
    } catch (err) {
      console.error('Todo削除エラー:', err)
      throw err
    }
  }

  const handleLogout = () => {
    logout()
  }

  if (loading) {
    return (
      <Container>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <Text>読み込み中...</Text>
        </div>
      </Container>
    )
  }

  return (
    <Container>
      <Stack gap={2}>
        {/* ヘッダー */}
        <Cluster justify="space-between" align="center">
          <Heading type="blockTitle">Todo App</Heading>
          <Cluster gap={1} align="center">
            <Text>こんにちは、{user?.name}さん</Text>
            <Button variant="secondary" onClick={handleLogout}>
              ログアウト
            </Button>
          </Cluster>
        </Cluster>

        {/* エラー表示 */}
        {error && (
          <div style={{ padding: '1rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '4px' }}>
            <Text color="DANGER">{error}</Text>
            <Button 
              size="s" 
              variant="secondary" 
              onClick={loadTodos}
              style={{ marginTop: '0.5rem' }}
            >
              再読み込み
            </Button>
          </div>
        )}

        {/* Todo追加フォーム */}
        <div>
          <Heading type="sectionTitle">新しいTodoを追加</Heading>
          <AddTodoForm onAdd={handleAddTodo} loading={actionLoading} />
        </div>

        {/* Todo一覧 */}
        <div>
          <TodoList 
            todos={todos}
            onUpdate={handleUpdateTodo}
            onDelete={handleDeleteTodo}
            loading={actionLoading}
          />
        </div>

        {/* 統計情報 */}
        {todos.length > 0 && (
          <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
            <Text size="S" color="TEXT_GREY">
              全{todos.length}件 | 完了{todos.filter(t => t.completed).length}件 | 
              未完了{todos.filter(t => !t.completed).length}件
            </Text>
          </div>
        )}
      </Stack>
    </Container>
  )
}

export default TodoPage
