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

export default function Header({ user, cartItemCount, onHome, onCart, onAuth, onLogout, onAdmin }: Props) {
  return (
    <header className="mb-6 rounded-3xl border border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur-md transition-colors shadow-2xl shadow-indigo-950/10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        
        {/* Brand Logo & Connection Info */}
        <div className="flex items-center gap-3 cursor-pointer select-none" onClick={onHome}>
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-950/60 border border-indigo-800/30 transition hover:scale-105">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5.5 h-5.5 text-indigo-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-indigo-100 to-indigo-300 bg-clip-text text-transparent">
              ElevateCart
            </h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                API Connected
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            className="inline-flex items-center rounded-2xl bg-slate-950/40 border border-slate-800/80 px-4 py-2.5 text-sm font-bold text-slate-300 transition-all hover:bg-slate-900 hover:text-white"
            onClick={onHome}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 mr-2 text-slate-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
            Home
          </button>
          
          <button
            className="relative inline-flex items-center rounded-2xl bg-slate-950/40 border border-slate-800/80 px-4 py-2.5 text-sm font-bold text-slate-300 transition-all hover:bg-slate-900 hover:text-white"
            onClick={onCart}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 mr-2 text-slate-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
            Cart
            {cartItemCount > 0 && (
              <span className="ml-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-500 px-1.5 text-[10px] font-bold text-white">
                {cartItemCount}
              </span>
            )}
          </button>

          <span className="h-6 w-px bg-slate-800 mx-1"></span>

          {user ? (
            <div className="flex items-center gap-2">
              {user.role === 'admin' && (
                <button
                  className="rounded-2xl bg-white px-4 py-2.5 text-sm font-bold text-slate-900 transition hover:bg-slate-100"
                  onClick={onAdmin}
                >
                  Admin
                </button>
              )}
              
              <div className="inline-flex items-center gap-2 rounded-2xl bg-indigo-950/40 border border-indigo-800/20 px-3.5 py-2.5 text-sm font-bold text-indigo-300">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500 text-[10px] font-bold text-white uppercase">
                  {user.name.charAt(0)}
                </span>
                <span className="max-w-[80px] truncate">{user.name}</span>
              </div>

              <button
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950/40 border border-slate-800/80 text-rose-400 transition-all hover:bg-rose-950/30 hover:text-rose-300"
                onClick={onLogout}
                title="Logout"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                </svg>
              </button>
            </div>
          ) : (
            <button
              className="rounded-2xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-500"
              onClick={() => onAuth('login')}
            >
              Sign In
            </button>
          )}
        </div>

      </div>
    </header>
  );
}
