import { FormEvent, useState } from 'react';

interface Props {
  disabled?: boolean;
  placeholder?: string;
  onSubmit: (value: string) => Promise<void> | void;
}

export const MessageInput = ({ disabled, placeholder, onSubmit }: Props) => {
  const [value, setValue] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    await onSubmit(trimmed);
    setValue('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-start gap-3">
      <textarea
        className="h-16 flex-1 resize-none rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-brand focus:outline-none"
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        onChange={(event) => setValue(event.target.value)}
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        className="rounded-2xl bg-brand px-6 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-brand/40"
      >
        发送
      </button>
    </form>
  );
};
