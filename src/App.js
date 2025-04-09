import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CreditScore from "./pages/CreditScore";
import LoanOffers from "./pages/LoanOffers";
import ApplyLoan from "./pages/ApplyLoan";
import Repayments from "./pages/Repayments";
import Profile from "./pages/Profile";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Real Firebase authentication
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-background">
        {user && <Navbar />}
        <div className="flex-grow">
          <Routes>
            <Route
              path="/"
              element={user ? <Navigate to="/dashboard" /> : <Login />}
            />
            <Route
              path="/dashboard"
              element={user ? <Dashboard /> : <Navigate to="/" />}
            />
            <Route
              path="/credit-score"
              element={user ? <CreditScore /> : <Navigate to="/" />}
            />
            <Route
              path="/loan-offers"
              element={user ? <LoanOffers /> : <Navigate to="/" />}
            />
            <Route
              path="/apply-loan/:id"
              element={user ? <ApplyLoan /> : <Navigate to="/" />}
            />
            <Route
              path="/repayments"
              element={user ? <Repayments /> : <Navigate to="/" />}
            />
            <Route
              path="/profile"
              element={user ? <Profile /> : <Navigate to="/" />}
            />
          </Routes>
        </div>
        {user && <Footer />}
      </div>
    </Router>
  );
}

export default App;
