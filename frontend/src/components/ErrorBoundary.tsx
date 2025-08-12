import React from 'react'
import { Button, Text, Stack, Heading } from 'smarthr-ui'

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
      errorInfo: null,
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    this.setState({
      error,
      errorInfo,
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <Stack gap={2}>
            <Heading type="blockTitle">エラーが発生しました</Heading>
            <Text>申し訳ございません。予期しないエラーが発生しました。</Text>
            
            <details style={{ textAlign: 'left', marginTop: '1rem' }}>
              <summary>エラー詳細</summary>
              <pre style={{ 
                background: '#f5f5f5', 
                padding: '1rem', 
                borderRadius: '4px',
                fontSize: '12px',
                overflow: 'auto'
              }}>
                {this.state.error && this.state.error.toString()}
                <br />
                {this.state.errorInfo?.componentStack}
              </pre>
            </details>

            <Button 
              variant="primary" 
              onClick={() => window.location.reload()}
            >
              ページをリロード
            </Button>
          </Stack>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
