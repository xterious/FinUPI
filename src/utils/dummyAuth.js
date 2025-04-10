/**
 * Dummy Authentication Module for Local Development
 * Simulates phone-based authentication flow without requiring real phone verification
 */

// Dummy users data store
const dummyUsers = {
  1234567890: { name: "Test User", uid: "dummy-uid-123" },
};

// Fixed OTP for any verification - always "123456"
const DUMMY_OTP = "123456";

// In-memory session storage for sign-in state
let currentUser = null;

// Keep track of auth state listeners
const authListeners = [];

// Notify all listeners of auth state changes
const notifyAuthStateChange = (user) => {
  console.log("Notifying all auth listeners of state change:", user);
  authListeners.forEach((listener) => {
    try {
      listener(user);
    } catch (error) {
      console.error("Error in auth state listener:", error);
    }
  });
};

// Simulates sending an OTP to a phone number
const sendOtpCode = async (phoneNumber) => {
  console.log(`[DUMMY AUTH] OTP sent to ${phoneNumber}`);

  // Return a fake confirmation result that will be used in verifyOtp
  return {
    verificationId: `dummy-verification-${phoneNumber}`,
    phoneNumber,
  };
};

// Verifies the provided OTP
const verifyOtp = async (verificationId, otpCode) => {
  // Extract phone number from the verification ID
  const phoneNumber = verificationId.split("-")[2];

  // Check if OTP matches our fixed dummy OTP
  if (otpCode !== DUMMY_OTP) {
    throw new Error("Invalid OTP code");
  }

  // Check if we have this user in our dummy database
  if (!dummyUsers[phoneNumber]) {
    // Create a new user if not exists
    dummyUsers[phoneNumber] = {
      name: "New User",
      uid: `dummy-uid-${Date.now()}`,
    };
  }

  // Set the current user
  currentUser = {
    uid: dummyUsers[phoneNumber].uid,
    phoneNumber,
    displayName: dummyUsers[phoneNumber].name,
    // Add more user fields as needed
  };

  console.log(`[DUMMY AUTH] User authenticated:`, currentUser);

  // Notify listeners
  notifyAuthStateChange(currentUser);

  return { user: currentUser };
};

// Get the current authenticated user
const getCurrentUser = () => {
  return currentUser;
};

// Sign out the current user
const signOut = async () => {
  const prevUser = currentUser;
  currentUser = null;
  console.log("[DUMMY AUTH] User signed out");

  // Notify listeners if there was a user
  if (prevUser) {
    notifyAuthStateChange(null);
  }
};

// Subscribe to auth state changes
const onAuthStateChanged = (callback) => {
  console.log("[DUMMY AUTH] Adding auth state listener");

  // Add to listeners array
  authListeners.push(callback);

  // Initial callback with current auth state
  setTimeout(() => callback(currentUser), 0);

  // Return unsubscribe function
  return () => {
    const index = authListeners.indexOf(callback);
    if (index !== -1) {
      authListeners.splice(index, 1);
      console.log("[DUMMY AUTH] Removed auth state listener");
    }
  };
};

export {
  sendOtpCode,
  verifyOtp,
  getCurrentUser,
  signOut,
  onAuthStateChanged,
  DUMMY_OTP, // Export this so the UI can show the test code
};
