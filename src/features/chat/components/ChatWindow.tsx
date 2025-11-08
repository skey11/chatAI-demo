import { useMemo } from 'react';
import { useConversation } from '../hooks/useConversation';
import { useSendMessage } from '../hooks/useSendMessage';
import { useChatStore } from '../store';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';

export const ChatWindow = () => {
  const conversationId = useChatStore((state) => state.conversationId);
  const { data, loading, error } = useConversation(conversationId);
  const { sendMessage, loading: sending } = useSendMessage();

  const messages = useMemo(() => data?.conversation?.messages ?? [], [data]);

  return (
    <section className="chat-gradient flex flex-1 flex-col rounded-3xl border border-white/10 bg-slate-900/60 shadow-2xl">
      <div className="border-b border-white/5 px-6 py-4">
        <div className="text-xs uppercase tracking-[0.3em] text-brand">Conversation</div>
        <h2 className="text-lg font-semibold">{conversationId}</h2>
      </div>
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {error && (
          <p className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            GraphQL 错误：{error.message}
          </p>
        )}
        {loading && !messages.length && <p className="text-sm text-slate-400">加载会话中...</p>}
        <div className="flex flex-col gap-4">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
        </div>
      </div>
      <div className="border-t border-white/5 px-6 py-4">
        <MessageInput
          disabled={sending}
          placeholder={sending ? 'AI 正在思考...' : '说点什么吧'}
          onSubmit={(value) => sendMessage(conversationId, value)}
        />
      </div>
    </section>
  );
};
