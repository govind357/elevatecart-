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
      <div className="rounded-3xl bg-white p-4 text-sm font-medium text-slate-700 shadow-lg shadow-slate-200/70 dark:bg-slate-900 dark:text-slate-200 dark:shadow-slate-950/50">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl bg-rose-50 p-4 text-sm font-medium text-rose-700 shadow-lg shadow-rose-200/70 dark:bg-rose-950 dark:text-rose-200 dark:shadow-slate-950/40">
        {error}
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-emerald-50 p-4 text-sm font-medium text-emerald-700 shadow-lg shadow-emerald-200/70 dark:bg-emerald-950 dark:text-emerald-200 dark:shadow-slate-950/40">
      {message}
    </div>
  );
}
