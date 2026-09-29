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
  MapPin,
  Calendar,
  Hash,
} from 'lucide-react';

const statusConfig = {
  'Pending':     { 
    dot: 'bg-stone-400 dark:bg-stone-500', 
    bar: 'bg-stone-400 dark:bg-stone-500', 
    width: 'w-1/4',  pct: '25%',  label: 'Awaiting review', 
    badgeBg: 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700' 
  },
  'In Progress': { 
    dot: 'bg-amber-500', 
    bar: 'bg-amber-500', 
    width: 'w-3/5',  pct: '60%',  label: 'Being addressed', 
    badgeBg: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50' 
  },
  'Completed':   { 
    dot: 'bg-emerald-500', 
    bar: 'bg-emerald-500', 
    width: 'w-full', pct: '100%', label: 'Resolved',        
    badgeBg: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50' 
  },
};

const categoryIcon = {
  'Electricity': Zap, 'Water': Droplets, 'Sewer': Waves, 'Roads': Route,
  'Traffic Lights': TrafficCone, 'Illegal Dumping': Trash2, 'Fallen Trees': TreePine, 'Other': Construction,
};

const primaryBtn = "inline-flex items-center justify-center gap-2 rounded-lg bg-[#FF6C16] px-5 py-2.5 text-sm font-semibold text-[#F7F5F1] transition-colors hover:bg-[#EA6A0C]";

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
      <div className="flex min-h-[60vh] items-center justify-center bg-[#F8FAFC] dark:bg-[#181513] p-4 transition-colors duration-200">
        <div className="w-full max-w-md rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-[#241F1C] p-8 text-center shadow-sm">
          <Lock size={32} strokeWidth={2} className="mx-auto mb-4 text-stone-400 dark:text-stone-500" />
          <h2 className="mb-2 text-xl font-bold text-stone-900 dark:text-[#F7F5F1]">Authentication Required</h2>
          <p className="mb-6 text-sm text-stone-600 dark:text-stone-400">Please sign in to view and manage your submitted reports.</p>
          <Link to="/login" className={primaryBtn}>Sign In</Link>
        </div>
      </div>
    );
  }

  const pending    = reports.filter(r => r.status === 'Pending').length;
  const inProgress = reports.filter(r => r.status === 'In Progress').length;
  const completed  = reports.filter(r => r.status === 'Completed').length;

  return (
    <div className="min-h-screen relative overflow-hidden py-10 transition-colors duration-200">
      <div className="absolute inset-0 z-0">
        <img src="/images/repair-workers.jpg" alt="" className="h-full w-full object-cover object-center" />
        <div className="absolute inset-0 bg-[#F8FAFC]/90 dark:bg-[#181513]/90 backdrop-blur-[8px]"></div>
      </div>
      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6">

        {/* Header Section */}
        <div className="mb-8 flex flex-col gap-4 border-b border-stone-200 dark:border-stone-800 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-stone-900 dark:text-[#F7F5F1] mb-1">My Reports</h1>
            <p className="text-sm text-stone-600 dark:text-stone-400">Track and manage your submitted infrastructure issues.</p>
          </div>
          <Link to="/report" className={primaryBtn}>
            <Plus size={16} strokeWidth={2} />
            New Report
          </Link>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400">
            <XCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Stats strip */}
        {!loading && reports.length > 0 && (
          <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: 'Total', value: reports.length, color: 'text-stone-900 dark:text-[#F7F5F1]', bg: 'bg-white dark:bg-[#241F1C]', border: 'border-stone-200 dark:border-stone-700' },
              { label: 'Pending', value: pending, color: 'text-stone-700 dark:text-stone-300', bg: 'bg-white dark:bg-[#241F1C]', border: 'border-stone-200 dark:border-stone-700' },
              { label: 'In Progress', value: inProgress, color: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/10', border: 'border-amber-200 dark:border-amber-900/30' },
              { label: 'Resolved', value: completed, color: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/10', border: 'border-emerald-200 dark:border-emerald-900/30' },
            ].map((s, idx) => (
              <div key={idx} className={`rounded-xl border ${s.border} ${s.bg} p-4 sm:p-5 shadow-sm`}>
                <div className={`text-2xl font-bold ${s.color} mb-1`}>{s.value}</div>
                <div className="text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wide">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center gap-3 py-12 text-stone-500 dark:text-stone-400 justify-center">
            <Loader2 size={24} className="animate-spin text-[#FF6C16]" />
            <span className="text-sm font-medium">Loading reports...</span>
          </div>
        )}

        {/* Empty state */}
        {!loading && reports.length === 0 && (
          <div className="rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-[#241F1C] p-12 text-center shadow-sm">
            <ClipboardList size={32} strokeWidth={1.5} className="mx-auto mb-3 text-stone-400 dark:text-stone-500" />
            <h2 className="mb-2 text-lg font-bold text-stone-900 dark:text-[#F7F5F1]">No Reports Found</h2>
            <p className="mb-6 text-sm text-stone-600 dark:text-stone-400">You haven't submitted any infrastructure reports yet.</p>
            <Link to="/report" className={primaryBtn}>
              <Plus size={16} strokeWidth={2} />
              Submit Report
            </Link>
          </div>
        )}

        {/* Reports list */}
        {!loading && reports.length > 0 && (
          <div className="space-y-4">
            {reports.map((report) => {
              const cfg = statusConfig[report.status] || statusConfig['Pending'];
              const CategoryIcon = categoryIcon[report.category] || Construction;
              return (
                <div key={report.id} className="rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-[#241F1C] p-5 sm:p-6 shadow-sm">
                  <div className="flex flex-col sm:flex-row gap-5">
                    
                    {/* Category Icon */}
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                      <CategoryIcon size={20} strokeWidth={2} className="text-stone-600 dark:text-stone-300" />
                    </div>
                    
                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                        <h2 className="text-lg font-semibold text-stone-900 dark:text-[#F7F5F1] truncate">{report.title}</h2>
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${cfg.badgeBg}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`}></span>
                          {report.status}
                        </span>
                      </div>

                      <p className="text-sm text-stone-600 dark:text-stone-400 mb-4 line-clamp-2">{report.description}</p>

                      <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-stone-500 dark:text-stone-400 mb-5">
                        <span className="flex items-center gap-1.5"><Hash size={14} /> {report.id.slice(0, 8).toUpperCase()}</span>
                        <span className="flex items-center gap-1.5"><Calendar size={14} /> {new Date(report.created_at).toLocaleDateString('en-GB')}</span>
                        {report.latitude && (
                          <span className="flex items-center gap-1.5"><MapPin size={14} /> {Number(report.latitude).toFixed(4)}, {Number(report.longitude).toFixed(4)}</span>
                        )}
                      </div>

                      {/* Progress Bar Area */}
                      <div className="mt-auto">
                        <div className="flex justify-between items-center text-xs font-medium mb-1.5">
                          <span className="text-stone-500 dark:text-stone-400">{cfg.label}</span>
                          <span className="text-stone-700 dark:text-stone-300">{cfg.pct}</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                          <div className={`h-full rounded-full ${cfg.bar} ${cfg.width}`}></div>
                        </div>
                      </div>
                    </div>

                    {/* Photo Area (if exists) */}
                    {report.photo_url && (
                      <div className="w-full sm:w-32 shrink-0">
                        <a href={report.photo_url} target="_blank" rel="noreferrer" className="block w-full">
                          <img src={report.photo_url} alt="Evidence" className="h-24 w-full sm:w-32 rounded-lg object-cover border border-stone-200 dark:border-stone-700" />
                        </a>
                      </div>
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
