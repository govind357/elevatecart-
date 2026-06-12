type Props = {
  loading: boolean;
  error: string;
  message: string;
};

export default function StatusBanner({ loading, error, message }: Props) {
  if (!loading && !error && !message) {
    return null;
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-xs font-bold text-slate-300 tracking-wide uppercase shadow-lg backdrop-blur-md animate-pulse">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-900/30 bg-rose-950/20 p-4 text-xs font-bold text-rose-400 tracking-wide shadow-lg animate-fade-in">
        {error}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-emerald-900/30 bg-emerald-950/20 p-4 text-xs font-bold text-emerald-400 tracking-wide shadow-lg animate-fade-in">
      {message}
    </div>
  );
}
