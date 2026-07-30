import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  AlertTriangle,
  ArrowRight,
  FileText,
  MapPin,
  BarChart3,
  Camera,
  ClipboardList,
  CheckCircle2,
  Building2,
  Clock,
  Zap,
  Droplets,
  Waves,
  Route,
  TrafficCone,
  Trash2,
  TreePine,
  Construction,
} from "lucide-react";

/**
 * COLOR SYSTEM — per style guide
 * -------------------------------
 * - Navigation & Structure → Dark Slate Blue #1E293B (hero/header hierarchy)
 * - Map & Data Workspace   → Cool Gray #F8FAFC canvas, White #FFFFFF cards
 * - Interactive Elements   → Alert Orange #F97316 (primary actions, active markers)
 * - State Indicators       → Fresh Green #10B981 (resolved), Amber #F59E0B (in progress)
 *
 * Orange is reserved strictly for things the user can click that move a
 * report forward. Green/amber only ever label a status. Slate is structure,
 * never used for actions, so the three colors stay legible as three
 * different kinds of information rather than one interchangeable palette.
 */

const features = [
  {
    title: "Report Issues",
    description: "Quickly report infrastructure problems such as potholes, faulty transformers, burst pipes, and illegal dumping.",
    icon: FileText,
  },
  {
    title: "GPS Location",
    description: "Automatically capture the exact location of the problem to help maintenance teams respond faster.",
    icon: MapPin,
  },
  {
    title: "Track Progress",
    description: "Monitor your report from submission to completion with real-time status updates.",
    icon: BarChart3,
  },
  {
    title: "Photo Evidence",
    description: "Upload photos of the damaged infrastructure to provide clear evidence for authorities.",
    icon: Camera,
  },
];

// Icon color follows the state-indicator rule: green = resolved, amber = an
// ongoing/ever-present status, slate = neutral count with no status to report.
const stats = [
  { value: "500+", label: "Reports Submitted", icon: ClipboardList, tone: "text-slate-300" },
  { value: "350+", label: "Issues Resolved", icon: CheckCircle2, tone: "text-[#10B981]" },
  { value: "25+", label: "Communities Served", icon: Building2, tone: "text-slate-300" },
  { value: "24/7", label: "Availability", icon: Clock, tone: "text-[#F59E0B]" },
];

const categories = [
  { label: "Electricity", icon: Zap },
  { label: "Water", icon: Droplets },
  { label: "Sewer", icon: Waves },
  { label: "Roads", icon: Route },
  { label: "Traffic Lights", icon: TrafficCone },
  { label: "Illegal Dumping", icon: Trash2 },
  { label: "Fallen Trees", icon: TreePine },
  { label: "Other", icon: Construction },
];

function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800">

      {/* ── Hero — Dark Slate Blue establishes top-level hierarchy ──── */}
      <section className="relative overflow-hidden py-24 md:py-32" style={{ background: "linear-gradient(160deg, #1E293B 0%, #0F172A 100%)" }}>
        <div className="relative mx-auto max-w-7xl px-6 text-center">
          {/* Badge — green dot reads as "system status: active" */}
          <div className="animate-fade-in mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm font-medium text-slate-200 backdrop-blur-sm">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#10B981]"></span>
            Zimbabwe's Public Infrastructure Platform
          </div>

          <h1 className="animate-fade-in stagger-1 mb-6 text-5xl font-black leading-tight tracking-tight text-white md:text-7xl">
            Public Infrastructure
            <span className="mt-1 block text-[#F97316]">
              Reporting System
            </span>
          </h1>

          <p className="animate-fade-in stagger-2 mx-auto mb-10 max-w-3xl text-lg leading-relaxed text-slate-300 md:text-xl">
            Help improve your community by reporting damaged public infrastructure directly
            to the responsible authorities and tracking the repair progress in real time.
          </p>

          <div className="animate-fade-in stagger-3 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/report"
              className="inline-flex items-center gap-2 rounded-lg bg-[#F97316] px-8 py-4 text-base font-bold text-white shadow-lg shadow-orange-500/25 transition hover:bg-[#EA6A0C]"
            >
              <AlertTriangle size={18} strokeWidth={2.25} aria-hidden="true" />
              Report an Issue
            </Link>
            {!user && (
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-lg border border-white/25 bg-white/5 px-8 py-4 text-base font-semibold text-white transition hover:bg-white/10"
              >
                Get Started
                <ArrowRight size={18} strokeWidth={2.25} aria-hidden="true" />
              </Link>
            )}
          </div>

          {/* Quick stats strip */}
          <div className="animate-fade-in stagger-4 mt-16 grid grid-cols-2 gap-4 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-5 text-center backdrop-blur-sm">
                <stat.icon
                  size={22}
                  strokeWidth={2}
                  className={`mx-auto mb-2 ${stat.tone}`}
                  aria-hidden="true"
                />
                <div className="text-2xl font-black text-white">{stat.value}</div>
                <div className="text-xs text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features — white cards on the Cool Gray workspace canvas ── */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-14 text-center animate-fade-in">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#1E293B]">Why Choose PIRS?</p>
            <h2 className="mb-4 text-4xl font-bold text-slate-900">Built for Citizens, Designed for Action</h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-500">
              Our platform makes it easy for citizens and authorities to work together in solving public infrastructure problems efficiently.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className={`rounded-xl border border-slate-200/70 bg-white p-6 shadow-sm animate-fade-in stagger-${i + 1} group cursor-default transition hover:-translate-y-1 hover:shadow-md`}
              >
                <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1E293B] shadow-sm transition-transform duration-300 group-hover:scale-110">
                  <feature.icon size={26} strokeWidth={2} className="text-white" aria-hidden="true" />
                </div>
                <h3 className="mb-3 text-lg font-bold text-slate-900">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-slate-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories — white section, Cool Gray tiles ─────────────── */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-14 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#1E293B]">What You Can Report</p>
            <h2 className="mb-4 text-4xl font-bold text-slate-900">Reportable Categories</h2>
            <p className="text-lg text-slate-500">Citizens can report various types of public infrastructure problems.</p>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {categories.map((cat) => (
              <Link
                key={cat.label}
                to="/report"
                className="group flex flex-col items-center gap-3 rounded-lg bg-[#F8FAFC] p-6 text-center text-slate-600 transition-all duration-200 hover:-translate-y-1 hover:bg-orange-50 hover:text-[#F97316]"
              >
                <cat.icon
                  size={30}
                  strokeWidth={1.75}
                  className="transition-transform duration-300 group-hover:scale-110"
                  aria-hidden="true"
                />
                <span className="text-sm font-semibold">{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Call to Action ───────────────────────────────────────────── */}
      <section className="py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <div className="rounded-2xl border border-slate-200/70 bg-white p-12 shadow-sm">
            <div className="mb-5 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F8FAFC]">
              <Building2 size={30} strokeWidth={2} className="text-[#1E293B]" aria-hidden="true" />
            </div>
            <h2 className="mb-4 text-4xl font-bold text-slate-900">Ready to Make a Difference?</h2>
            <p className="mx-auto mb-8 max-w-2xl text-xl leading-relaxed text-slate-500">
              Join thousands of citizens helping to improve public infrastructure across Zimbabwe by reporting issues quickly and efficiently.
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                to="/report"
                className="inline-flex items-center gap-2 rounded-lg bg-[#F97316] px-8 py-4 text-base font-bold text-white shadow-lg shadow-orange-500/25 transition hover:bg-[#EA6A0C]"
              >
                <AlertTriangle size={18} strokeWidth={2.25} aria-hidden="true" />
                Report an Issue
              </Link>
              {!user && (
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-8 py-4 text-base font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Create Free Account
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
