import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Input, Stack, Heading, Text, Container, Center } from 'smarthr-ui'
import { useAuthStore } from '../store/authStore'
import { authService } from '../services/authService'

const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setError('メールアドレスとパスワードを入力してください')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { user, token } = await authService.login(email, password)
      setAuth(token, user)
      navigate('/todos')
    } catch (error: unknown) {
      if (error instanceof Error && 'response' in error) {
        const axiosError = error as { response?: { data?: { error?: string } } }
        setError(axiosError.response?.data?.error || 'ログインに失敗しました')
      } else {
        setError('ログインに失敗しました')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Center>
      <Container>
        <div style={{ maxWidth: '400px', margin: '2rem auto', padding: '2rem' }}>
          <Stack gap={2}>
            <Heading type="blockTitle">ログイン</Heading>
            
            <form onSubmit={handleSubmit}>
              <Stack gap={1.5}>
                <div>
                  <Text as="label" htmlFor="email">メールアドレス</Text>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    placeholder="example@email.com"
                    required
                  />
                </div>

                <div>
                  <Text as="label" htmlFor="password">パスワード</Text>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    placeholder="パスワード"
                    required
                  />
                </div>

                {error && (
                  <Text color="DANGER">
                    {error}
                  </Text>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  loading={loading}
                  disabled={loading}
                >
                  ログイン
                </Button>
              </Stack>
            </form>

            <Text>
              アカウントをお持ちでない方は <Link to="/signup">新規登録</Link>
            </Text>
          </Stack>
        </div>
      </Container>
    </Center>
  )
}

export default LoginPage
