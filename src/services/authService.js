/**
 * Authentication Service
 * Provides a unified interface for authentication regardless of environment
 */

import * as dummyAuth from "../utils/dummyAuth";
import { auth } from "../firebase";
import { signInWithPhoneNumber } from "firebase/auth";

// Check if we should use dummy authentication
// Local storage takes precedence over environment settings
const isDevelopment = process.env.NODE_ENV === "development";
const localStorageSetting = localStorage.getItem("useDummyAuth");
const USE_DUMMY_AUTH = 
  localStorageSetting === "true" || 
  (localStorageSetting !== "false" && isDevelopment);

/**
 * Send OTP code to provided phone number
 * @param {string} phoneNumber - Phone number to send OTP to
 * @returns {Promise} - Promise with confirmation result
 */
export const sendOtpCode = async (phoneNumber) => {
  if (USE_DUMMY_AUTH) {
    console.log("Using dummy auth for sendOtpCode");
    return dummyAuth.sendOtpCode(phoneNumber);
  }

  try {
    console.log("Using Firebase auth for sendOtpCode");
    // Make sure recaptchaVerifier is available
    if (!window.recaptchaVerifier) {
      throw new Error("reCAPTCHA verifier not initialized");
    }
    
    const appVerifier = window.recaptchaVerifier;
    console.log("Using verifier:", appVerifier);
    
    // Firebase phone auth implementation
    const confirmationResult = await signInWithPhoneNumber(
      auth,
      phoneNumber,
      appVerifier
    );
    return confirmationResult;
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw error;
  }
};

/**
 * Verify OTP code
 * @param {object} confirmationResult - Confirmation result from sendOtpCode
 * @param {string} otpCode - OTP code entered by user
 * @returns {Promise} - Promise with user information
 */
export const verifyOtp = async (confirmationResult, otpCode) => {
  if (USE_DUMMY_AUTH) {
    console.log("Using dummy auth for verifyOtp");
    return dummyAuth.verifyOtp(confirmationResult.verificationId, otpCode);
  }

  try {
    console.log("Using Firebase auth for verifyOtp");
    // Firebase implementation - confirm the verification code
    const result = await confirmationResult.confirm(otpCode);
    return result;
  } catch (error) {
    console.error("Error verifying OTP:", error);
    throw error;
  }
};

/**
 * Get current authenticated user
 * @returns {object|null} - Current user or null if not authenticated
 */
export const getCurrentUser = () => {
  if (USE_DUMMY_AUTH) {
    return dummyAuth.getCurrentUser();
  }

  return auth.currentUser;
};

/**
 * Sign out current user
 * @returns {Promise} - Promise that resolves when sign out is complete
 */
export const signOut = async () => {
  if (USE_DUMMY_AUTH) {
    return dummyAuth.signOut();
  }

  try {
    await auth.signOut();
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

/**
 * Subscribe to authentication state changes
 * @param {Function} callback - Function to call when auth state changes
 * @returns {Function} - Unsubscribe function
 */
export const onAuthStateChanged = (callback) => {
  if (USE_DUMMY_AUTH) {
    return dummyAuth.onAuthStateChanged(callback);
  }

  return auth.onAuthStateChanged(callback);
};

/**
 * Toggle between dummy auth and real auth
 * @param {boolean} useDummy - Whether to use dummy auth
 */
export const toggleDummyAuth = (useDummy) => {
  console.log("Toggling dummy auth to:", useDummy);
  localStorage.setItem("useDummyAuth", useDummy ? "true" : "false");
  // Force reload to apply the change
  window.location.reload();
};

// Export the dummy OTP for development UI helpers
export const DUMMY_OTP = dummyAuth.DUMMY_OTP;

// Export whether dummy auth is active
export const isDummyAuthActive = USE_DUMMY_AUTH;
