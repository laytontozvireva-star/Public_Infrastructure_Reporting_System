import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Register() {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '', phone: '', email: '', password: '', confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (formData.password !== formData.confirmPassword) { setError('Passwords do not match!'); return; }
    setLoading(true);
    const { error } = await signUp({ email: formData.email, password: formData.password, fullName: formData.fullName, phone: formData.phone });
    if (error) { setError(error.message); setLoading(false); }
    else {
      setSuccess('Account created! Check your email to confirm your account, then log in.');
      setFormData({ fullName: '', phone: '', email: '', password: '', confirmPassword: '' });
      setLoading(false);
      setTimeout(() => navigate('/login'), 3500);
    }
  };

  return (
    <div className="page-wrapper relative flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src="/images/community-trust.jpg" alt="" className="h-full w-full object-cover object-center" />
        <div className="absolute inset-0 bg-[#F8FAFC]/80 dark:bg-[#181513]/80 backdrop-blur-none"></div>
      </div>
      <div className="relative z-10 w-full max-w-md animate-fade-in">

        <div className="card p-8 md:p-10">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl text-3xl shadow-lg"
              style={{ background: "linear-gradient(135deg, #10B981, #059669)" }}>
              🌍
            </div>
            <h1 className="text-3xl font-black tracking-tight" style={{ color: "var(--pirs-text)" }}>Create Account</h1>
            <p className="mt-1 text-sm" style={{ color: "var(--pirs-muted)" }}>Join the community and start reporting issues</p>
          </div>

          {/* Feedback */}
          {error && <div className="alert-error mb-6"><span>⚠️</span><span>{error}</span></div>}
          {success && <div className="alert-success mb-6"><span>✅</span><span>{success}</span></div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="form-label">Full Name</label>
              <input type="text" name="fullName" value={formData.fullName} onChange={handleChange}
                placeholder="John Doe" required className="form-input" />
            </div>

            {/* Phone */}
            <div>
              <label className="form-label">Phone Number</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                placeholder="+263 7XX XXX XXX" required className="form-input" />
            </div>

            {/* Email */}
            <div>
              <label className="form-label">Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange}
                placeholder="your@email.com" required className="form-input" />
            </div>

            {/* Password row */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="form-label">Password</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange}
                  placeholder="Min 6 chars" required minLength={6} className="form-input" />
              </div>
              <div>
                <label className="form-label">Confirm</label>
                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}
                  placeholder="Repeat password" required minLength={6} className="form-input" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-base mt-2"
              style={{ background: "linear-gradient(135deg, #10B981, #059669)", boxShadow: "0 4px 14px rgba(16,185,129,0.35)" }}>
              {loading ? (<><span className="spinner h-4 w-4 border-2"></span> Creating Account…</>) : 'Create Account →'}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1" style={{ backgroundColor: "var(--pirs-border)" }}></div>
            <span className="text-xs" style={{ color: "var(--pirs-muted)" }}>Already have an account?</span>
            <div className="h-px flex-1" style={{ backgroundColor: "var(--pirs-border)" }}></div>
          </div>

          <Link to="/login" className="btn-ghost w-full py-3 text-base justify-center">Login</Link>
        </div>

        <p className="mt-6 text-center text-sm" style={{ color: "var(--pirs-muted)" }}>
          <Link to="/" className="hover:underline" style={{ color: "var(--pirs-primary)" }}>← Back to Home</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
