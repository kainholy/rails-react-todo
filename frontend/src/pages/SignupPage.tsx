import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, Input, Stack, Heading, Text, Container, Center, Base } from 'smarthr-ui'
import { useAuthStore } from '../store/authStore'
import { authService } from '../services/authService'

const SignupPage: React.FC = () => {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !password) {
      setError('全ての項目を入力してください')
      return
    }

    if (password.length < 6) {
      setError('パスワードは6文字以上で入力してください')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { user, token } = await authService.signup(name, email, password)
      setAuth(token, user)
      navigate('/todos')
    } catch (error: unknown) {
      if (error instanceof Error && 'response' in error) {
        const axiosError = error as { response?: { data?: { errors?: string } } }
        setError(axiosError.response?.data?.errors || '新規登録に失敗しました')
      } else {
        setError('新規登録に失敗しました')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Base>
      <Center>
        <Container>
          <div style={{ maxWidth: '400px', margin: '2rem auto', padding: '2rem' }}>
            <Stack gap={2} >
              <Heading type="blockTitle">新規登録</Heading>
              
              <form onSubmit={handleSubmit}>
                <Stack gap={1.5}>
                  <div>
                    <Text as="label" htmlFor="name">名前</Text>
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                      placeholder="山田太郎"
                      required
                    />
                  </div>

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
                      placeholder="パスワード（6文字以上）"
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
                    新規登録
                  </Button>
                </Stack>
              </form>

              <Text>
                既にアカウントをお持ちの方は <Link to="/login">ログイン</Link>
              </Text>
            </Stack>
          </div>
        </Container>
      </Center>
    </Base>
  )
}

export default SignupPage
