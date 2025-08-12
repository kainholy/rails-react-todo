import { Stack, Text, Heading } from 'smarthr-ui'
import TodoItem from './TodoItem'
import type { Todo } from '../types'

interface TodoListProps {
  todos: Todo[]
  onUpdate: (id: number, updates: { title?: string; completed?: boolean }) => Promise<void>
  onDelete: (id: number) => Promise<void>
  loading?: boolean
}

const TodoList: React.FC<TodoListProps> = ({ todos, onUpdate, onDelete, loading = false }) => {
  const pendingTodos = todos.filter(todo => !todo.completed)
  const completedTodos = todos.filter(todo => todo.completed)

  if (todos.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
        <Text>まだTodoがありません。新しいTodoを追加してみましょう！</Text>
      </div>
    )
  }

  return (
    <Stack gap={2}>
      {/* 未完了のTodo */}
      {pendingTodos.length > 0 && (
        <div>
          <Heading type="sectionTitle">
            未完了 ({pendingTodos.length})
          </Heading>
          <Stack gap={1}>
            {pendingTodos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onUpdate={onUpdate}
                onDelete={onDelete}
                loading={loading}
              />
            ))}
          </Stack>
        </div>
      )}

      {/* 完了済みのTodo */}
      {completedTodos.length > 0 && (
        <div>
          <Heading type="sectionTitle">
            完了済み ({completedTodos.length})
          </Heading>
          <Stack gap={1}>
            {completedTodos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onUpdate={onUpdate}
                onDelete={onDelete}
                loading={loading}
              />
            ))}
          </Stack>
        </div>
      )}
    </Stack>
  )
}

export default TodoList
