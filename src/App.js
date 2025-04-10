import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useState, useEffect } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { onAuthStateChanged as dummyAuthStateChanged } from "./utils/dummyAuth";

// Import pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CreditScore from "./pages/CreditScore";
import Profile from "./pages/Profile";
import ApplyLoan from "./pages/ApplyLoan";
import LoanOffers from "./pages/LoanOffers";
import Repayments from "./pages/Repayments";

// Import components
import Navbar from "./components/Navbar";
import Spinner from "./components/Spinner";

// Wrap the app with the Router
function AppWithRouter() {
  return (
    <Router>
      <App />
    </Router>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if we should use dummy auth
  const isDevelopment = process.env.NODE_ENV === "development";
  const forceDummyAuth = true; // Set to false in production
  const useDummyAuth = isDevelopment || forceDummyAuth;

  useEffect(() => {
    console.log("Setting up auth state listener, dummy auth:", useDummyAuth);

    // Handle authentication state changes
    const unsubscribe = useDummyAuth
      ? dummyAuthStateChanged((user) => {
          console.log("Dummy auth state changed:", user);
          setUser(user);
          setLoading(false);
        })
      : onAuthStateChanged(auth, (user) => {
          console.log("Firebase auth state changed:", user);
          setUser(user);
          setLoading(false);
        });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [useDummyAuth]);

  // Debug current auth state
  useEffect(() => {
    console.log("Current auth state - User:", user, "Loading:", loading);
  }, [user, loading]);

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <Spinner size="large" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-text">
      {user && <Navbar user={user} />}
      <main className="flex-grow">
        <Routes>
          <Route
            path="/login"
            element={user ? <Navigate to="/dashboard" /> : <Login />}
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute user={user}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/credit-score"
            element={
              <ProtectedRoute user={user}>
                <CreditScore />
              </ProtectedRoute>
            }
          />
          <Route
            path="/apply-loan"
            element={
              <ProtectedRoute user={user}>
                <ApplyLoan />
              </ProtectedRoute>
            }
          />
          <Route
            path="/loan-offers"
            element={
              <ProtectedRoute user={user}>
                <LoanOffers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/repayments"
            element={
              <ProtectedRoute user={user}>
                <Repayments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute user={user}>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={<Navigate to={user ? "/dashboard" : "/login"} />}
          />
          <Route
            path="*"
            element={<Navigate to={user ? "/dashboard" : "/login"} />}
          />
        </Routes>
      </main>
    </div>
  );
}

// Protected route component
function ProtectedRoute({ user, children }) {
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default AppWithRouter;
