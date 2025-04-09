import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-background-light py-6 border-t border-primary/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link to="/dashboard" className="flex items-center">
              <span className="text-xl font-bold text-primary">FinUPI</span>
            </Link>
            <p className="text-sm text-text-muted mt-2">
              Instant Microloans for Everyone
            </p>
          </div>

          <div className="flex space-x-6">
            <a
              href="#"
              className="text-text-muted hover:text-primary text-sm"
              onClick={(e) => e.preventDefault()}
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-text-muted hover:text-primary text-sm"
              onClick={(e) => e.preventDefault()}
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-text-muted hover:text-primary text-sm"
              onClick={(e) => e.preventDefault()}
            >
              Contact Us
            </a>
          </div>
        </div>

        <div className="mt-6 border-t border-secondary pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-text-muted mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} FinUPI | All rights reserved
          </p>

          <div className="flex items-center space-x-6">
            <span className="text-xs bg-primary/20 text-primary px-3 py-1 rounded-full">
              Hackathon Edition
            </span>

            <span className="text-xs text-text-muted">
              Made with ❤️ in 24 hours
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
