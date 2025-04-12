import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { auth } from "../firebase";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import axios from "axios";

// Mock data (would come from Firebase in production)
import { mockTransactions, mockCreditScore, mockLoanOffers } from "../mockData";

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const userTransactions1 = {
    "user_id" : 8754512892
  }
  
  const userTransactions2 = {
    "user_id" : 7001400312
  }
  const [userScore, setUserScore] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loanOffers, setLoanOffers] = useState([]);
  const [activeLoans, setActiveLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, fetch this data from Firebase
    // Simulate API call with setTimeout
    setTimeout(() => {
      // setUserScore(mockCreditScore);
      // setTransactions(mockTransactions.slice(0, 5)); // Show only 5 recent transactions
      setLoanOffers(mockLoanOffers);
      setActiveLoans([
        {
          id: "loan1",
          amount: 5000,
          dueDate: "2023-07-15",
          interest: 2.5,
          progress: 75,
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  //calling api to get credit score
  useEffect(() => {
    const fetchCreditScore = async () => {
      try {
        const response = await axios.post("http://localhost:5000/get_credit_score", userTransactions1);
        
        // Update local state
        setUserScore(response.data.credit_score);
        setTransactions(response.data.last_5_transactions);
        
        // Store credit score data in localStorage
        localStorage.setItem('creditScore', response.data.credit_score);
        localStorage.setItem('maxLoanAmount', response.data.loan_eligibility?.max_loan_amount || 5000);
        localStorage.setItem('maxLoanDuration', response.data.loan_eligibility?.max_duration_months || 12);
        localStorage.setItem('scoreCategory', response.data.score_category || "Unknown");
        localStorage.setItem('lastUpdated', new Date().toISOString());
        
      } catch (error) {
        console.error("Error fetching credit score:", error);
      }
    };
    fetchCreditScore();
  }, []);

  const scoreChartData = {
    datasets: [
      {
        data: [userScore || 0, 100 - (userScore || 0)],
        backgroundColor: ["#00ff7f", "#333333"],
        borderWidth: 0,
        cutout: "80%",
      },
    ],
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Credit Score Section */}
        <div className="card">
          <h2 className="text-xl font-bold mb-4 text-primary">
            Your FinUPI Score
          </h2>
          <div className="flex flex-col items-center">
            <div className="w-40 h-40 relative mb-4">
              <Doughnut data={scoreChartData} />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <span className="text-3xl font-bold text-primary">
                    {userScore}
                  </span>
                  <span className="text-xs block text-text-muted">/100</span>
                </div>
              </div>
            </div>
            <div className="text-center">
              <p className="text-text-muted mb-2">{userScore?.message}</p>
              <Link to="/credit-score" className="btn-primary inline-block">
                View Details
              </Link>
            </div>
          </div>
        </div>

        {/* Loan Offers Section */}
        <div className="card">
          <h2 className="text-xl font-bold mb-4 text-primary">Loan Offers</h2>
          {loanOffers.length > 0 ? (
            <div>
              <div className="mb-4">
                <p className="text-text-muted mb-2">
                  Based on your score, you're eligible for:
                </p>
                <div className="bg-secondary p-3 rounded-lg">
                  <p className="text-2xl font-bold text-primary">
                    ₹{loanOffers[0].maxAmount}
                  </p>
                  <p className="text-sm text-text-muted">
                    at {loanOffers[0].interestRate}% interest
                  </p>
                </div>
              </div>
              <Link
                to="/loan-offers"
                className="btn-primary inline-block w-full text-center"
              >
                View All Offers
              </Link>
            </div>
          ) : (
            <p className="text-text-muted">
              No loan offers available yet. Complete your profile to get
              started.
            </p>
          )}
        </div>

        {/* Active Loans Section */}
        <div className="card">
          <h2 className="text-xl font-bold mb-4 text-primary">Active Loans</h2>
          {activeLoans.length > 0 ? (
            activeLoans.map((loan) => (
              <div key={loan.id} className="mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-text-muted">Loan Amount</span>
                  <span className="font-bold">₹{loan.amount}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-text-muted">Due Date</span>
                  <span className="font-bold">{loan.dueDate}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-text-muted">Interest Rate</span>
                  <span className="font-bold">{loan.interest}%</span>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-text-muted mb-1">
                    Repayment Progress
                  </p>
                  <div className="w-full bg-secondary rounded-full h-2.5">
                    <div
                      className="bg-primary h-2.5 rounded-full"
                      style={{ width: `${loan.progress}%` }}
                    ></div>
                  </div>
                </div>
                <Link
                  to="/repayments"
                  className="btn-secondary inline-block w-full text-center mt-4"
                >
                  View Details
                </Link>
              </div>
            ))
          ) : (
            <p className="text-text-muted">
              You don't have any active loans. Check out our offers to get
              started.
            </p>
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-primary">
            Recent Transactions
          </h2>
          <button className="text-primary hover:underline">View All</button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-primary/30">
              <tr>
                <th className="py-2 text-left text-text-muted">Date</th>
                <th className="py-2 text-left text-text-muted">Sender</th>
                <th className="py-2 text-left text-text-muted">Receiver</th>
                <th className="py-2 text-left text-text-muted">Amount</th>
                <th className="py-2 text-left text-text-muted">Type</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, index) => (
                <tr key={index} className="border-b border-secondary">
                  <td className="py-2">{tx.Timestamp}</td>
                  <td className="py-2">{tx.sender_upi_id}</td>
                  <td className="py-2">{tx.receiver_upi_id}</td>
                  <td className="py-2">{tx.amount}</td>
                  <td className="py-2">
                    <span
                      className={`px-2 py-1 rounded text-xs ${tx.Type === "Sent"
                          ? "bg-red-900 text-red-300" : "bg-green-900 text-green-300"
                        }`}
                    >
                      {tx.Type}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
