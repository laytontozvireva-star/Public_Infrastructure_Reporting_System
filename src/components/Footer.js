import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  MapPin,
  Mail,
  Phone,
  ArrowRight,
  Zap,
  Droplets,
  Waves,
  Route,
  TrafficCone,
  Trash2,
} from "lucide-react";

/**
 * Same style guide as Navbar.jsx / Home.jsx:
 * - Dark Slate Blue (#1E293B) — hardcoded directly rather than trusting
 *   var(--pirs-nav-bg), same reasoning as the navbar rework.
 * - Alert Orange (#F97316) on "Get Started Free" — it's a primary action,
 *   so it gets the same color as every other primary action in the app
 *   instead of an unconfirmed btn-primary class.
 * - Fresh Green (#10B981) stays on the "systems operational" dot — a
 *   genuine resolved/good-state indicator, so green is the right call here.
 * The unused `categories` list from the original file is now actually
 * rendered as a compact icon column, since Quick Links already points to
 * /report but didn't show what's reportable.
 */

const quickLinks = [
  { to: "/", label: "Home" },
  { to: "/report", label: "Report Issue" },
  { to: "/my-reports", label: "My Reports" },
  { to: "/register", label: "Register" },
];

const categories = [
  { label: "Electricity", icon: Zap },
  { label: "Water", icon: Droplets },
  { label: "Sewer", icon: Waves },
  { label: "Roads", icon: Route },
  { label: "Traffic Lights", icon: TrafficCone },
  { label: "Illegal Dumping", icon: Trash2 },
];

function Footer() {
  const { user } = useAuth();

  return (
    <footer className="bg-[#1E293B]" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }} aria-label="Site footer">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-lg font-black text-white">P</div>
              <span className="text-lg font-black text-white tracking-wide">PIRS</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              A platform enabling citizens to report public infrastructure issues and helping authorities respond efficiently across Zimbabwe.
            </p>
            {!user && (
              <Link
                to="/register"
                className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-[#F97316] px-4 py-2 text-xs font-bold text-white shadow-lg shadow-orange-500/25 transition hover:bg-[#EA6A0C]"
              >
                Get Started Free
                <ArrowRight size={14} strokeWidth={2.5} aria-hidden="true" />
              </Link>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-white">Quick Links</h3>
            <ul className="space-y-2.5">
              {quickLinks.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-sm text-slate-400 transition-colors hover:text-white">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-white">What You Can Report</h3>
            <ul className="space-y-2.5">
              {categories.map(({ label, icon: Icon }) => (
                <li key={label}>
                  <Link
                    to="/report"
                    className="inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white"
                  >
                    <Icon size={14} strokeWidth={2} aria-hidden="true" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-white">Contact</h3>
            <address className="space-y-2.5 text-sm not-italic text-slate-400">
              <p className="font-medium text-white">Layton Tozvireva</p>
              <p className="inline-flex items-center gap-2">
                <MapPin size={14} strokeWidth={2} aria-hidden="true" />
                Harare, Zimbabwe
              </p>
              <p>
                <a
                  href="mailto:laytontozvireva@gmail.com"
                  className="inline-flex items-center gap-2 transition hover:text-white hover:underline"
                >
                  <Mail size={14} strokeWidth={2} aria-hidden="true" />
                  laytontozvireva@gmail.com
                </a>
              </p>
              <p>
                <a
                  href="tel:+263717821122"
                  className="inline-flex items-center gap-2 transition hover:text-white hover:underline"
                >
                  <Phone size={14} strokeWidth={2} aria-hidden="true" />
                  +263 717 821 122
                </a>
              </p>
            </address>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-10 flex flex-col items-center justify-between gap-3 border-t pt-6 text-xs text-slate-500 sm:flex-row"
          style={{ borderColor: "rgba(255,255,255,0.08)" }}
        >
          <p>© {new Date().getFullYear()} Public Infrastructure Reporting System. Developed by Layton Tozvireva.</p>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#10B981] animate-pulse"></span>
            <span>All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
