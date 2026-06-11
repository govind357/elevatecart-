import { FormEvent } from 'react';

export type AuthMode = 'login' | 'register';

type AuthForm = {
  name: string;
  email: string;
  password: string;
};

type Props = {
  mode: AuthMode;
  form: AuthForm;
  onModeChange: (mode: AuthMode) => void;
  onFormChange: (field: keyof AuthForm, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export default function AuthPanel({ mode, form, onModeChange, onFormChange, onSubmit }: Props) {
  return (
    <section className="rounded-3xl border border-transparent bg-white p-6 shadow-2xl shadow-slate-200/80 dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/50">
      <div className="grid gap-4 md:grid-cols-[1fr_2fr]">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">{mode === 'login' ? 'Login' : 'Create account'}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {mode === 'login'
              ? 'Enter your credentials to access your shopping cart and checkout.'
              : 'Create a new account to save your cart and complete checkout.'}
          </p>
        </div>

        <form onSubmit={onSubmit} className="grid gap-4">
          {mode === 'register' && (
            <label className="grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
              Name
              <input
                value={form.name}
                onChange={(event) => onFormChange('name', event.target.value)}
                className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-700"
                type="text"
                required
              />
            </label>
          )}

          <label className="grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            Email
            <input
              value={form.email}
              onChange={(event) => onFormChange('email', event.target.value)}
              className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-700"
              type="email"
              required
            />
          </label>

          <label className="grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            Password
            <input
              value={form.password}
              onChange={(event) => onFormChange('password', event.target.value)}
              className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-700"
              type="password"
              required
            />
          </label>

          <button className="inline-flex items-center justify-center rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200" type="submit">
            {mode === 'login' ? 'Login' : 'Create account'}
          </button>

          <div className="flex flex-wrap gap-2 text-sm text-slate-500 dark:text-slate-400">
            <button
              type="button"
              className={mode === 'login' ? 'font-semibold text-slate-900 dark:text-white' : 'text-slate-500 underline dark:text-slate-400'}
              onClick={() => onModeChange('login')}
            >
              Login
            </button>
            <button
              type="button"
              className={mode === 'register' ? 'font-semibold text-slate-900 dark:text-white' : 'text-slate-500 underline dark:text-slate-400'}
              onClick={() => onModeChange('register')}
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
