import { useEffect, useRef, useState } from 'react'
import type { FormEvent, KeyboardEvent } from 'react'
import { gql } from '@apollo/client'
import { useMutation } from '@apollo/client/react'
import './App.css'
import type { Message } from './types/chat'

const SEND_MESSAGE = gql`
  mutation SendMessage($input: ChatMessageInput!) {
    sendMessage(input: $input) {
      reply {
        role
        content
      }
      history {
        role
        content
      }
    }
  }
`

type SendMessageResponse = {
  sendMessage: {
    reply: Message
    history: Message[]
  }
}

type SendMessageVariables = {
  input: {
    conversation: Message[]
    userMessage: string
  }
}

const suggestions = [
  '简述整个 Cloudflare + GraphQL 架构的优势',
  '帮我写一段欢迎词，解释如何与 AI 协作',
  '列出上线前需要检查的配置清单',
] as const

function App() {
  const [messages, setMessages] = useState<Message[]>([])
  const [currentMessage, setCurrentMessage] = useState('')
  const [error, setError] = useState<string | null>(null)
  const chatEndRef = useRef<HTMLDivElement | null>(null)
  const [sendMessage, { loading }] = useMutation<
    SendMessageResponse,
    SendMessageVariables
  >(SEND_MESSAGE)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmed = currentMessage.trim()
    if (!trimmed) {
      return
    }

    const previousHistory = [...messages]
    const optimisticHistory: Message[] = [
      ...messages,
      { role: 'user', content: trimmed },
    ]

    setMessages(optimisticHistory)
    setCurrentMessage('')
    setError(null)

    try {
      const { data } = await sendMessage({
        variables: {
          input: {
            conversation: previousHistory,
            userMessage: trimmed,
          },
        },
      })

      const responseHistory = data?.sendMessage?.history
      if (responseHistory) {
        setMessages(responseHistory)
      } else {
        throw new Error('服务没有返回有效的回复')
      }
    } catch (err) {
      setMessages(previousHistory)
      const message =
        err instanceof Error ? err.message : '发送失败，请稍后重试。'
      setError(message)
    }
  }

  const handleSuggestion = (value: string) => {
    setCurrentMessage(value)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      event.currentTarget.form?.requestSubmit()
    }
  }

  return (
    <div className="app">
      <header className="hero">
        <div>
          <p className="eyebrow">GraphQL · Cloudflare · OpenAI</p>
          <h1>AI 对话控制台</h1>
          <p className="subtitle">
            React + TypeScript 前端通过 GraphQL 调用部署在 Cloudflare
            Workers 上的 OpenAI 能力。
          </p>
        </div>
      </header>

      <section className="suggestions">
        {suggestions.map((item) => (
          <button
            type="button"
            key={item}
            className="suggestion"
            onClick={() => handleSuggestion(item)}
          >
            {item}
          </button>
        ))}
      </section>

      <section className="chat-panel">
        <div className="history">
          {messages.length === 0 ? (
            <p className="empty-state">
              还没有对话，先选择上面的提示或输入你的问题吧。
            </p>
          ) : (
            messages.map((message, index) => (
              <article className={`message ${message.role}`} key={`msg-${index}`}>
                <div className="avatar" aria-hidden="true">
                  {message.role === 'assistant' ? 'AI' : '我'}
                </div>
                <div className="bubble">
                  <p>{message.content}</p>
                </div>
              </article>
            ))
          )}
          <div ref={chatEndRef} />
        </div>
      </section>

      {error ? <div className="error-banner">{error}</div> : null}

      <form className="composer" onSubmit={handleSubmit}>
        <textarea
          name="message"
          placeholder="输入内容，Enter 发送，Shift + Enter 换行"
          value={currentMessage}
          onChange={(event) => setCurrentMessage(event.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          rows={3}
        />
        <div className="composer-footer">
          <span className="status">
            {loading ? 'AI 正在思考…' : ' '}
          </span>
          <button type="submit" disabled={!currentMessage.trim() || loading}>
            {loading ? '发送中…' : '发送'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default App
