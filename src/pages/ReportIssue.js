import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { submitReport } from '../services/api';
import {
  AlertTriangle,
  AlertCircle,
  XCircle,
  Image,
  Camera,
  MapPin,
  CheckCircle2,
  Loader2,
} from 'lucide-react';

/**
 * Follows the same style guide as Home.jsx / Navbar.jsx:
 * - Alert Orange (#FF6C16) marks the one primary action on this page —
 *   submitting the report — on both the header icon and the submit button.
 * - Fresh Green (#10B981) marks a successful/resolved state: the captured
 *   GPS coordinates confirmation.
 * - Amber stays reserved for "in progress" states elsewhere in the app, so
 *   it isn't reused here just because the old header icon happened to be
 *   amber — that slot is orange now, since submitting a report is an action,
 *   not a status.
 */

const categories = [
  { value: 'Electricity', label: 'Electricity' },
  { value: 'Water', label: 'Water' },
  { value: 'Sewer', label: 'Sewer' },
  { value: 'Roads', label: 'Roads' },
  { value: 'Traffic Lights', label: 'Traffic Lights' },
  { value: 'Illegal Dumping', label: 'Illegal Dumping' },
  { value: 'Fallen Trees', label: 'Fallen Trees' },
  { value: 'Other', label: 'Other' },
];

function ReportIssue() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    category: '', title: '', description: '', photo: null, latitude: '', longitude: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const getLocation = () => {
    if (!navigator.geolocation) { setError('Geolocation not supported by this browser.'); return; }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFormData((prev) => ({ ...prev, latitude: pos.coords.latitude, longitude: pos.coords.longitude }));
        setLocating(false);
      },
      () => { setError('Unable to retrieve location. Please allow location access.'); setLocating(false); }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!user) { setError('You must be logged in to submit a report.'); return; }
    setLoading(true);
    const { error: err } = await submitReport(
      { category: formData.category, title: formData.title, description: formData.description, latitude: formData.latitude, longitude: formData.longitude },
      formData.photo
    );
    if (err) { setError(err.message); setLoading(false); }
    else navigate('/my-reports');
  };

  return (
    <div className="page-wrapper relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src="/images/report-document.jpg" alt="" className="h-full w-full object-cover object-center" />
        <div className="absolute inset-0 bg-[#F8FAFC]/90 dark:bg-[#181513]/90 backdrop-blur-[8px]"></div>
      </div>
      <div className="relative z-10 mx-auto max-w-2xl animate-fade-in">

        {/* Page header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FF6C16] shadow-lg shadow-orange-500/25">
            <AlertTriangle size={30} strokeWidth={2} className="text-[#F7F5F1]" aria-hidden="true" />
          </div>
          <h1 className="section-title mb-2">Report Infrastructure Issue</h1>
          <p className="section-subtitle">Help improve your community by documenting the problem below.</p>
        </div>

        {/* Auth warning */}
        {!user && (
          <div className="alert-warning mb-6 flex items-center gap-2">
            <AlertCircle size={18} strokeWidth={2} aria-hidden="true" />
            <span>You are not logged in. Please <a href="/login" className="font-semibold underline">log in</a> to submit a report.</span>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="alert-error mb-6 flex items-center gap-2">
            <XCircle size={18} strokeWidth={2} aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Category */}
            <div>
              <label className="form-label">Issue Category</label>
              <select name="category" value={formData.category} onChange={handleChange} required className="form-input">
                <option value="">Select a category…</option>
                {categories.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div>
              <label className="form-label">Issue Title</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange}
                placeholder="e.g. Transformer Stolen on Main St" required className="form-input" />
            </div>

            {/* Description */}
            <div>
              <label className="form-label">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange}
                rows="5" placeholder="Describe the issue in detail — when it started, severity, who is affected…"
                required className="form-input resize-none"></textarea>
            </div>

            {/* Photo Upload */}
            <div>
              <label className="form-label">Upload Photo (optional)</label>
              <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-6 text-center transition-all duration-200 hover:border-orange-400"
                style={{ borderColor: "var(--pirs-border)", backgroundColor: "var(--pirs-surface-2)" }}>
                {formData.photo ? (
                  <Camera size={32} strokeWidth={1.75} style={{ color: "var(--pirs-text)" }} aria-hidden="true" />
                ) : (
                  <Image size={32} strokeWidth={1.75} style={{ color: "var(--pirs-muted)" }} aria-hidden="true" />
                )}
                <span className="text-sm font-medium" style={{ color: "var(--pirs-text)" }}>
                  {formData.photo ? formData.photo.name : 'Click to upload a photo'}
                </span>
                <span className="text-xs" style={{ color: "var(--pirs-muted)" }}>PNG, JPG, WEBP up to 10MB</span>
                <input type="file" name="photo" accept="image/*" onChange={handleChange} className="sr-only" />
              </label>
            </div>

            {/* GPS */}
            <div>
              <label className="form-label">GPS Location (optional)</label>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <input type="text" value={formData.latitude} readOnly placeholder="Latitude"
                  className="form-input bg-opacity-50" style={{ backgroundColor: "var(--pirs-surface-2)" }} />
                <input type="text" value={formData.longitude} readOnly placeholder="Longitude"
                  className="form-input bg-opacity-50" style={{ backgroundColor: "var(--pirs-surface-2)" }} />
              </div>
              <button type="button" onClick={getLocation} disabled={locating}
                className="inline-flex items-center gap-2 rounded-xl border-2 px-5 py-2.5 text-sm font-semibold transition-all duration-200 hover:border-orange-400 disabled:opacity-60"
                style={{ borderColor: "var(--pirs-border)", color: "var(--pirs-text)", backgroundColor: "var(--pirs-surface-2)" }}>
                {locating ? (
                  <>
                    <Loader2 size={16} strokeWidth={2} className="animate-spin" aria-hidden="true" />
                    Getting location…
                  </>
                ) : (
                  <>
                    <MapPin size={16} strokeWidth={2.25} aria-hidden="true" />
                    Get Current Location
                  </>
                )}
              </button>
              {formData.latitude && (
                <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-[#10B981]">
                  <CheckCircle2 size={14} strokeWidth={2.25} aria-hidden="true" />
                  Captured: {Number(formData.latitude).toFixed(5)}, {Number(formData.longitude).toFixed(5)}
                </p>
              )}
            </div>

            {/* Divider */}
            <div className="h-px" style={{ backgroundColor: "var(--pirs-border)" }}></div>

            {/* Submit — the primary action on this page: Alert Orange */}
            <button type="submit" disabled={loading || !user}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF6C16] py-4 text-base font-bold text-[#F7F5F1] shadow-lg shadow-orange-500/25 transition hover:bg-[#EA6A0C] disabled:opacity-60">
              {loading ? (
                <>
                  <Loader2 size={20} strokeWidth={2} className="animate-spin" aria-hidden="true" />
                  Submitting…
                </>
              ) : (
                <>
                  <AlertTriangle size={18} strokeWidth={2.25} aria-hidden="true" />
                  Submit Report
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ReportIssue;
