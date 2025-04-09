import { useState, useEffect } from "react";
import { auth } from "../firebase";
import { mockCreditScore } from "../mockData";

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-primary mb-6">Your Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Info */}
        <div className="md:col-span-2">
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-primary">
                Profile Information
              </h2>
              <button
                onClick={handleEditToggle}
                className="text-primary hover:underline"
              >
                {isEditing ? "Cancel" : "Edit"}
              </button>
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label
                      className="block text-text-muted mb-2"
                      htmlFor="name"
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="input w-full"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label
                      className="block text-text-muted mb-2"
                      htmlFor="email"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="input w-full"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label
                      className="block text-text-muted mb-2"
                      htmlFor="phoneNumber"
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      className="input w-full"
                      value={userProfile.phoneNumber}
                      disabled
                    />
                    <p className="text-sm text-text-muted mt-1">
                      Phone number cannot be changed
                    </p>
                  </div>

                  <div>
                    <label
                      className="block text-text-muted mb-2"
                      htmlFor="upiId"
                    >
                      UPI ID
                    </label>
                    <input
                      type="text"
                      id="upiId"
                      name="upiId"
                      className="input w-full"
                      value={formData.upiId}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <button type="submit" className="btn-primary">
                      Save Changes
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-center py-3 border-b border-secondary">
                  <span className="md:w-1/3 text-text-muted">Full Name</span>
                  <span className="font-medium">{userProfile.name}</span>
                </div>

                <div className="flex flex-col md:flex-row md:items-center py-3 border-b border-secondary">
                  <span className="md:w-1/3 text-text-muted">Email</span>
                  <span className="font-medium">{userProfile.email}</span>
                </div>

                <div className="flex flex-col md:flex-row md:items-center py-3 border-b border-secondary">
                  <span className="md:w-1/3 text-text-muted">Phone Number</span>
                  <span className="font-medium">{userProfile.phoneNumber}</span>
                </div>

                <div className="flex flex-col md:flex-row md:items-center py-3 border-b border-secondary">
                  <span className="md:w-1/3 text-text-muted">UPI ID</span>
                  <span className="font-medium">{userProfile.upiId}</span>
                </div>

                <div className="flex flex-col md:flex-row md:items-center py-3">
                  <span className="md:w-1/3 text-text-muted">
                    Profile Created
                  </span>
                  <span className="font-medium">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Achievements & Badges */}
          <div className="card mt-6">
            <h2 className="text-xl font-bold mb-6 text-primary">
              Achievements & Badges
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className="border border-primary/30 rounded-lg p-4 text-center"
                >
                  <div className="text-4xl mb-2">{badge.icon}</div>
                  <h3 className="font-bold">{badge.name}</h3>
                  <p className="text-text-muted text-sm mb-2">
                    {badge.description}
                  </p>
                  <p className="text-xs text-text-muted">
                    Earned on {badge.date}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div>
          {/* Credit Score Card */}
          <div className="card mb-6">
            <h2 className="text-xl font-bold mb-4 text-primary">
              FinUPI Score
            </h2>
            <div className="flex items-center justify-center mb-4">
              <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center">
                <span className="text-3xl font-bold text-primary">
                  {mockCreditScore.score}
                </span>
              </div>
            </div>
            <p className="text-center text-text-muted mb-4">
              {mockCreditScore.level}: {mockCreditScore.message}
            </p>
            <button className="btn-primary w-full">View Details</button>
          </div>

          {/* Referral Card */}
          <div className="card">
            <h2 className="text-xl font-bold mb-4 text-primary">
              Refer & Earn
            </h2>
            <p className="text-text-muted mb-4">
              Refer your friends to FinUPI and get a 1% interest discount or
              increased loan limit when 10 friends sign up.
            </p>

            <div className="mb-4">
              <p className="text-text-muted text-sm mb-1">Your Referral Code</p>
              <div className="bg-secondary p-3 rounded-lg flex justify-between items-center">
                <span className="font-bold">{userProfile.referralCode}</span>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-text-muted text-sm mb-1">Referral Link</p>
              <div className="bg-secondary p-3 rounded-lg flex justify-between items-center text-sm">
                <span className="truncate">{referralLink}</span>
                <button
                  onClick={copyReferralLink}
                  className="text-primary ml-2"
                >
                  Copy
                </button>
              </div>
            </div>

            <div className="bg-secondary-light p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-text-muted">Referrals</span>
                <span className="font-bold">
                  {userProfile.referredUsers}/10
                </span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2.5">
                <div
                  className="bg-primary h-2.5 rounded-full"
                  style={{
                    width: `${(userProfile.referredUsers / 10) * 100}%`,
                  }}
                ></div>
              </div>
              <p className="text-xs text-text-muted mt-2">
                Refer {10 - userProfile.referredUsers} more friends to unlock
                your reward
              </p>
            </div>

            <div className="flex mt-4">
              <button className="btn-primary w-full">Share Referral</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
