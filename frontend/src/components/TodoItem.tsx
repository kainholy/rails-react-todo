import { useState } from 'react'
import { Button, Checkbox, Input, Text, Cluster, Stack } from 'smarthr-ui'
import type { Todo } from '../types'

interface TodoItemProps {
  todo: Todo
  onUpdate: (id: number, updates: { title?: string; completed?: boolean }) => Promise<void>
  onDelete: (id: number) => Promise<void>
  loading?: boolean
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onUpdate, onDelete, loading = false }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(todo.title)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleToggleComplete = async () => {
    if (loading || isUpdating) return
    
    setIsUpdating(true)
    try {
      await onUpdate(todo.id, { completed: !todo.completed })
    } catch (error) {
      console.error('完了状態の更新に失敗しました:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleSaveEdit = async () => {
    if (!editTitle.trim() || editTitle === todo.title) {
      setIsEditing(false)
      setEditTitle(todo.title)
      return
    }

    setIsUpdating(true)
    try {
      await onUpdate(todo.id, { title: editTitle.trim() })
      setIsEditing(false)
    } catch (error) {
      console.error('タイトルの更新に失敗しました:', error)
      setEditTitle(todo.title)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditTitle(todo.title)
  }

  const handleDelete = async () => {
    if (loading || isUpdating) return
    
    if (window.confirm('このTodoを削除しますか？')) {
      setIsUpdating(true)
      try {
        await onDelete(todo.id)
      } catch (error) {
        console.error('削除に失敗しました:', error)
        setIsUpdating(false)
      }
    }
  }

  return (
    <div style={{ 
      padding: '1rem', 
      border: '1px solid #e0e0e0', 
      borderRadius: '4px',
      backgroundColor: todo.completed ? '#f5f5f5' : 'white'
    }}>
      <Cluster justify="space-between" align="center">
        <Cluster gap={1} align="center" style={{ flex: 1 }}>
          <Checkbox
            checked={todo.completed}
            onChange={handleToggleComplete}
            disabled={loading || isUpdating || isEditing}
          />
          
          {isEditing ? (
            <div style={{ flex: 1 }}>
              <Stack gap={0.5}>
                <Input
                  type="text"
                  value={editTitle}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditTitle(e.target.value)}
                  disabled={isUpdating}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveEdit()
                    if (e.key === 'Escape') handleCancelEdit()
                  }}
                  autoFocus
                />
                <Cluster gap={0.5}>
                  <Button
                    size="s"
                    variant="primary"
                    onClick={handleSaveEdit}
                    disabled={isUpdating || !editTitle.trim()}
                    loading={isUpdating}
                  >
                    保存
                  </Button>
                  <Button
                    size="s"
                    variant="secondary"
                    onClick={handleCancelEdit}
                    disabled={isUpdating}
                  >
                    キャンセル
                  </Button>
                </Cluster>
              </Stack>
            </div>
          ) : (
            <Text 
              style={{ 
                flex: 1,
                textDecoration: todo.completed ? 'line-through' : 'none',
                color: todo.completed ? '#666' : 'inherit'
              }}
            >
              {todo.title}
            </Text>
          )}
        </Cluster>

        {!isEditing && (
          <Cluster gap={0.5}>
            <Button
              size="s"
              variant="secondary"
              onClick={() => setIsEditing(true)}
              disabled={loading || isUpdating}
            >
              編集
            </Button>
            <Button
              size="s"
              variant="danger"
              onClick={handleDelete}
              disabled={loading || isUpdating}
              loading={isUpdating}
            >
              削除
            </Button>
          </Cluster>
        )}
      </Cluster>
    </div>
  )
}

export default TodoItem
