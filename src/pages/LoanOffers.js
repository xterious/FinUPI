import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// Mock data (would come from Firebase in production)
import { mockLoanOffers, mockCreditScore } from "../mockData";

const LoanOffers = () => {
  const [offers, setOffers] = useState([]);
  const [userScore, setUserScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedAmount, setSelectedAmount] = useState(5000);
  const [selectedDuration, setSelectedDuration] = useState(7);

  useEffect(() => {
    // Simulate API call with setTimeout
    setTimeout(() => {
      setOffers(mockLoanOffers);
      setUserScore(mockCreditScore);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const interestRate = offers.length > 0 ? offers[0].interestRate : 0;
  const totalInterest =
    (selectedAmount * interestRate * selectedDuration) / (100 * 30);
  const totalRepayment = selectedAmount + totalInterest;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-primary mb-6">Loan Offers</h1>

      {/* Loan Calculator Section */}
      <div className="card mb-6">
        <h2 className="text-xl font-bold mb-4 text-primary">Loan Calculator</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="mb-6">
              <label className="block text-text-muted mb-2">
                Loan Amount (₹{selectedAmount})
              </label>
              <input
                type="range"
                min="1000"
                max="50000"
                step="1000"
                value={selectedAmount}
                onChange={(e) => setSelectedAmount(Number(e.target.value))}
                className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-text-muted mt-1">
                <span>₹1,000</span>
                <span>₹50,000</span>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-text-muted mb-2">
                Loan Duration ({selectedDuration} days)
              </label>
              <input
                type="range"
                min="1"
                max="30"
                step="1"
                value={selectedDuration}
                onChange={(e) => setSelectedDuration(Number(e.target.value))}
                className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-text-muted mt-1">
                <span>1 day</span>
                <span>30 days</span>
              </div>
            </div>
          </div>

          <div className="bg-secondary p-4 rounded-lg">
            <h3 className="font-bold mb-4">Loan Summary</h3>

            <div className="flex justify-between mb-3">
              <span className="text-text-muted">Loan Amount</span>
              <span className="font-bold">₹{selectedAmount.toFixed(2)}</span>
            </div>

            <div className="flex justify-between mb-3">
              <span className="text-text-muted">Interest Rate</span>
              <span className="font-bold">{interestRate}% per month</span>
            </div>

            <div className="flex justify-between mb-3">
              <span className="text-text-muted">Interest Amount</span>
              <span className="font-bold">₹{totalInterest.toFixed(2)}</span>
            </div>

            <div className="flex justify-between mb-3">
              <span className="text-text-muted">Duration</span>
              <span className="font-bold">{selectedDuration} days</span>
            </div>

            <div className="border-t border-primary/30 pt-3 mt-3">
              <div className="flex justify-between">
                <span className="font-bold">Total Repayment</span>
                <span className="font-bold text-primary">
                  ₹{totalRepayment.toFixed(2)}
                </span>
              </div>
            </div>

            <Link
              to={`/apply-loan/${selectedAmount}-${selectedDuration}`}
              className="btn-primary w-full text-center mt-4"
            >
              Apply Now
            </Link>
          </div>
        </div>
      </div>

      {/* Available Offers Section */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4 text-primary">
          Available Loan Packages
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Small Quick Loan */}
          <div className="border border-primary/30 rounded-lg p-4 relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-20 h-20 bg-primary/20 rounded-full"></div>
            <h3 className="font-bold text-lg mb-2">Quick Cash</h3>
            <div className="mb-4">
              <span className="text-2xl font-bold">₹1,000 - ₹5,000</span>
              <span className="block text-sm text-text-muted">1-7 days</span>
            </div>
            <ul className="text-sm space-y-2 mb-4">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Instant approval</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>No paperwork needed</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Repay anytime</span>
              </li>
            </ul>
            <Link
              to="/apply-loan/5000-7"
              className="btn-primary inline-block w-full text-center"
            >
              Apply Now
            </Link>
          </div>

          {/* Medium Loan */}
          <div className="border border-primary/30 rounded-lg p-4 relative overflow-hidden bg-secondary-light">
            <div className="absolute -right-6 -top-6 bg-primary rounded-full px-3 py-1 transform rotate-45 text-xs font-bold text-secondary">
              Popular
            </div>
            <h3 className="font-bold text-lg mb-2">Flexible Loan</h3>
            <div className="mb-4">
              <span className="text-2xl font-bold">₹5,000 - ₹20,000</span>
              <span className="block text-sm text-text-muted">7-14 days</span>
            </div>
            <ul className="text-sm space-y-2 mb-4">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Approval in 5 minutes</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Lower interest rate</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Flexible repayment options</span>
              </li>
            </ul>
            <Link
              to="/apply-loan/15000-14"
              className="btn-primary inline-block w-full text-center"
            >
              Apply Now
            </Link>
          </div>

          {/* Large Loan */}
          <div className="border border-primary/30 rounded-lg p-4 relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-20 h-20 bg-primary/20 rounded-full"></div>
            <h3 className="font-bold text-lg mb-2">Premium Loan</h3>
            <div className="mb-4">
              <span className="text-2xl font-bold">₹20,000 - ₹50,000</span>
              <span className="block text-sm text-text-muted">14-30 days</span>
            </div>
            <ul className="text-sm space-y-2 mb-4">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Best interest rates</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Longer repayment terms</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Premium customer service</span>
              </li>
            </ul>
            <Link
              to="/apply-loan/30000-30"
              className="btn-primary inline-block w-full text-center"
            >
              Apply Now
            </Link>
          </div>
        </div>

        <div className="mt-6 p-4 bg-secondary rounded-lg">
          <div className="flex items-start">
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/20 flex-shrink-0 mr-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-primary"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-primary">Boost Your Loan Limit</h3>
              <p className="text-sm text-text-muted">
                Your current FinUPI score of {userScore?.score} qualifies you
                for loans up to ₹{userScore?.loanLimit || offers[0]?.maxAmount}.
                Refer friends, make timely repayments, and increase your UPI
                usage to qualify for higher loan amounts.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanOffers;
