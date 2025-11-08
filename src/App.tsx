import { AppProviders } from './app/providers/AppProviders';
import { ChatWindow } from './features/chat/components/ChatWindow';

export const AppShell = () => (
  <div className="min-h-screen bg-slate-950 text-slate-100">
    <header className="border-b border-white/5 bg-slate-900/70 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-brand">DeepSeek</p>
          <h1 className="text-xl font-semibold">Chat AI 控制台</h1>
        </div>
        <div className="text-right text-xs text-slate-400">
          <p>模型：{import.meta.env.VITE_DEEPSEEK_MODEL ?? 'deepseek-chat'}</p>
          <p>版本：{import.meta.env.VITE_APP_VERSION ?? '0.1.0'}</p>
        </div>
      </div>
    </header>
    <main className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-8">
      <ChatWindow />
    </main>
  </div>
);

function App() {
  return (
    <AppProviders>
      <AppShell />
    </AppProviders>
  );
}

export default App;
