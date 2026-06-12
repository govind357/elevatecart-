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
    <section className="mx-auto w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/50 p-6 shadow-2xl backdrop-blur-md animate-fade-in">
      <div className="grid gap-6">
        
        {/* Sliding Segmented Tab Switcher */}
        <div className="relative flex rounded-2xl bg-slate-950/60 p-1">
          <div
            className={`absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-xl bg-slate-900 shadow-sm transition-all duration-300 ${
              mode === 'register' ? 'translate-x-[calc(100%+8px)]' : 'translate-x-0'
            }`}
          />
          <button
            type="button"
            onClick={() => onModeChange('login')}
            className={`relative z-10 w-1/2 py-2 text-center text-sm font-bold transition duration-200 ${
              mode === 'login' ? 'text-white' : 'text-slate-500'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => onModeChange('register')}
            className={`relative z-10 w-1/2 py-2 text-center text-sm font-bold transition duration-200 ${
              mode === 'register' ? 'text-white' : 'text-slate-500'
            }`}
          >
            Register
          </button>
        </div>

        {/* Text Header */}
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-white">
            {mode === 'login' ? 'Welcome Back' : 'Join ElevateCart'}
          </h2>
          <p className="mt-2 text-xs text-slate-400">
            {mode === 'login'
              ? 'Enter your details to access your shopping cart.'
              : 'Create a free account to start shopping and save your cart.'}
          </p>
        </div>

        {/* Form Fields */}
        <form onSubmit={onSubmit} className="grid gap-4">
          {mode === 'register' && (
            <label className="grid gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Name
              <input
                value={form.name}
                onChange={(event) => onFormChange('name', event.target.value)}
                placeholder="John Doe"
                className="mt-1 rounded-2xl border border-slate-700 bg-slate-900/40 px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-950/50"
                type="text"
                required
              />
            </label>
          )}

          <label className="grid gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Email Address
            <input
              value={form.email}
              onChange={(event) => onFormChange('email', event.target.value)}
              placeholder="you@example.com"
              className="mt-1 rounded-2xl border border-slate-700 bg-slate-900/40 px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-950/50"
              type="email"
              required
            />
          </label>

          <label className="grid gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Password
            <input
              value={form.password}
              onChange={(event) => onFormChange('password', event.target.value)}
              placeholder="••••••••"
              className="mt-1 rounded-2xl border border-slate-700 bg-slate-900/40 px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-950/50"
              type="password"
              required
            />
          </label>

          <button className="mt-2 inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition-all hover:bg-indigo-500 shadow-md shadow-indigo-900/20" type="submit">
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>
      </div>
    </section>
  );
}
