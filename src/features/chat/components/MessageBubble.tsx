import type { ChatMessage } from '../types';
import { formatTimestamp } from '../../../lib/dates';

interface Props {
  message: ChatMessage;
}

const bubbleStyles: Record<ChatMessage['role'], string> = {
  user: 'self-end bg-brand text-white',
  assistant: 'self-start bg-slate-800 text-slate-100',
  system: 'self-center bg-slate-700 text-slate-200'
};

export const MessageBubble = ({ message }: Props) => (
  <article className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm shadow-lg ${bubbleStyles[message.role]}`}>
    <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
    <div className="mt-2 text-right text-[10px] uppercase tracking-widest text-white/60">
      {message.role} • {formatTimestamp(message.createdAt)}
    </div>
  </article>
);
