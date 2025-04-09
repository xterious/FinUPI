import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { mockActiveLoans } from "../mockData";

const Repayments = () => {
  const [activeLoans, setActiveLoans] = useState([]);
  const [repaymentHistory, setRepaymentHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call with setTimeout
    setTimeout(() => {
      // Add more details to the mock active loans
      const enhancedLoans = mockActiveLoans.map((loan) => ({
        ...loan,
        progressPercent: Math.floor((loan.repaid / loan.totalAmount) * 100),
        daysLeft: calculateDaysLeft(loan.dueDate),
      }));

      setActiveLoans(enhancedLoans);

      // Mock repayment history
      setRepaymentHistory([
        {
          id: "payment1",
          loanId: "loan1",
          amount: 1000,
          date: "2023-06-30",
          status: "completed",
          method: "UPI Auto-debit",
        },
        {
          id: "payment2",
          loanId: "loan1",
          amount: 2000,
          date: "2023-07-02",
          status: "completed",
          method: "Manual UPI payment",
        },
        {
          id: "payment3",
          loanId: "prevloan1",
          amount: 3000,
          date: "2023-06-15",
          status: "completed",
          method: "UPI Auto-debit",
        },
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const calculateDaysLeft = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-primary mb-6">Repayments</h1>

      {/* Active Loans */}
      <div className="card mb-6">
        <h2 className="text-xl font-bold mb-6 text-primary">Active Loans</h2>

        {activeLoans.length > 0 ? (
          activeLoans.map((loan) => (
            <div
              key={loan.id}
              className="border-b border-secondary pb-6 mb-6 last:border-b-0 last:pb-0 last:mb-0"
            >
              <div className="flex flex-col md:flex-row justify-between md:items-center mb-4">
                <div>
                  <h3 className="font-bold text-lg">
                    Loan #{loan.id.slice(-4)}
                  </h3>
                  <p className="text-text-muted text-sm">
                    Started on {loan.startDate}
                  </p>
                </div>
                <div className="mt-2 md:mt-0">
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      loan.daysLeft > 5
                        ? "bg-green-900/30 text-green-400"
                        : loan.daysLeft > 0
                        ? "bg-yellow-900/30 text-yellow-400"
                        : "bg-red-900/30 text-red-400"
                    }`}
                  >
                    {loan.daysLeft > 0
                      ? `Due in ${loan.daysLeft} days`
                      : loan.daysLeft === 0
                      ? "Due today"
                      : "Overdue"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-text-muted text-sm">Loan Amount</p>
                  <p className="font-bold">₹{loan.amount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-text-muted text-sm">Total Repayment</p>
                  <p className="font-bold">
                    ₹{loan.totalAmount.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-text-muted text-sm">Due Date</p>
                  <p className="font-bold">{loan.dueDate}</p>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-text-muted">Repayment Progress</span>
                  <span className="text-text-muted">
                    ₹{loan.repaid.toLocaleString()} of ₹
                    {loan.totalAmount.toLocaleString()}({loan.progressPercent}%)
                  </span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2.5">
                  <div
                    className="bg-primary h-2.5 rounded-full"
                    style={{ width: `${loan.progressPercent}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
                <button className="btn-primary">Make Payment</button>
                <button className="btn-secondary">View Details</button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-text-muted">You don't have any active loans.</p>
        )}
      </div>

      {/* Repayment History */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-primary">Payment History</h2>
        </div>

        {repaymentHistory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-primary/30">
                <tr>
                  <th className="py-2 text-left text-text-muted">Date</th>
                  <th className="py-2 text-left text-text-muted">Loan ID</th>
                  <th className="py-2 text-left text-text-muted">Amount</th>
                  <th className="py-2 text-left text-text-muted">Method</th>
                  <th className="py-2 text-left text-text-muted">Status</th>
                </tr>
              </thead>
              <tbody>
                {repaymentHistory.map((payment) => (
                  <tr key={payment.id} className="border-b border-secondary">
                    <td className="py-3">{payment.date}</td>
                    <td className="py-3">#{payment.loanId.slice(-4)}</td>
                    <td className="py-3">₹{payment.amount.toLocaleString()}</td>
                    <td className="py-3">{payment.method}</td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          payment.status === "completed"
                            ? "bg-green-900/30 text-green-400"
                            : payment.status === "pending"
                            ? "bg-yellow-900/30 text-yellow-400"
                            : "bg-red-900/30 text-red-400"
                        }`}
                      >
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-text-muted">No payment history found.</p>
        )}
      </div>

      {/* Information Card */}
      <div className="card mt-6 bg-secondary p-4">
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
            <h3 className="font-bold text-primary">Automatic Repayments</h3>
            <p className="text-sm text-text-muted">
              Your loan installment will be automatically debited from your UPI
              account on the due date. Make sure you have sufficient balance to
              avoid late payment fees.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Repayments;
