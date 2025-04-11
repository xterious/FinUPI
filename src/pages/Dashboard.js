import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { auth } from "../firebase";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import axios from "axios";

// Mock data (would come from Firebase in production)
import { mockTransactions, mockCreditScore, mockLoanOffers } from "../mockData";

ChartJS.register(ArcElement, Tooltip, Legend);
const userTransactions1 = {
  "transactions": [
    {
      "Timestamp": "2025-01-01T09:00:00",
      "Sender UPI ID": "user@upi",
      "Receiver UPI ID": "alice@upi",
      "Amount (INR)": 1000,
      "Status": "SUCCESS",
      "Type": "Sent",
      "To Type": "P2P"
    },
    {
      "Timestamp": "2025-01-01T10:00:00",
      "Sender UPI ID": "alice@upi",
      "Receiver UPI ID": "bob@upi",
      "Amount (INR)": 500,
      "Status": "SUCCESS",
      "Type": "Sent",
      "To Type": "P2P"
    },
    {
      "Timestamp": "2025-01-01T11:00:00",
      "Sender UPI ID": "bob@upi",
      "Receiver UPI ID": "charlie@upi",
      "Amount (INR)": 300,
      "Status": "SUCCESS",
      "Type": "Sent",
      "To Type": "P2P"
    },
    {
      "Timestamp": "2025-01-01T11:15:00",
      "Sender UPI ID": "charlie@upi",
      "Receiver UPI ID": "user@upi",
      "Amount (INR)": 100,
      "Status": "SUCCESS",
      "Type": "Sent",
      "To Type": "P2P"
    },
    {
      "Timestamp": "2025-01-02T09:30:00",
      "Sender UPI ID": "user@upi",
      "Receiver UPI ID": "merchant@upi",
      "Amount (INR)": 250,
      "Status": "SUCCESS",
      "Type": "Sent",
      "To Type": "P2M"
    },
    {
      "Timestamp": "2025-01-02T12:00:00",
      "Sender UPI ID": "user@upi",
      "Receiver UPI ID": "alice@upi",
      "Amount (INR)": 300,
      "Status": "FAILED",
      "Type": "Sent",
      "To Type": "P2P"
    },
    {
      "Timestamp": "2025-01-02T14:00:00",
      "Sender UPI ID": "alice@upi",
      "Receiver UPI ID": "user@upi",
      "Amount (INR)": 300,
      "Status": "SUCCESS",
      "Type": "Sent",
      "To Type": "P2P"
    },
    {
      "Timestamp": "2025-01-03T08:00:00",
      "Sender UPI ID": "bob@upi",
      "Receiver UPI ID": "alice@upi",
      "Amount (INR)": 200,
      "Status": "SUCCESS",
      "Type": "Sent",
      "To Type": "P2P"
    },
    {
      "Timestamp": "2025-01-03T08:10:00",
      "Sender UPI ID": "alice@upi",
      "Receiver UPI ID": "bob@upi",
      "Amount (INR)": 150,
      "Status": "SUCCESS",
      "Type": "Sent",
      "To Type": "P2P"
    },
    {
      "Timestamp": "2025-01-03T09:30:00",
      "Sender UPI ID": "charlie@upi",
      "Receiver UPI ID": "merchant@upi",
      "Amount (INR)": 500,
      "Status": "SUCCESS",
      "Type": "Sent",
      "To Type": "P2M"
    },
    {
      "Timestamp": "2025-01-03T10:00:00",
      "Sender UPI ID": "merchant@upi",
      "Receiver UPI ID": "bob@upi",
      "Amount (INR)": 100,
      "Status": "SUCCESS",
      "Type": "Refund",
      "To Type": "P2P"
    },
    {
      "Timestamp": "2025-01-04T11:00:00",
      "Sender UPI ID": "user@upi",
      "Receiver UPI ID": "alice@upi",
      "Amount (INR)": 700,
      "Status": "SUCCESS",
      "Type": "Sent",
      "To Type": "P2P"
    },
    {
      "Timestamp": "2025-01-04T12:00:00",
      "Sender UPI ID": "alice@upi",
      "Receiver UPI ID": "user@upi",
      "Amount (INR)": 700,
      "Status": "SUCCESS",
      "Type": "Sent",
      "To Type": "P2P"
    },
    {
      "Timestamp": "2025-01-05T08:00:00",
      "Sender UPI ID": "charlie@upi",
      "Receiver UPI ID": "user@upi",
      "Amount (INR)": 400,
      "Status": "SUCCESS",
      "Type": "Received",
      "To Type": "P2P"
    },
    {
      "Timestamp": "2025-01-05T10:30:00",
      "Sender UPI ID": "bob@upi",
      "Receiver UPI ID": "merchant@upi",
      "Amount (INR)": 150,
      "Status": "SUCCESS",
      "Type": "Sent",
      "To Type": "P2M"
    },
    {
      "Timestamp": "2025-01-06T09:15:00",
      "Sender UPI ID": "user@upi",
      "Receiver UPI ID": "david@upi",
      "Amount (INR)": 600,
      "Status": "SUCCESS",
      "Type": "Sent",
      "To Type": "P2P"
    },
    {
      "Timestamp": "2025-01-06T10:00:00",
      "Sender UPI ID": "david@upi",
      "Receiver UPI ID": "user@upi",
      "Amount (INR)": 250,
      "Status": "SUCCESS",
      "Type": "Received",
      "To Type": "P2P"
    },
    {
      "Timestamp": "2025-01-06T10:45:00",
      "Sender UPI ID": "user@upi",
      "Receiver UPI ID": "charlie@upi",
      "Amount (INR)": 100,
      "Status": "PENDING",
      "Type": "Sent",
      "To Type": "P2P"
    },
    {
      "Timestamp": "2025-01-07T09:00:00",
      "Sender UPI ID": "user@upi",
      "Receiver UPI ID": "bob@upi",
      "Amount (INR)": 120,
      "Status": "SUCCESS",
      "Type": "Sent",
      "To Type": "P2P"
    },
    {
      "Timestamp": "2025-01-07T10:30:00",
      "Sender UPI ID": "bob@upi",
      "Receiver UPI ID": "user@upi",
      "Amount (INR)": 80,
      "Status": "SUCCESS",
      "Type": "Received",
      "To Type": "P2P"
    },
    {
      "Timestamp": "2025-01-08T09:00:00",
      "Sender UPI ID": "user@upi",
      "Receiver UPI ID": "merchant@upi",
      "Amount (INR)": 999,
      "Status": "SUCCESS",
      "Type": "Sent",
      "To Type": "P2M"
    },
    {
      "Timestamp": "2025-01-08T11:00:00",
      "Sender UPI ID": "merchant@upi",
      "Receiver UPI ID": "user@upi",
      "Amount (INR)": 200,
      "Status": "SUCCESS",
      "Type": "Refund",
      "To Type": "P2P"
    },
    {
      "Timestamp": "2025-01-09T08:00:00",
      "Sender UPI ID": "david@upi",
      "Receiver UPI ID": "charlie@upi",
      "Amount (INR)": 350,
      "Status": "SUCCESS",
      "Type": "Sent",
      "To Type": "P2P"
    },
    {
      "Timestamp": "2025-01-09T09:30:00",
      "Sender UPI ID": "charlie@upi",
      "Receiver UPI ID": "david@upi",
      "Amount (INR)": 100,
      "Status": "SUCCESS",
      "Type": "Sent",
      "To Type": "P2P"
    },
    {
      "Timestamp": "2025-01-10T10:00:00",
      "Sender UPI ID": "user@upi",
      "Receiver UPI ID": "user@upi",
      "Amount (INR)": 0,
      "Status": "SUCCESS",
      "Type": "Self-Transfer",
      "To Type": "P2P"
    },
    {
      "Timestamp": "2025-01-10T11:00:00",
      "Sender UPI ID": "charlie@upi",
      "Receiver UPI ID": "bob@upi",
      "Amount (INR)": 100,
      "Status": "FAILED",
      "Type": "Sent",
      "To Type": "P2P"
    },
    {
      "Timestamp": "2025-01-11T09:00:00",
      "Sender UPI ID": "alice@upi",
      "Receiver UPI ID": "charlie@upi",
      "Amount (INR)": 350,
      "Status": "SUCCESS",
      "Type": "Sent",
      "To Type": "P2P"
    },
    {
      "Timestamp": "2025-01-11T10:00:00",
      "Sender UPI ID": "charlie@upi",
      "Receiver UPI ID": "alice@upi",
      "Amount (INR)": 250,
      "Status": "SUCCESS",
      "Type": "Sent",
      "To Type": "P2P"
    },
    {
      "Timestamp": "2025-01-12T09:15:00",
      "Sender UPI ID": "merchant@upi",
      "Receiver UPI ID": "david@upi",
      "Amount (INR)": 500,
      "Status": "SUCCESS",
      "Type": "Incentive",
      "To Type": "P2P"
    },
    {
      "Timestamp": "2025-01-12T10:30:00",
      "Sender UPI ID": "david@upi",
      "Receiver UPI ID": "user@upi",
      "Amount (INR)": 450,
      "Status": "SUCCESS",
      "Type": "Sent",
      "To Type": "P2P"
    }
  ]
}

const userTransactions2 = {
  "transactions": [
    {
      "Timestamp": "2024-12-15T10:15:00",
      "Sender UPI ID": "user@upi",
      "Receiver UPI ID": "friend@upi",
      "Amount (INR)": 500,
      "Status": "SUCCESS",
      "Type": "Sent",
      "To Type": "P2P"
    },
    {
      "Timestamp": "2024-12-16T15:25:00",
      "Sender UPI ID": "friend@upi",
      "Receiver UPI ID": "user@upi",
      "Amount (INR)": 1500,
      "Status": "SUCCESS",
      "Type": "Received",
      "To Type": "P2P"
    }
  ]
}

const Dashboard = () => {
  const [userScore, setUserScore] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loanOffers, setLoanOffers] = useState([]);
  const [activeLoans, setActiveLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  const userTransactions = [
    {
      "Transaction ID": "TXN001",
      "Timestamp": 45757.385671296295,
      "Sender Name": "Ramesh",
      "Sender UPI ID": "ramesh@upi",
      "Receiver Name": "Kirana Store",
      "Receiver UPI ID": "kirana123@upi",
      "Amount (INR)": 180
    },
    {
      "Transaction ID": "TXN002",
      "Timestamp": 45756.895949074074,
      "Sender Name": "Swiggy",
      "Sender UPI ID": "swiggy@upi",
      "Receiver Name": "Ramesh",
      "Receiver UPI ID": "ramesh@upi",
      "Amount (INR)": 120
    },
    {
      "Transaction ID": "TXN003",
      "Timestamp": 45756.54568287037,
      "Sender Name": "Ramesh",
      "Sender UPI ID": "ramesh@upi",
      "Receiver Name": "Auto Driver",
      "Receiver UPI ID": "auto@upi",
      "Amount (INR)": 60
    },
    {
      "Transaction ID": "TXN004",
      "Timestamp": 45755.36125,
      "Sender Name": "Office",
      "Sender UPI ID": "salary@upi",
      "Receiver Name": "Ramesh",
      "Receiver UPI ID": "ramesh@upi",
      "Amount (INR)": 11000
    },
    {
      "Transaction ID": "TXN005",
      "Timestamp": 45754.8059375,
      "Sender Name": "Ramesh",
      "Sender UPI ID": "ramesh@upi",
      "Receiver Name": "Netflix",
      "Receiver UPI ID": "netflix@upi",
      "Amount (INR)": 199
    },
    {
      "Transaction ID": "TXN006",
      "Timestamp": 45753.78158564815,
      "Sender Name": "Ramesh",
      "Sender UPI ID": "ramesh@upi",
      "Receiver Name": "Zomato",
      "Receiver UPI ID": "zomato@upi",
      "Amount (INR)": 240
    },
    {
      "Transaction ID": "TXN007",
      "Timestamp": 45753.43817129629,
      "Sender Name": "Ramesh",
      "Sender UPI ID": "ramesh@upi",
      "Receiver Name": "UPI Transfer",
      "Receiver UPI ID": "friend123@upi",
      "Amount (INR)": 500
    },
    {
      "Transaction ID": "TXN008",
      "Timestamp": 45752.84045138889,
      "Sender Name": "Friend",
      "Sender UPI ID": "friend@upi",
      "Receiver Name": "Ramesh",
      "Receiver UPI ID": "ramesh@upi",
      "Amount (INR)": 350
    },
    {
      "Transaction ID": "TXN009",
      "Timestamp": 45752.33011574074,
      "Sender Name": "Ramesh",
      "Sender UPI ID": "ramesh@upi",
      "Receiver Name": "Electricity",
      "Receiver UPI ID": "tneb@upi",
      "Amount (INR)": 640
    },
    {
      "Transaction ID": "TXN010",
      "Timestamp": 45751.50763888889,
      "Sender Name": "Ramesh",
      "Sender UPI ID": "ramesh@upi",
      "Receiver Name": "Amazon Pay",
      "Receiver UPI ID": "amazon@upi",
      "Amount (INR)": 299
    }
  ]

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
      const response = await axios.post("http://localhost:5000/predict_score", userTransactions2);
      // const data = await response.json();
      setUserScore(response.data.credit_score);
      setTransactions(response.data.last_5_transactions);
      console.log(response.data.credit_score);
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
                <th className="py-2 text-left text-text-muted">To Type</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, index) => (
                <tr key={index} className="border-b border-secondary">
                  <td className="py-2">{tx.Timestamp}</td>
                  <td className="py-2">{tx.Sender_UPI_ID}</td>
                  <td className="py-2">{tx.Receiver_UPI_ID}</td>
                  <td className="py-2">{tx.Amount}</td>
                  <td className="py-2">
                    <span
                      className={`px-2 py-1 rounded text-xs ${tx.Type === "Sent"
                          ? "bg-red-900 text-red-300" : "bg-green-900 text-green-300"
                        }`}
                    >
                      {tx.Type}
                    </span>
                  </td>
                  <td className="py-2">{tx.To_Type}</td>
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
