import { useState } from 'react'
import { Button, Input, Stack, Text } from 'smarthr-ui'

interface AddTodoFormProps {
  onAdd: (title: string) => Promise<void>
  loading?: boolean
}

const AddTodoForm: React.FC<AddTodoFormProps> = ({ onAdd, loading = false }) => {
  const [title, setTitle] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim()) {
      setError('Todoのタイトルを入力してください')
      return
    }

    try {
      setError(null)
      await onAdd(title.trim())
      setTitle('') // 成功時にフォームをクリア
    } catch {
      setError('Todoの作成に失敗しました')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap={1}>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <Input
              type="text"
              value={title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
              placeholder="新しいTodoを入力..."
              disabled={loading}
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            disabled={loading || !title.trim()}
          >
            追加
          </Button>
        </div>
        
        {error && (
          <Text color="DANGER" size="S">
            {error}
          </Text>
        )}
      </Stack>
    </form>
  )
}

export default AddTodoForm
