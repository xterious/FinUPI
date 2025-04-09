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

const CreditScore = () => {
  const [userScore, setUserScore] = useState(null);
  const [scoreFactors, setScoreFactors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call with setTimeout
    setTimeout(() => {
      setUserScore(mockCreditScore);
      // Calculate mock factors that influence the credit score
      setScoreFactors([
        { name: "Transaction Frequency", score: 85, color: "#00ff7f" },
        { name: "Payment History", score: 92, color: "#00ff7f" },
        { name: "Transaction Amount", score: 78, color: "#00cc66" },
        { name: "Merchant Diversity", score: 65, color: "#ffc107" },
        { name: "Account Age", score: 45, color: "#ff4500" },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

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
                    : userScore?.level === "Good"
                    ? "You have access to competitive loan offers with favorable terms."
                    : userScore?.level === "Average"
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
                <span>Refer friends to boost your score instantly</span>
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
            <ul className="space-y-2 text-sm text-text-muted">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>
                  <b>Transaction Frequency:</b> How often you use UPI for
                  payments
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>
                  <b>Payment History:</b> Your record of timely payments
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>
                  <b>Transaction Amount:</b> The value of your transactions
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>
                  <b>Merchant Diversity:</b> The variety of merchants you
                  transact with
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>
                  <b>Account Age:</b> How long you've been using UPI
                </span>
              </li>
            </ul>
          </div>

          <p className="text-text-muted text-sm">
            Note: FinUPI only has read-only access to your UPI transaction
            history. Your data is encrypted and never shared with third parties.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreditScore;
