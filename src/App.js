import Knowledge from "./pages/Knowledge";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ReportIssue from "./pages/ReportIssue";
import MyReports from "./pages/MyReports";
import Footer from "./components/Footer";
import AuthorityDashboard from "./pages/AuthorityDashboard";
import AuthorityAnalytics from "./pages/AuthorityAnalytics";
import { supabase } from "./supabaseClient";
import { useEffect, useState } from "react";


// Redirects logged-in users away from login/register pages
function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/my-reports" replace /> : children;
}

function ProtectedAuthorityRoute({ children }) {
  const { user, loading } = useAuth();
  const [checkingRole, setCheckingRole] = useState(true);
  const [isAuthority, setIsAuthority] = useState(false);

  useEffect(() => {
    async function checkAuthority() {
      if (!user) {
        setIsAuthority(false);
        setCheckingRole(false);
        return;
      }

      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Unable to verify authority:", error);
        setIsAuthority(false);
      } else {
        setIsAuthority(data?.role === "authority");
      }

      setCheckingRole(false);
    }

    checkAuthority();
  }, [user]);

  if (loading || checkingRole) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F5F1] dark:bg-[#1C1917]">
        <p className="text-stone-600 dark:text-stone-300">
          Checking access...
        </p>
      </div>
    );
  }

  if (!user || !isAuthority) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          <Route path="/report" element={<ReportIssue />} />
          <Route path="/my-reports" element={<MyReports />} />
          <Route
  path="/authority"
  element={
    <ProtectedAuthorityRoute>
      <AuthorityDashboard />
    </ProtectedAuthorityRoute>
  }
/>

<Route
  path="/authority/analytics"
  element={
    <ProtectedAuthorityRoute>
      <AuthorityAnalytics />
    </ProtectedAuthorityRoute>
  }
/>
          <Route path="/knowledge" element={<Knowledge />} />
        </Routes>

        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;