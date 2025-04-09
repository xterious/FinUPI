import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { mockLoanOffers, mockCreditScore } from "../mockData";

const ApplyLoan = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [userScore, setUserScore] = useState(null);
  const [loanDetails, setLoanDetails] = useState({
    amount: 0,
    duration: 0,
    interest: 0,
    totalRepayment: 0,
    accountNumber: "",
    ifscCode: "",
    upiId: "",
    acceptTerms: false,
  });

  useEffect(() => {
    // Parse the loan parameters from the route param
    const params = id.split("-");
    if (params.length === 2) {
      const amount = parseInt(params[0], 10);
      const duration = parseInt(params[1], 10);

      // Find the appropriate interest rate based on the loan amount
      const matchingOffer = mockLoanOffers.find(
        (offer) => amount >= offer.minAmount && amount <= offer.maxAmount
      );

      const interestRate = matchingOffer ? matchingOffer.interestRate : 2.5;
      const interestAmount = (amount * interestRate * duration) / (100 * 30);
      const totalRepayment = amount + interestAmount;

      setLoanDetails({
        ...loanDetails,
        amount,
        duration,
        interest: interestRate,
        totalRepayment,
      });

      // Load user score
      setUserScore(mockCreditScore);
      setLoading(false);
    } else {
      setError("Invalid loan parameters");
      setLoading(false);
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLoanDetails({
      ...loanDetails,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    // Validate form
    if (!loanDetails.upiId) {
      setError("UPI ID is required");
      setSubmitting(false);
      return;
    }

    if (!loanDetails.acceptTerms) {
      setError("You must accept the terms and conditions");
      setSubmitting(false);
      return;
    }

    // Simulate API call with setTimeout
    setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);

      // Redirect to dashboard after showing success message
      setTimeout(() => {
        navigate("/dashboard");
      }, 3000);
    }, 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="card max-w-md mx-auto text-center py-8">
          <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-primary"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-primary mb-4">
            Loan Approved!
          </h1>
          <p className="text-text-muted mb-6">
            Your loan of ₹{loanDetails.amount} has been approved and will be
            transferred to your UPI account shortly.
          </p>
          <p className="text-text-muted">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-primary mb-6">Apply for Loan</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="card">
            <h2 className="text-xl font-bold mb-6 text-primary">
              Loan Application
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <h3 className="font-bold mb-4 border-b border-primary/30 pb-2">
                  Loan Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-text-muted mb-2">
                      Loan Amount
                    </label>
                    <div className="bg-secondary p-3 rounded-lg">
                      <p className="text-xl font-bold">
                        ₹{loanDetails.amount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-text-muted mb-2">
                      Duration
                    </label>
                    <div className="bg-secondary p-3 rounded-lg">
                      <p className="text-xl font-bold">
                        {loanDetails.duration} days
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-text-muted mb-2">
                      Interest Rate
                    </label>
                    <div className="bg-secondary p-3 rounded-lg">
                      <p className="text-xl font-bold">
                        {loanDetails.interest}%
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-text-muted mb-2">
                      Total Repayment
                    </label>
                    <div className="bg-secondary p-3 rounded-lg">
                      <p className="text-xl font-bold text-primary">
                        ₹{loanDetails.totalRepayment.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-bold mb-4 border-b border-primary/30 pb-2">
                  Payment Details
                </h3>

                <div className="mb-4">
                  <label className="block text-text-muted mb-2" htmlFor="upiId">
                    UPI ID
                  </label>
                  <input
                    type="text"
                    id="upiId"
                    name="upiId"
                    className="input w-full"
                    placeholder="yourname@upi"
                    value={loanDetails.upiId}
                    onChange={handleChange}
                    required
                  />
                  <p className="text-sm text-text-muted mt-1">
                    Loan amount will be credited to this UPI ID
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="acceptTerms"
                    name="acceptTerms"
                    className="mt-1 mr-2"
                    checked={loanDetails.acceptTerms}
                    onChange={handleChange}
                    required
                  />
                  <label
                    htmlFor="acceptTerms"
                    className="text-sm text-text-muted"
                  >
                    I agree to the{" "}
                    <a href="#" className="text-primary">
                      Terms and Conditions
                    </a>{" "}
                    and authorize FinUPI to debit my account on the due date for
                    loan repayment.
                  </label>
                </div>
              </div>

              {error && (
                <div className="bg-red-900/20 text-red-400 p-3 rounded-lg mb-4">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="btn-primary w-full"
                disabled={submitting}
              >
                {submitting ? "Processing..." : "Confirm Application"}
              </button>
            </form>
          </div>
        </div>

        <div>
          <div className="card mb-6">
            <h3 className="font-bold mb-4 text-primary">Your Credit Score</h3>
            <div className="flex items-center justify-center mb-4">
              <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center">
                <span className="text-3xl font-bold text-primary">
                  {userScore?.score}
                </span>
              </div>
            </div>
            <p className="text-center text-text-muted text-sm">
              {userScore?.level}: {userScore?.message}
            </p>
          </div>

          <div className="card">
            <h3 className="font-bold mb-4 text-primary">
              Important Information
            </h3>
            <ul className="space-y-2 text-sm text-text-muted">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Loan will be instantly credited to your UPI account</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Repayment will be auto-debited on the due date</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Early repayment is allowed without any penalty</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Late payment will affect your credit score</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyLoan;
