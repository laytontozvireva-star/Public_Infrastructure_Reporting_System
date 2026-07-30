import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMyReports } from '../services/api';
import {
  Lock,
  XCircle,
  ClipboardList,
  Plus,
  Loader2,
  Zap,
  Droplets,
  Waves,
  Route,
  TrafficCone,
  Trash2,
  TreePine,
  Construction,
} from 'lucide-react';

/**
 * State-indicator colors follow the style guide exactly:
 * - Completed  → Fresh Green  #10B981 (resolved)
 * - In Progress→ Amber        #F59E0B (currently in progress)
 * - Pending    → neutral slate — the guide only defines colors for
 *   "resolved" and "in progress," so a status that is neither gets no
 *   color at all rather than borrowing one that already means something
 *   else (the old amber-for-pending/blue-for-in-progress mapping put
 *   amber on the wrong status entirely).
 * "New Report" / "Go to Login" / "Submit Your First Report" are primary
 * actions, so they use Alert Orange (#F97316) directly rather than a
 * `btn-primary` class of unconfirmed color.
 */

const statusConfig = {
  'Pending':     { dot: 'bg-slate-400',    bar: 'bg-slate-400',              width: 'w-1/4',  pct: '25%',  label: 'Awaiting review', badgeBg: 'bg-slate-100 text-slate-600' },
  'In Progress': { dot: 'bg-[#F59E0B]',    bar: 'bg-[#F59E0B]',              width: 'w-3/5',  pct: '60%',  label: 'Being addressed', badgeBg: 'bg-amber-50 text-[#B45309]' },
  'Completed':   { dot: 'bg-[#10B981]',    bar: 'bg-[#10B981]',              width: 'w-full', pct: '100%', label: 'Resolved',        badgeBg: 'bg-emerald-50 text-[#0F9D74]' },
};

const categoryIcon = {
  'Electricity': Zap, 'Water': Droplets, 'Sewer': Waves, 'Roads': Route,
  'Traffic Lights': TrafficCone, 'Illegal Dumping': Trash2, 'Fallen Trees': TreePine, 'Other': Construction,
};

const primaryBtn = "inline-flex items-center justify-center gap-2 rounded-lg bg-[#F97316] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition hover:bg-[#EA6A0C]";

function MyReports() {
  const { user, loading: authLoading } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (authLoading) return;
    if (!user) { setLoading(false); return; }
    getMyReports().then(({ data, error }) => {
      if (error) setError(error.message);
      else setReports(data || []);
      setLoading(false);
    });
  }, [user, authLoading]);

  // Not logged in
  if (!authLoading && !user) {
    return (
      <div className="page-wrapper flex items-center justify-center">
        <div className="card p-12 text-center max-w-md w-full animate-fade-in">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl" style={{ backgroundColor: "var(--pirs-surface-2)" }}>
            <Lock size={30} strokeWidth={1.75} style={{ color: "var(--pirs-muted)" }} aria-hidden="true" />
          </div>
          <h2 className="text-2xl font-black mb-2" style={{ color: "var(--pirs-text)" }}>Login Required</h2>
          <p className="mb-8 text-sm" style={{ color: "var(--pirs-muted)" }}>You need to be logged in to view your reports.</p>
          <Link to="/login" className={primaryBtn}>Go to Login</Link>
        </div>
      </div>
    );
  }

  const pending    = reports.filter(r => r.status === 'Pending').length;
  const inProgress = reports.filter(r => r.status === 'In Progress').length;
  const completed  = reports.filter(r => r.status === 'Completed').length;

  return (
    <div className="page-wrapper">
      <div className="mx-auto max-w-5xl animate-fade-in">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="section-title mb-1">My Reports</h1>
            <p className="section-subtitle">Track your submitted infrastructure reports.</p>
          </div>
          <Link to="/report" className={`${primaryBtn} shrink-0`}>
            <Plus size={16} strokeWidth={2.5} aria-hidden="true" />
            New Report
          </Link>
        </div>

        {/* Error */}
        {error && (
          <div className="alert-error mb-6 flex items-center gap-2">
            <XCircle size={18} strokeWidth={2} aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}

        {/* Stats strip — neutral for plain counts, amber/green only where they mean "in progress" / "resolved" */}
        {!loading && reports.length > 0 && (
          <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: 'Total',       value: reports.length, color: 'text-slate-700',   bg: 'bg-slate-50' },
              { label: 'Pending',     value: pending,        color: 'text-slate-700',   bg: 'bg-slate-50' },
              { label: 'In Progress', value: inProgress,     color: 'text-[#B45309]',   bg: 'bg-amber-50' },
              { label: 'Completed',   value: completed,      color: 'text-[#0F9D74]',   bg: 'bg-emerald-50' },
            ].map((s) => (
              <div key={s.label} className={`card rounded-xl px-4 py-5 text-center ${s.bg}`}>
                <div className={`text-3xl font-black ${s.color}`}>{s.value}</div>
                <div className="text-xs font-medium mt-1" style={{ color: "var(--pirs-muted)" }}>{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-20">
            <Loader2 size={40} strokeWidth={2} className="animate-spin text-slate-400" aria-hidden="true" />
          </div>
        )}

        {/* Empty state */}
        {!loading && reports.length === 0 && (
          <div className="card p-14 text-center animate-fade-in">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl" style={{ backgroundColor: "var(--pirs-surface-2)" }}>
              <ClipboardList size={40} strokeWidth={1.5} style={{ color: "var(--pirs-muted)" }} aria-hidden="true" />
            </div>
            <h2 className="text-2xl font-black mb-2" style={{ color: "var(--pirs-text)" }}>No Reports Yet</h2>
            <p className="mb-8 text-sm" style={{ color: "var(--pirs-muted)" }}>You haven't submitted any infrastructure reports yet.</p>
            <Link to="/report" className={primaryBtn}>Submit Your First Report</Link>
          </div>
        )}

        {/* Reports list */}
        {!loading && reports.length > 0 && (
          <div className="space-y-5">
            {reports.map((report, i) => {
              const cfg = statusConfig[report.status] || statusConfig['Pending'];
              const CategoryIcon = categoryIcon[report.category] || Construction;
              return (
                <div key={report.id} className={`card p-6 animate-fade-in stagger-${Math.min(i + 1, 4)}`}>
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start">

                    {/* Category icon */}
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                      style={{ backgroundColor: "var(--pirs-surface-2)", border: "1px solid var(--pirs-border)" }}>
                      <CategoryIcon size={22} strokeWidth={1.75} style={{ color: "var(--pirs-text)" }} aria-hidden="true" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h2 className="text-xl font-bold truncate" style={{ color: "var(--pirs-text)" }}>{report.title}</h2>
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${cfg.badgeBg}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`}></span>
                          {report.status}
                        </span>
                      </div>

                      <p className="text-sm mb-3 line-clamp-2" style={{ color: "var(--pirs-muted)" }}>{report.description}</p>

                      <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs" style={{ color: "var(--pirs-muted)" }}>
                        <span><span className="font-semibold" style={{ color: "var(--pirs-text)" }}>ID:</span> #{report.id.slice(0, 8).toUpperCase()}</span>
                        <span><span className="font-semibold" style={{ color: "var(--pirs-text)" }}>Category:</span> {report.category}</span>
                        <span><span className="font-semibold" style={{ color: "var(--pirs-text)" }}>Date:</span> {new Date(report.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        {report.latitude && (
                          <span><span className="font-semibold" style={{ color: "var(--pirs-text)" }}>GPS:</span> {Number(report.latitude).toFixed(4)}, {Number(report.longitude).toFixed(4)}</span>
                        )}
                      </div>

                      {/* Progress bar */}
                      <div className="mt-4">
                        <div className="flex justify-between text-xs mb-1.5">
                          <span style={{ color: "var(--pirs-muted)" }}>{cfg.label}</span>
                          <span className="font-semibold" style={{ color: "var(--pirs-text)" }}>{cfg.pct}</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full" style={{ backgroundColor: "var(--pirs-border)" }}>
                          <div className={`h-1.5 rounded-full transition-all duration-700 ${cfg.bar} ${cfg.width}`}></div>
                        </div>
                      </div>
                    </div>

                    {/* Photo thumbnail */}
                    {report.photo_url && (
                      <a href={report.photo_url} target="_blank" rel="noreferrer" className="shrink-0">
                        <img src={report.photo_url} alt="Report evidence"
                          className="h-20 w-20 rounded-xl object-cover border transition-transform hover:scale-105"
                          style={{ borderColor: "var(--pirs-border)" }} />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyReports;
