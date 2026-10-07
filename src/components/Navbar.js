import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabaseClient";
import {
  Sun,
  Moon,
  Menu,
  X,
  LogIn,
  LogOut,
  ChevronDown,
} from "lucide-react";

/**
 * PIRS Navbar
 *
 * Authority users get:
 * - Dashboard
 * - Analytics
 * - PIRS Menu containing the normal PIRS pages
 *
 * Normal users/visitors get the standard PIRS navigation.
 */

function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [isAuthority, setIsAuthority] = useState(false);
  const [pirsMenuOpen, setPirsMenuOpen] = useState(false);

  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("pirs-theme") === "dark"
  );

  const [scrolled, setScrolled] = useState(false);

  // Dark mode
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("pirs-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // Navbar shadow on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Check whether the logged-in user is an authority
  useEffect(() => {
    async function checkAuthority() {
      if (!user) {
        setIsAuthority(false);
        return;
      }

      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Unable to check user role:", error);
        setIsAuthority(false);
        return;
      }

      setIsAuthority(data?.role === "authority");
    }

    checkAuthority();
  }, [user]);

  useEffect(() => {
  const handleClickOutside = (event) => {
    if (!event.target.closest("[data-pirs-menu]")) {
      setPirsMenuOpen(false);
    }
  };

  document.addEventListener("click", handleClickOutside);

  return () => {
    document.removeEventListener("click", handleClickOutside);
  };
}, []);

  const handleSignOut = async () => {
    await signOut();

    setMenuOpen(false);
    setPirsMenuOpen(false);

    navigate("/");
  };

  // Normal PIRS pages
  const mainNavLinks = [
    { to: "/", label: "Home", end: true },
    { to: "/report", label: "Report Issue", accent: true },
    { to: "/knowledge", label: "Knowledge" },
    ...(user ? [{ to: "/my-reports", label: "My Reports" }] : []),
  ];

  // Authority pages
  const authorityNavLinks = [
    { to: "/authority", label: "Dashboard", end: true },
    { to: "/authority/analytics", label: "Analytics" },
  ];

  const linkClass = ({ isActive }) =>
    [
      "rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
      isActive
        ? "bg-white/10 text-[#F7F5F1]"
        : "text-stone-300 hover:bg-white/5 hover:text-[#F7F5F1]",
    ].join(" ");

  const accentLinkClass = ({ isActive }) =>
    [
      "rounded-lg px-3 py-2 text-sm font-semibold transition-all duration-200",
      isActive
        ? "bg-[#FF6C16] text-[#F7F5F1] shadow-lg shadow-orange-500/25"
        : "text-[#FF6C16] hover:bg-orange-500/10",
    ].join(" ");

  return (
    <nav
      className={`sticky top-0 z-50 bg-[#241F1C] transition-all duration-300 ${
        scrolled ? "shadow-xl" : ""
      }`}
      style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
      aria-label="Main navigation"
    >
      {/* Main navbar row */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-[#F7F5F1] transition hover:opacity-90"
        >
          <img
            src="/pirs-icon.svg"
            alt=""
            className="h-8 w-8"
            aria-hidden="true"
          />

          <span className="text-lg font-black tracking-wide">PIRS</span>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden flex-1 items-center justify-center gap-1 md:flex">
          {isAuthority ? (
            <>
              {/* Authority links */}
              {authorityNavLinks.map(({ to, label, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={linkClass}
                >
                  {label}
                </NavLink>
              ))}

              {/* PIRS Menu */}
              <div className="relative" data-pirs-menu>
                <button
                  type="button"
                  onClick={() => setPirsMenuOpen((open) => !open)}
                  className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-stone-300 transition-all duration-200 hover:bg-white/5 hover:text-[#F7F5F1]"
                  aria-expanded={pirsMenuOpen}
                  aria-haspopup="menu"
                >
                  PIRS Menu

                  <ChevronDown
                    size={15}
                    className={`transition-transform duration-200 ${
                      pirsMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown */}
                {pirsMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-xl border border-white/10 bg-[#241F1C] p-2 shadow-2xl">
                    <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-stone-500">
                      PIRS Pages
                    </p>

                    {mainNavLinks.map(
                      ({ to, label, end, accent }) => (
                        <NavLink
                          key={to}
                          to={to}
                          end={end}
                          onClick={() => setPirsMenuOpen(false)}
                          className={({ isActive }) =>
                            [
                              "flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition",
                              isActive
                                ? "bg-white/10 text-[#F7F5F1]"
                                : "text-stone-300 hover:bg-white/5 hover:text-[#F7F5F1]",
                              accent ? "text-[#FF6C16]" : "",
                            ].join(" ")
                          }
                        >
                          {label}
                        </NavLink>
                      )
                    )}
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Normal user / visitor navigation */
            mainNavLinks.map(({ to, label, end, accent }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={accent ? accentLinkClass : linkClass}
              >
                {label}
              </NavLink>
            ))
          )}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Dark mode */}
          <button
            type="button"
            onClick={() => setDarkMode((previous) => !previous)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-stone-300 transition hover:bg-white/5 hover:text-[#F7F5F1]"
            aria-label={
              darkMode ? "Switch to light mode" : "Switch to dark mode"
            }
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
              <LogOut
                size={14}
                strokeWidth={2.25}
                aria-hidden="true"
              />

              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold text-[#F7F5F1] transition hover:bg-white/15"
            >
              <LogIn
                size={16}
                strokeWidth={2.25}
                aria-hidden="true"
              />

              Login
            </Link>
          )}

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => {
              setMenuOpen((open) => !open);
              setPirsMenuOpen(false);
            }}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-stone-300 transition hover:bg-white/5 hover:text-[#F7F5F1] md:hidden"
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
            {isAuthority ? (
              <>
                {/* Authority pages */}
                {authorityNavLinks.map(({ to, label, end }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={end}
                    className={linkClass}
                    onClick={() => setMenuOpen(false)}
                  >
                    {label}
                  </NavLink>
                ))}

                {/* Normal PIRS pages */}
                <div className="mt-2 border-t border-white/10 pt-2">
                  <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-stone-500">
                    PIRS Pages
                  </p>

                  {mainNavLinks.map(
                    ({ to, label, end, accent }) => (
                      <NavLink
                        key={to}
                        to={to}
                        end={end}
                        className={
                          accent
                            ? accentLinkClass
                            : linkClass
                        }
                        onClick={() => setMenuOpen(false)}
                      >
                        {label}
                      </NavLink>
                    )
                  )}
                </div>
              </>
            ) : (
              /* Normal user / visitor mobile navigation */
              mainNavLinks.map(
                ({ to, label, end, accent }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={end}
                    className={
                      accent ? accentLinkClass : linkClass
                    }
                    onClick={() => setMenuOpen(false)}
                  >
                    {label}
                  </NavLink>
                )
              )
            )}

            {/* Mobile login/logout */}
            {user ? (
              <button
                type="button"
                onClick={handleSignOut}
                className="mt-2 inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-left text-sm font-medium text-red-400 transition hover:bg-white/5"
              >
                <LogOut
                  size={16}
                  strokeWidth={2.25}
                  aria-hidden="true"
                />

                Logout
              </button>
            ) : (
              <NavLink
                to="/login"
                className={linkClass}
                onClick={() => setMenuOpen(false)}
              >
                <span className="inline-flex items-center gap-1.5">
                  <LogIn
                    size={16}
                    strokeWidth={2.25}
                    aria-hidden="true"
                  />

                  Login
                </span>
              </NavLink>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;