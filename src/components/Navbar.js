import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Sun, Moon, Menu, X, LogIn, LogOut } from "lucide-react";

/**
 * Follows the same style guide as Home.jsx:
 * - Dark Slate Blue (#1E293B) for the header â€” establishes hierarchy.
 * - Alert Orange (#F97316) reserved for the one primary action link
 *   ("Report Issue"), matching its role on the home page CTA buttons.
 * Everything else (dark-mode toggle, hamburger, login) stays neutral
 * white/slate so orange keeps meaning "primary action" and doesn't get
 * diluted by decorative use elsewhere in the bar.
 */

function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("pirs-theme") === "dark"
  );
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("pirs-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setMenuOpen(false);
    navigate("/");
  };

 const navLinks = [
  { to: "/", label: "Home", end: true },
  { to: "/report", label: "Report Issue", accent: true },
  { to: "/knowledge", label: "Knowledge" },
  ...(user ? [{ to: "/my-reports", label: "My Reports" }] : []),
];

  const linkClass = ({ isActive }) =>
    [
      "rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
      isActive
        ? "bg-white/10 text-white"
        : "text-slate-300 hover:bg-white/5 hover:text-white",
    ].join(" ");

  const accentLinkClass = ({ isActive }) =>
    [
      "rounded-lg px-3 py-2 text-sm font-semibold transition-all duration-200",
      isActive
        ? "bg-[#F97316] text-white shadow-lg shadow-orange-500/25"
        : "text-[#F97316] hover:bg-orange-500/10",
    ].join(" ");

  return (
    <nav
      className={`sticky top-0 z-50 bg-[#1E293B] transition-all duration-300 ${scrolled ? "shadow-xl" : ""}`}
      style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
      aria-label="Main navigation"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-white transition hover:opacity-90">
          <img src="/pirs-icon.svg" alt="" className="h-8 w-8" aria-hidden="true" />
          <span className="text-lg font-black tracking-wide">PIRS</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden flex-1 items-center justify-center gap-1 md:flex">
          {navLinks.map(({ to, label, end, accent }) => (
            <NavLink key={to} to={to} end={end} className={accent ? accentLinkClass : linkClass}>
              {label}
            </NavLink>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">

          {/* Dark mode */}
          <button
            type="button"
            onClick={() => setDarkMode((p) => !p)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-300 transition hover:bg-white/5 hover:text-white"
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? (
              <Sun size={18} strokeWidth={2} aria-hidden="true" />
            ) : (
              <Moon size={18} strokeWidth={2} aria-hidden="true" />
            )}
          </button>

          {/* Auth button */}
          {user ? (
            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex items-center gap-1.5 rounded-lg bg-red-500/10 px-4 py-2 text-xs font-semibold text-red-400 transition hover:bg-red-500/20"
            >
              <LogOut size={14} strokeWidth={2.25} aria-hidden="true" />
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15"
            >
              <LogIn size={16} strokeWidth={2.25} aria-hidden="true" />
              Login
            </Link>
          )}

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-300 transition hover:bg-white/5 hover:text-white md:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? (
              <X size={20} strokeWidth={2} aria-hidden="true" />
            ) : (
              <Menu size={20} strokeWidth={2} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-white/10 px-6 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map(({ to, label, end, accent }) => (
              <NavLink key={to} to={to} end={end}
                className={accent ? accentLinkClass : linkClass}
                onClick={() => setMenuOpen(false)}>
                {label}
              </NavLink>
            ))}
            {user
              ? <button
                  type="button"
                  onClick={handleSignOut}
                  className="mt-2 inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-left text-sm font-medium text-red-400 transition hover:bg-white/5"
                >
                  <LogOut size={16} strokeWidth={2.25} aria-hidden="true" />
                  Logout
                </button>
              : <NavLink to="/login" className={linkClass} onClick={() => setMenuOpen(false)}>
                  <span className="inline-flex items-center gap-1.5">
                    <LogIn size={16} strokeWidth={2.25} aria-hidden="true" />
                    Login
                  </span>
                </NavLink>
            }
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;

