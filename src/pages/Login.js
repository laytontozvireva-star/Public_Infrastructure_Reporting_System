import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { KeyRound, XCircle, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';

/**
 * Same style guide as the rest of the app:
 * - Alert Orange (#FF6C16) on the header icon and the Login button — Login
 *   is the one primary action on this page, so both echo the same color
 *   (matches the pattern used on the Report Issue page header + submit).
 * - "Create Free Account" is a secondary path off this page, not the
 *   primary action, so it stays a neutral outlined button rather than
 *   orange — keeping orange meaningful as "the one thing to click here."
 * - "Back to Home" is plain navigation, not a call to action, so it's
 *   neutral slate rather than borrowing var(--pirs-primary) (unconfirmed
 *   color) or orange (would wrongly suggest it's the primary action).
 */

function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await signIn({ email: formData.email, password: formData.password });
    if (error) { setError(error.message); setLoading(false); }
    else navigate('/my-reports');
  };

  return (
    <div className="page-wrapper relative flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src="/images/community-trust.jpg" alt="" className="h-full w-full object-cover object-center" />
        <div className="absolute inset-0 bg-[#F8FAFC]/85 dark:bg-[#181513]/90 backdrop-blur-[8px]"></div>
      </div>
      <div className="relative z-10 w-full max-w-md animate-fade-in">

        {/* Card */}
        <div className="card p-8 md:p-10">

          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FF6C16] shadow-lg shadow-orange-500/25">
              <KeyRound size={30} strokeWidth={2} className="text-[#F7F5F1]" aria-hidden="true" />
            </div>
            <h1 className="text-3xl font-black tracking-tight" style={{ color: "var(--pirs-text)" }}>Welcome Back</h1>
            <p className="mt-1 text-sm" style={{ color: "var(--pirs-muted)" }}>Log in to manage and track your reports</p>
          </div>

          {/* Error */}
          {error && (
            <div className="alert-error mb-6 flex items-center gap-2">
              <XCircle size={18} strokeWidth={2} aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="form-label">Email Address</label>
              <input
                type="email" name="email" value={formData.email}
                onChange={handleChange} placeholder="your@email.com" required
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">Password</label>
              <input
                type="password" name="password" value={formData.password}
                onChange={handleChange} placeholder="••••••••" required
                className="form-input"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF6C16] py-3.5 text-base font-bold text-[#F7F5F1] shadow-lg shadow-orange-500/25 transition hover:bg-[#EA6A0C] disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={18} strokeWidth={2} className="animate-spin" aria-hidden="true" />
                  Logging in…
                </>
              ) : (
                <>
                  Login
                  <ArrowRight size={18} strokeWidth={2.25} aria-hidden="true" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1" style={{ backgroundColor: "var(--pirs-border)" }}></div>
            <span className="text-xs" style={{ color: "var(--pirs-muted)" }}>Don't have an account?</span>
            <div className="h-px flex-1" style={{ backgroundColor: "var(--pirs-border)" }}></div>
          </div>

          <Link
            to="/register"
            className="flex w-full items-center justify-center rounded-xl border border-stone-200 py-3 text-base font-semibold text-stone-700 transition hover:bg-stone-50"
          >
            Create Free Account
          </Link>
        </div>

        {/* Back home */}
        <p className="mt-6 text-center text-sm" style={{ color: "var(--pirs-muted)" }}>
          <Link to="/" className="inline-flex items-center gap-1 text-stone-500 transition hover:text-stone-800 hover:underline">
            <ArrowLeft size={14} strokeWidth={2.25} aria-hidden="true" />
            Back to Home
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
