export const dynamic = "force-dynamic";
export const metadata = { title: "ورود مدیریت" };

export default function AdminLogin({ searchParams }: { searchParams: { error?: string } }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-navy px-5">
      <form
        action="/api/admin/login"
        method="POST"
        className="w-full max-w-sm rounded-2xl bg-cream p-8 shadow-card"
      >
        <div className="mb-6 text-center">
          <div className="font-display text-2xl font-bold tracking-widest text-navy">LUNA</div>
          <div className="text-xs tracking-widest text-gold">پنل مدیریت</div>
        </div>

        {searchParams.error && (
          <div className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-center text-sm text-red-600">
            نام کاربری یا رمز اشتباه است
          </div>
        )}

        <label className="mb-1.5 block text-xs font-medium text-navy/70">نام کاربری</label>
        <input
          name="username"
          className="mb-4 w-full rounded-xl border border-navy/15 bg-white px-4 py-3 text-sm outline-none focus:border-gold"
          dir="ltr"
          autoComplete="username"
        />

        <label className="mb-1.5 block text-xs font-medium text-navy/70">رمز عبور</label>
        <input
          name="password"
          type="password"
          className="mb-6 w-full rounded-xl border border-navy/15 bg-white px-4 py-3 text-sm outline-none focus:border-gold"
          dir="ltr"
          autoComplete="current-password"
        />

        <button type="submit" className="btn-gold w-full">
          ورود
        </button>
      </form>
    </div>
  );
}
