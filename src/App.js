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
import { onAuthStateChanged as dummyAuthStateChanged, getCurrentUser } from "./utils/dummyAuth";

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
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      console.log("Initial user from localStorage:", savedUser);
      if (savedUser) {
        // Try to parse the user from localStorage
        const parsedUser = JSON.parse(savedUser);
        console.log("Restored user from localStorage:", parsedUser);
        return parsedUser;
      }
    } catch (error) {
      console.error("Error loading user from localStorage:", error);
      localStorage.removeItem("user"); // Clear corrupted data
    }
    return null;
  });
  // Initialize loading to false if we already have a user from localStorage
  const [loading, setLoading] = useState(!user);
  const location = useLocation();

  // Check if we should use dummy auth
  const isDevelopment = process.env.NODE_ENV === "development";
  const forceDummyAuth = true; // Set to false in production
  const useDummyAuth = isDevelopment || forceDummyAuth;

  useEffect(() => {
    console.log("Setting up auth state listener, dummy auth:", useDummyAuth);

    // If we already have a user from localStorage, we don't need to wait for auth
    if (user) {
      // If we already have a user from localStorage, update the state in dummyAuth
      if (useDummyAuth && !getCurrentUser()) {
        console.log("Restoring user session from localStorage");
      }
      setLoading(false);
      return; // Early return to avoid setting up auth listener if we have user
    }

    // Handle authentication state changes
    const unsubscribe = useDummyAuth
      ? dummyAuthStateChanged((authUser) => {
          console.log("Dummy auth state changed:", authUser);
          if (authUser) {
            localStorage.setItem("user", JSON.stringify(authUser));
          }
          setUser(authUser);
          setLoading(false);
        })
      : onAuthStateChanged(auth, (authUser) => {
          console.log("Firebase auth state changed:", authUser);
          if (authUser) {
            localStorage.setItem("user", JSON.stringify(authUser));
          }
          setUser(authUser);
          setLoading(false);
        });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [useDummyAuth]); // Remove user dependency

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

  // If user exists and we're at the login page, redirect to dashboard
  if (user && location.pathname === "/login") {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-text">
      {user && <Navbar user={user} />}
      <main className="flex-grow">
        <Routes>
          <Route
            path="/login"
            element={
              user ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Login />
              )
            }
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
            element={
              <Navigate to={user ? "/dashboard" : "/login"} replace />
            }
          />
          <Route
            path="*"
            element={
              <Navigate to={user ? "/dashboard" : "/login"} replace />
            }
          />
        </Routes>
      </main>
    </div>
  );
}

// Protected route component
function ProtectedRoute({ user, children }) {
  const location = useLocation();
  
  // Check if user is null
  if (!user) {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        // If we have a valid user in localStorage, render the children directly
        // This prevents an infinite spinner loop
        return children;
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
        localStorage.removeItem("user");
      }
    }
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default AppWithRouter;
