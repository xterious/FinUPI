import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      // App.js will redirect to login page
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const navLinks = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/credit-score", label: "Credit Score" },
    { path: "/loan-offers", label: "Loan Offers" },
    { path: "/repayments", label: "Repayments" },
    { path: "/profile", label: "Profile" },
  ];

  return (
    <nav className="bg-background-light py-4 border-b border-primary/30">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center">
            <span className="text-2xl font-bold text-primary">FinUPI</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm ${
                  location.pathname === link.path
                    ? "text-primary font-bold"
                    : "text-text hover:text-primary"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={handleSignOut}
              className="text-sm text-text hover:text-primary"
            >
              Sign Out
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-text hover:text-primary focus:outline-none"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block py-2 px-4 rounded-lg ${
                  location.pathname === link.path
                    ? "bg-primary/20 text-primary font-bold"
                    : "text-text hover:bg-secondary-light hover:text-primary"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={handleSignOut}
              className="block w-full text-left py-2 px-4 rounded-lg text-text hover:bg-secondary-light hover:text-primary"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
