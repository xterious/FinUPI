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
import { Doughnut } from "react-chartjs-2";
import { getAuth } from "firebase/auth";
import axios from "axios";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

// API endpoint base URL
const API_BASE_URL = "http://localhost:5000";


const CreditScore = () => {

  const userTransactions1 = {
    "user_id" : 8754512892
  }
  
  const userTransactions2 = {
    "user_id" : 7001400312
  }
  
  const [userScore, setUserScore] = useState(null);
  const [message, setMessage] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    const fetchCreditScore = async () => {
      console.log("fetchCreditScore function started");
      setLoading(true);
      setError(null);

      try {
        // Check if user is authenticated
        const user = auth.currentUser;
        console.log("Auth check completed. User authenticated:", !!user);

        // Skip auth check for now to avoid spinner
        // if (!user) {
        //   throw new Error("User not authenticated");
        // }

        // Make API request to get credit score and suggestions
        console.log("Sending transaction data:", userTransactions1);
        
        try {
          const response = await axios.post("http://localhost:5000/get_credit_score", userTransactions1, {
            timeout: 10000 // Add 10 second timeout
          });
          console.log("API response received:", response.data);
          
          // Set credit score from API response
          setUserScore({
            score: response.data.credit_score || 75, // Fallback score
            level: getScoreLevel(response.data.credit_score || 75),
            lastUpdated: new Date().toISOString().split("T")[0],
            loanLimit: calculateLoanLimit(response.data.credit_score || 75),
          });
          
          // Set message from API response
          setMessage(response.data.improvements?.message || "");
          
          // Set suggestions from API response
          if (response.data.improvements?.suggestions && Array.isArray(response.data.improvements.suggestions)) {
            setSuggestions(response.data.improvements.suggestions);
          } else {
            // Fallback if suggestions aren't provided by API
            setSuggestions(getImprovementSuggestions(response.data.credit_score || 75));
          }
        } catch (apiErr) {
          console.error("First API call failed, using fallback data", apiErr);
          // Use default data if API fails
          setUserScore({
            score: 75,
            level: getScoreLevel(75),
            lastUpdated: new Date().toISOString().split("T")[0],
            loanLimit: calculateLoanLimit(75),
          });
          setSuggestions(getImprovementSuggestions(75));
          setMessage("Keep making regular UPI payments to improve your score.");
        }

      } catch (err) {
        console.error("Error in main try block:", err);
        setError("Failed to fetch credit score. Please try again later.");
        
        // Use default data if all else fails
        setUserScore({
          score: 70,
          level: getScoreLevel(70),
          lastUpdated: new Date().toISOString().split("T")[0],
          loanLimit: calculateLoanLimit(70),
        });
        setSuggestions(getImprovementSuggestions(70));
        setMessage("Default message: Make regular UPI payments to maintain a good score.");
      } finally {
        console.log("Setting loading to false in finally block");
        setLoading(false);
      }
    };

    console.log("Setting up fetchCreditScore call");
    fetchCreditScore().catch(err => {
      console.error("Unexpected error in fetchCreditScore:", err);
      setLoading(false); // Ensure loading is set to false even if fetchCreditScore throws
    });
    
    // Cleanup function for useEffect
    return () => {
      console.log("Component unmounting or effect cleanup running");
    };
  }, []); // Empty dependency array to run only once

  // Helper functions
  const getScoreLevel = (score) => {
    if (score >= 90) return "Excellent";
    if (score >= 80) return "Very Good";
    if (score >= 70) return "Good";
    if (score >= 50) return "Fair";
    return "Poor";
  };
  
  const calculateLoanLimit = (score) => {
    // Simple formula to calculate loan limit based on score
    return Math.round((score / 100) * 50000);
  };
  
  const getScoreMessageAndColor = (score) => {
    if (score > 80) {
      return {
        message: "Whoa that's a great score!",
        color: "text-green-500"
      };
    } else if (score >= 60 && score <= 80) {
      return {
        message: "There's a lot of room for improvement!",
        color: "text-yellow-500"
      };
    } else {
      return {
        message: "Oops the score is low! Let's improve!",
        color: "text-red-500"
      };
    }
  };

  const getImprovementSuggestions = (score) => {
    // Base suggestions for everyone
    const baseSuggestions = [
      "Make regular UPI transactions to establish consistent usage patterns",
      "Ensure on-time repayment of any digital loans or credit facilities",
      "Use UPI for a variety of merchant payments to show diversity",
      "Maintain a healthy ratio between money sent and received",
      "Avoid too many failed transactions or payment reversals"
    ];
    
    // Add specific suggestions based on score ranges
    if (score < 60) {
      return [
        ...baseSuggestions,
        "Increase your transaction frequency - aim for at least 15-20 transactions per month",
        "Clear any pending dues or late payments immediately",
        "Link your primary bank account to UPI for better tracking"
      ];
    } else if (score >= 60 && score <= 80) {
      return [
        ...baseSuggestions,
        "Try to increase your transaction volume gradually",
        "Maintain consistent transaction patterns month-to-month",
        "Use UPI for bill payments to establish recurring payment history"
      ];
    } else {
      return [
        ...baseSuggestions,
        "Continue your excellent payment behavior",
        "Consider using UPI for more of your financial transactions",
        "You're doing great! Keep up the good work"
      ];
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
          <button 
            className="mt-2 bg-red-200 hover:bg-red-300 text-red-700 font-bold py-1 px-4 rounded"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  const { message: scoreMessage, color: scoreColor } = getScoreMessageAndColor(userScore?.score);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-primary mb-6">
        Your FinUPI Credit Score
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Credit Score Section - First Column */}
        <div className="card">
          <div className="flex flex-col items-center">
            <div className="w-64 h-64 relative mb-4">
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
              <p className={`text-xl font-bold mb-4 ${scoreColor}`}>{scoreMessage}</p>
              
              <div className="bg-secondary p-4 rounded-lg">
                <h3 className="text-primary font-bold mb-2">What This Means</h3>
                <p className="text-sm text-text-muted">
                  {message}
                </p>
                
                <div className="mt-4 p-3 bg-background rounded-lg">
                  <p className="text-sm">
                    <span className="font-bold">Eligible Loan Amount:</span> ₹{userScore?.loanLimit.toLocaleString()}
                  </p>
                  <p className="text-sm">
                    <span className="font-bold">Last Updated:</span> {userScore?.lastUpdated}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Improvement Suggestions Section - Second Column */}
        <div className="card">
          <h2 className="text-xl font-bold mb-4 text-primary">
            Suggestions to Improve Your Score
          </h2>
          
          <div className="space-y-4">
            <p className="text-text-muted mb-4">
              Follow these recommendations to boost your FinUPI credit score and increase your loan eligibility:
            </p>
            
            {suggestions.length > 0 ? (
              <ol className="space-y-3 pl-4">
                {suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start">
                    <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary text-background font-bold mr-3">
                      {index + 1}
                    </span>
                    <span className="text-text">{suggestion}</span>
                  </li>
                ))}
              </ol>
            ) : (
              <div className="text-center py-4">
                <p className="text-green-500 text-xl font-bold">Whoa you're looking good!</p>
                <p className="text-text-muted mt-2">Keep maintaining your excellent financial habits.</p>
              </div>
            )}
            
            <div className="mt-6 text-center">
              <a 
                href="/resources" 
                className="text-primary hover:underline"
              >
                Explore our financial improvement resources
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditScore;
