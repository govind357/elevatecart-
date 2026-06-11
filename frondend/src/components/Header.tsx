import { User } from '../api';

type Props = {
  user: User | null;
  cartItemCount: number;
  theme: 'light' | 'dark';
  onHome: () => void;
  onCart: () => void;
  onAuth: (mode: 'login' | 'register') => void;
  onLogout: () => void;
  onAdmin: () => void;
  onToggleTheme: () => void;
};

export default function Header({ user, cartItemCount, theme, onHome, onCart, onAuth, onLogout, onAdmin, onToggleTheme }: Props) {
  return (
    <header className="mb-6 rounded-3xl border border-transparent bg-white p-6 shadow-2xl shadow-slate-200/80 transition-colors dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/50">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Shopify Demo</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Connected to backend at{' '}
            <code className="rounded-2xl bg-slate-100 px-2 py-1 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-200">
              {import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'}
            </code>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            onClick={onHome}
          >
            Home
          </button>
          <button
            className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            onClick={onCart}
          >
            Cart ({cartItemCount})
          </button>
          <button
            type="button"
            className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </button>
          {user ? (
            <>
              {user.role === 'admin' && (
                <button
                  className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
                  onClick={onAdmin}
                >
                  Admin Dashboard
                </button>
              )}
              <span className="rounded-full bg-sky-100 px-4 py-2 text-sm font-semibold text-sky-700 dark:bg-sky-950 dark:text-sky-200">
                {user.name}
              </span>
              <button
                className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                onClick={onLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <button
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
              onClick={() => onAuth('login')}
            >
              Login / Register
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
