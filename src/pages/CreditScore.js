import { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

// Mock data (would come from Firebase in production)
import { mockCreditScore, mockTransactions } from "../mockData";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

// API endpoint base URL - replace with actual API URL in production
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const CreditScore = () => {
  const [userScore, setUserScore] = useState(null);
  const [scoreFactors, setScoreFactors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    const fetchCreditScore = async () => {
      setLoading(true);
      setError(null);

      try {
        // Check if user is authenticated
        const user = auth.currentUser;

        if (!user) {
          throw new Error("User not authenticated");
        }

        // Try to get credit score from Firestore first
        const userDoc = await getDoc(doc(db, "users", user.uid));

        if (userDoc.exists() && userDoc.data().creditScore) {
          // User already has credit score in Firestore
          const creditScoreData = userDoc.data().creditScore;

          setUserScore({
            score: creditScoreData.score,
            level: creditScoreData.level,
            message: getLevelMessage(creditScoreData.level),
            lastUpdated:
              creditScoreData.last_updated ||
              new Date().toISOString().split("T")[0],
            loanLimit: creditScoreData.loan_eligibility?.max_loan_amount || 0,
          });

          // Extract components for display
          const components = creditScoreData.components || {};
          const formattedFactors = [
            {
              name: "Transaction Frequency",
              score: components.transaction_frequency || 0,
              color: getColorForScore(components.transaction_frequency),
            },
            {
              name: "Credit-Debit Ratio",
              score: components.credit_debit_ratio || 0,
              color: getColorForScore(components.credit_debit_ratio),
            },
            {
              name: "Merchant Diversity",
              score: components.merchant_type_diversity || 0,
              color: getColorForScore(components.merchant_type_diversity),
            },
            {
              name: "Transaction Growth",
              score: components.transaction_growth || 0,
              color: getColorForScore(components.transaction_growth),
            },
            {
              name: "Amount Entropy",
              score: components.amount_entropy || 0,
              color: getColorForScore(components.amount_entropy),
            },
          ];

          setScoreFactors(formattedFactors);
        } else {
          // If not in Firestore, call our Flask API directly
          const response = await fetch(
            `${API_BASE_URL}/api/user-credit-score/${user.uid}`
          );

          if (!response.ok) {
            // If no data yet, use mock data for demo purposes
            console.log("No credit score found, using mock data");
            setUserScore(mockCreditScore);
            setScoreFactors([
              { name: "Transaction Frequency", score: 85, color: "#00ff7f" },
              { name: "Payment History", score: 92, color: "#00ff7f" },
              { name: "Transaction Amount", score: 78, color: "#00cc66" },
              { name: "Merchant Diversity", score: 65, color: "#ffc107" },
              { name: "Account Age", score: 45, color: "#ff4500" },
            ]);
          } else {
            const data = await response.json();

            if (data.status === "success") {
              const creditScoreData = data.credit_score;

              setUserScore({
                score: creditScoreData.score,
                level: creditScoreData.level,
                message: getLevelMessage(creditScoreData.level),
                lastUpdated:
                  creditScoreData.last_updated ||
                  new Date().toISOString().split("T")[0],
                loanLimit:
                  creditScoreData.loan_eligibility?.max_loan_amount || 0,
              });

              // Extract components for display
              const components = creditScoreData.components || {};
              const formattedFactors = [
                {
                  name: "Transaction Frequency",
                  score: components.transaction_frequency || 0,
                  color: getColorForScore(components.transaction_frequency),
                },
                {
                  name: "Credit-Debit Ratio",
                  score: components.credit_debit_ratio || 0,
                  color: getColorForScore(components.credit_debit_ratio),
                },
                {
                  name: "Merchant Diversity",
                  score: components.merchant_type_diversity || 0,
                  color: getColorForScore(components.merchant_type_diversity),
                },
                {
                  name: "Transaction Growth",
                  score: components.transaction_growth || 0,
                  color: getColorForScore(components.transaction_growth),
                },
                {
                  name: "Amount Entropy",
                  score: components.amount_entropy || 0,
                  color: getColorForScore(components.amount_entropy),
                },
              ];

              setScoreFactors(formattedFactors);
            } else {
              throw new Error(data.error || "Failed to fetch credit score");
            }
          }
        }
      } catch (err) {
        console.error("Error fetching credit score:", err);
        setError(err.message);

        // For demo, fallback to mock data if API fails
        setUserScore(mockCreditScore);
        setScoreFactors([
          { name: "Transaction Frequency", score: 85, color: "#00ff7f" },
          { name: "Payment History", score: 92, color: "#00ff7f" },
          { name: "Transaction Amount", score: 78, color: "#00cc66" },
          { name: "Merchant Diversity", score: 65, color: "#ffc107" },
          { name: "Account Age", score: 45, color: "#ff4500" },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCreditScore();
  }, [auth]);

  // Helper functions
  const getColorForScore = (score) => {
    if (score >= 90) return "#00ff7f"; // Excellent
    if (score >= 70) return "#00cc66"; // Good
    if (score >= 50) return "#ffc107"; // Average
    if (score >= 30) return "#ff9800"; // Poor
    return "#ff4500"; // Very Poor
  };

  const getLevelMessage = (level) => {
    switch (level) {
      case "Excellent":
        return "You have an excellent credit score with top-tier loan eligibility.";
      case "Very Good":
        return "You have a very good credit score with favorable loan terms.";
      case "Good":
        return "You have a good credit score with room for improvement.";
      case "Fair":
        return "You have a fair credit score. Regular UPI usage can help improve it.";
      case "Poor":
        return "Your credit score needs improvement. Follow our tips to increase it.";
      default:
        return "Your credit score can be improved with consistent UPI usage.";
    }
  };

  const scoreChartData = {
    datasets: [
      {
        data: [userScore?.score || 0, 100 - (userScore?.score || 0)],
        backgroundColor: ["#00ff7f", "#333333"],
        borderWidth: 0,
        cutout: "80%",
      },
    ],
  };

  const factorsChartData = {
    labels: scoreFactors.map((factor) => factor.name),
    datasets: [
      {
        label: "Factor Score",
        data: scoreFactors.map((factor) => factor.score),
        backgroundColor: scoreFactors.map((factor) => factor.color),
        borderWidth: 0,
        borderRadius: 5,
      },
    ],
  };

  const factorsChartOptions = {
    indexAxis: "y",
    scales: {
      x: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "#aaaaaa",
        },
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#ffffff",
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Error loading credit score: {error}</p>
          <p className="mt-2">Using sample data for demonstration.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-primary mb-6">
        Your FinUPI Credit Score
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Credit Score Section */}
        <div className="card">
          <div className="flex flex-col items-center">
            <div className="w-48 h-48 relative mb-4">
              <Doughnut data={scoreChartData} />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <span className="text-5xl font-bold text-primary">
                    {userScore?.score}
                  </span>
                  <span className="text-sm block text-text-muted">/100</span>
                </div>
              </div>
            </div>
            <div className="text-center">
              <h2 className="text-xl font-bold mb-2">{userScore?.level}</h2>
              <p className="text-text-muted mb-4">{userScore?.message}</p>

              <div className="bg-secondary p-4 rounded-lg">
                <h3 className="text-primary font-bold mb-2">What This Means</h3>
                <p className="text-sm text-text-muted">
                  {userScore?.level === "Excellent"
                    ? "You have access to the highest loan amounts and lowest interest rates."
                    : userScore?.level === "Good" ||
                      userScore?.level === "Very Good"
                    ? "You have access to competitive loan offers with favorable terms."
                    : userScore?.level === "Fair"
                    ? "You qualify for standard loan offers with standard interest rates."
                    : "You have limited loan options. Improve your score by using UPI more frequently."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Score Factors Section */}
        <div className="card">
          <h2 className="text-xl font-bold mb-4 text-primary">
            What Affects Your Score
          </h2>
          <div className="h-64">
            <Bar data={factorsChartData} options={factorsChartOptions} />
          </div>

          <div className="mt-6">
            <h3 className="font-bold mb-2">Boost Your Score</h3>
            <ul className="space-y-2 text-sm text-text-muted">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Make more frequent UPI transactions</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Pay bills consistently on time</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Use UPI at a variety of merchants</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Maintain regular transaction patterns</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Upload your recent UPI transaction history</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Score Calculation Section */}
      <div className="card mt-6">
        <h2 className="text-xl font-bold mb-4 text-primary">
          How We Calculate Your Score
        </h2>
        <div className="space-y-4">
          <p className="text-text-muted">
            Your FinUPI score is calculated using advanced AI algorithms that
            analyze your UPI transaction history. The score is updated daily and
            reflects your financial behavior.
          </p>

          <div className="bg-secondary p-4 rounded-lg">
            <h3 className="font-bold text-primary mb-2">Factors We Consider</h3>
            <p className="text-sm text-text-muted">
              Our model analyzes transaction frequency, merchant diversity,
              credit-debit ratio, transaction growth, and spending patterns.
              Unlike traditional credit scores that require extensive credit
              history, our algorithm works with just your UPI transaction data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditScore;
