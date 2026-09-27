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

// Redirects logged-in users away from login/register pages
function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/my-reports" replace /> : children;
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
          <Route path="/knowledge" element={<Knowledge />} />
        </Routes>

        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;