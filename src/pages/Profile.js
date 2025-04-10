import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut, updateProfile } from "firebase/auth";
import { doc, getDoc, updateDoc, collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import { auth } from "../firebase";
import { mockCreditScore } from "../mockData";

// Import icons (assuming you're using some icon library)
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    upiId: "",
    referralCode: "",
    referredUsers: 0,
  });
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    upiId: "",
  });
  const [referralLink, setReferralLink] = useState("");
  const [uploadStatus, setUploadStatus] = useState({
    uploading: false,
    success: false,
    error: null,
  });

  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    // Get current user from Firebase
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser);

      // In a real app, fetch profile data from Firestore
      // For now, we'll use placeholder data based on the authenticated user
      const userProfile = {
        name: currentUser.displayName || "User",
        email:
          currentUser.email ||
          `${currentUser.phoneNumber?.slice(-10)}@example.com`,
        phoneNumber: currentUser.phoneNumber || "+91 98765 43210",
        upiId: `${currentUser.phoneNumber?.slice(-10)}@upi`,
        referralCode: "FINUPI" + Math.floor(1000 + Math.random() * 9000),
        referredUsers: Math.floor(Math.random() * 6),
      };

      setUserProfile(userProfile);
      setFormData({
        name: userProfile.name,
        email: userProfile.email,
        upiId: userProfile.upiId,
      });

      // Create referral link
      setReferralLink(
        `https://finupi.vercel.app/register?ref=${userProfile.referralCode}`
      );

      // Sample badges
      setBadges([
        {
          id: "badge1",
          name: "Early Adopter",
          icon: "🚀",
          description: "One of the first users of FinUPI",
          date: new Date().toISOString().split("T")[0],
        },
        {
          id: "badge2",
          name: "On-Time Repayer",
          icon: "⏰",
          description: "Repaid 3 loans on time",
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
        },
        {
          id: "badge3",
          name: "Referral Starter",
          icon: "👥",
          description: "Referred 3+ friends to FinUPI",
          date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
        },
      ]);

      setLoading(false);
    } else {
      // No user found - should be redirected by App.js route protection
      console.warn("No authenticated user found");
      setLoading(false);
    }
  }, []);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      // Reset form data when entering edit mode
      setFormData({
        name: userProfile.name,
        email: userProfile.email,
        upiId: userProfile.upiId,
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, update profile in Firestore
    // For now, just update the local state
    setUserProfile({
      ...userProfile,
      name: formData.name,
      email: formData.email,
      upiId: formData.upiId,
    });
    setIsEditing(false);
  };

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    alert("Referral link copied to clipboard!");
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Handle transaction file upload to update credit score
  const handleTransactionUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    const validTypes = [
      "application/json",
      "text/csv",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];
    if (!validTypes.includes(file.type)) {
      setUploadStatus({
        uploading: false,
        success: false,
        error: "Invalid file type. Please upload a JSON, CSV, or Excel file.",
      });
      return;
    }

    setUploadStatus({
      uploading: true,
      success: false,
      error: null,
    });

    try {
      const formData = new FormData();
      formData.append("transaction_file", file);

      // Call our Flask API with the user ID in the URL
      const response = await fetch(
        `${API_BASE_URL}/api/transactions-upload-with-user/${user.uid}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        setUploadStatus({
          uploading: false,
          success: true,
          error: null,
        });

        // Add a log entry
        await addDoc(collection(db, "users", user.uid, "activity_logs"), {
          type: "credit_score_update",
          timestamp: new Date(),
          details: {
            fileName: file.name,
            transactionCount: data.transactionCount,
            score: data.creditScore.score,
            level: data.creditScore.level,
          },
        });

        // After a few seconds, reset the success message
        setTimeout(() => {
          setUploadStatus({
            uploading: false,
            success: false,
            error: null,
          });
        }, 5000);
      } else {
        throw new Error(data.error || "Failed to process transaction file");
      }
    } catch (error) {
      console.error("Error uploading transactions:", error);
      setUploadStatus({
        uploading: false,
        success: false,
        error: error.message,
      });
    }
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary">My Profile</h1>
        <button
          onClick={handleLogout}
          className="bg-secondary hover:bg-primary-dark text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Info Card */}
        <div className="card md:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-primary">
              Personal Information
            </h2>
            {!isEditing ? (
              <button
                onClick={handleEditToggle}
                className="bg-primary text-white px-3 py-1 rounded-md text-sm"
              >
                Edit
              </button>
            ) : null}
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-text-muted mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-2 bg-secondary border border-gray-700 rounded"
                  />
                </div>
                <div>
                  <label className="block text-text-muted mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-2 bg-secondary border border-gray-700 rounded"
                  />
                </div>
                <div>
                  <label className="block text-text-muted mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={userProfile.phoneNumber}
                    onChange={handleChange}
                    className="w-full p-2 bg-secondary border border-gray-700 rounded"
                  />
                </div>
                <div>
                  <label className="block text-text-muted mb-1">UPI ID</label>
                  <input
                    type="text"
                    name="upiId"
                    value={formData.upiId}
                    onChange={handleChange}
                    className="w-full p-2 bg-secondary border border-gray-700 rounded"
                  />
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={handleEditToggle}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-text-muted">Full Name</p>
                <p className="font-semibold">{userProfile.name}</p>
              </div>
              <div>
                <p className="text-text-muted">Email</p>
                <p className="font-semibold">{userProfile.email}</p>
              </div>
              <div>
                <p className="text-text-muted">Phone Number</p>
                <p className="font-semibold">{userProfile.phoneNumber}</p>
              </div>
              <div>
                <p className="text-text-muted">UPI ID</p>
                <p className="font-semibold">{userProfile.upiId}</p>
              </div>
            </div>
          )}
        </div>

        {/* Credit Score & Transaction Upload Card */}
        <div className="card">
          <h2 className="text-xl font-bold text-primary mb-4">
            Update Your Credit Score
          </h2>

          <div className="bg-secondary p-4 rounded-lg mb-4">
            <h3 className="font-bold mb-2">Upload Transaction History</h3>
            <p className="text-sm text-text-muted mb-3">
              Upload your UPI transaction history to get a more accurate credit
              score. We accept JSON, CSV, or Excel files.
            </p>

            <div className="relative">
              <input
                type="file"
                id="transactionFile"
                className="hidden"
                accept=".json,.csv,.xlsx,.xls"
                onChange={handleTransactionUpload}
                disabled={uploadStatus.uploading}
              />
              <label
                htmlFor="transactionFile"
                className={`block w-full text-center p-3 rounded border-2 border-dashed cursor-pointer transition-colors ${
                  uploadStatus.uploading
                    ? "border-primary-dark bg-primary/10 cursor-wait"
                    : "border-primary bg-transparent hover:bg-primary/10"
                }`}
              >
                {uploadStatus.uploading ? (
                  <span className="flex items-center justify-center">
                    <span className="animate-spin h-4 w-4 border-t-2 border-b-2 border-primary rounded-full mr-2"></span>
                    Uploading...
                  </span>
                ) : (
                  "Click to upload transaction file"
                )}
              </label>
            </div>

            {uploadStatus.success && (
              <div className="mt-3 p-2 bg-green-900/30 text-green-400 rounded">
                Transaction file processed successfully! Your credit score has
                been updated.
              </div>
            )}

            {uploadStatus.error && (
              <div className="mt-3 p-2 bg-red-900/30 text-red-400 rounded">
                {uploadStatus.error}
              </div>
            )}
          </div>

          <div className="text-text-muted text-sm">
            <h4 className="font-bold text-primary text-base mb-2">
              How to export your UPI transaction history
            </h4>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Open your UPI app (e.g., Google Pay, PhonePe)</li>
              <li>Go to Transaction History / Passbook</li>
              <li>Look for "Export" or "Download" option</li>
              <li>Save the file to your device</li>
              <li>Upload the file here</li>
            </ol>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-700">
            <button
              onClick={() => navigate("/credit-score")}
              className="w-full text-center bg-primary hover:bg-primary-dark text-white py-2 rounded"
            >
              View Your Credit Score
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
