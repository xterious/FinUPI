import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { auth, useDummyAuth } from "../firebase";
import { signOut } from "firebase/auth";

const Navbar = ({ user }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if the current route matches the given path
  const isActive = (path) => location.pathname === path;

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = async () => {
    try {
      if (useDummyAuth) {
        // Use dummy auth's signOut method
        await auth.signOut();
      } else {
        // Use Firebase's signOut method
        await signOut(auth);
      }
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <nav className="bg-secondary text-white py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/dashboard" className="text-2xl font-bold text-primary">
          FinUPI
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          <Link
            to="/dashboard"
            className={`hover:text-primary transition-colors ${
              isActive("/dashboard") ? "text-primary font-medium" : ""
            }`}
          >
            Dashboard
          </Link>
          <Link
            to="/credit-score"
            className={`hover:text-primary transition-colors ${
              isActive("/credit-score") ? "text-primary font-medium" : ""
            }`}
          >
            Credit Score
          </Link>
          <Link
            to="/loan-offers"
            className={`hover:text-primary transition-colors ${
              isActive("/loan-offers") ? "text-primary font-medium" : ""
            }`}
          >
            Loan Offers
          </Link>
          <Link
            to="/repayments"
            className={`hover:text-primary transition-colors ${
              isActive("/repayments") ? "text-primary font-medium" : ""
            }`}
          >
            Repayments
          </Link>
          <div className="relative group ml-4">
            <button className="flex items-center space-x-1">
              <span>{user?.displayName || "User"}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-card border border-gray-700 rounded shadow-lg py-1 z-10 hidden group-hover:block">
              <Link
                to="/profile"
                className="block px-4 py-2 hover:bg-secondary-light"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 hover:bg-secondary-light"
              >
                Logout
              </button>
              {useDummyAuth && (
                <div className="px-4 py-2 text-xs text-amber-200 bg-amber-900/30">
                  Using dummy auth
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={toggleMenu}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {menuOpen ? (
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

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-secondary-light mt-2 py-2">
          <div className="container mx-auto px-4 flex flex-col space-y-2">
            <Link
              to="/dashboard"
              className={`py-2 ${
                isActive("/dashboard") ? "text-primary font-medium" : ""
              }`}
              onClick={toggleMenu}
            >
              Dashboard
            </Link>
            <Link
              to="/credit-score"
              className={`py-2 ${
                isActive("/credit-score") ? "text-primary font-medium" : ""
              }`}
              onClick={toggleMenu}
            >
              Credit Score
            </Link>
            <Link
              to="/loan-offers"
              className={`py-2 ${
                isActive("/loan-offers") ? "text-primary font-medium" : ""
              }`}
              onClick={toggleMenu}
            >
              Loan Offers
            </Link>
            <Link
              to="/repayments"
              className={`py-2 ${
                isActive("/repayments") ? "text-primary font-medium" : ""
              }`}
              onClick={toggleMenu}
            >
              Repayments
            </Link>
            <Link
              to="/profile"
              className={`py-2 ${
                isActive("/profile") ? "text-primary font-medium" : ""
              }`}
              onClick={toggleMenu}
            >
              Profile
            </Link>
            <button
              onClick={() => {
                handleLogout();
                toggleMenu();
              }}
              className="py-2 text-left"
            >
              Logout
            </button>
            {useDummyAuth && (
              <div className="px-2 py-1 text-xs text-amber-200 bg-amber-900/30 rounded">
                Using dummy auth mode
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
