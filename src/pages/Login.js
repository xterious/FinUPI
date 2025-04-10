import { useState, useEffect } from "react";
import { auth } from "../firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { sendOtpCode, DUMMY_OTP } from "../utils/dummyAuth";
import { verifyOtp as verifyOtpService } from "../services/authService";

// Check if app is in development mode
const isDevelopment = process.env.NODE_ENV === "development";
// For testing, you can force use of dummy auth even in production
const forceDummyAuth = true;
// Whether to use dummy auth
const useDummyAuth = isDevelopment || forceDummyAuth;

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [recaptchaVerified, setRecaptchaVerified] = useState(false);
  const [isDummyMode, setIsDummyMode] = useState(useDummyAuth);

  // Clear any existing recaptcha when component mounts or unmounts
  useEffect(() => {
    // Skip recaptcha setup in dummy mode
    if (isDummyMode) {
      console.log(
        "🔑 Using DUMMY AUTH mode. No real authentication will be used."
      );
      console.log(`🔑 The dummy OTP is: ${DUMMY_OTP}`);
      return;
    }

    // Clean up recaptcha when component unmounts
    return () => {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    };
  }, [isDummyMode]);

  const setupRecaptcha = () => {
    // Skip recaptcha in dummy mode
    if (isDummyMode) return;

    // Clear any existing recaptcha to avoid duplicates
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
    }

    window.recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {
        size: "invisible",
        callback: () => {
          // reCAPTCHA solved, allow signInWithPhoneNumber
          setRecaptchaVerified(true);
        },
        "expired-callback": () => {
          // Reset recaptcha when expired
          setRecaptchaVerified(false);
          setError("reCAPTCHA expired. Please try again.");
          if (window.recaptchaVerifier) {
            window.recaptchaVerifier.clear();
          }
        },
      }
    );

    // Force render recaptcha
    window.recaptchaVerifier.render().then((widgetId) => {
      window.recaptchaWidgetId = widgetId;
    });
  };

  const validatePhoneNumber = (number) => {
    // Simple validation - can be enhanced for better checks
    const cleaned = number.replace(/\D/g, "");
    if (cleaned.length < 10) return false;
    return true;
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate phone number
    if (!validatePhoneNumber(phoneNumber)) {
      setError("Please enter a valid phone number");
      setLoading(false);
      return;
    }

    try {
      // Format phone number to ensure it has country code
      let formattedNumber = phoneNumber.trim();
      if (!formattedNumber.startsWith("+")) {
        // If it's a 10-digit Indian number
        if (/^\d{10}$/.test(formattedNumber)) {
          formattedNumber = `+91${formattedNumber}`;
        } else if (formattedNumber.startsWith("0")) {
          // If it starts with 0, replace with +91
          formattedNumber = `+91${formattedNumber.substring(1)}`;
        } else {
          formattedNumber = `+91${formattedNumber}`;
        }
      }

      console.log("Sending OTP to:", formattedNumber);

      let confirmation;
      if (isDummyMode) {
        // Use dummy authentication
        confirmation = await sendOtpCode(formattedNumber);
      } else {
        // Setup recaptcha for real Firebase auth
        setupRecaptcha();

        // Send OTP via Firebase
        confirmation = await signInWithPhoneNumber(
          auth,
          formattedNumber,
          window.recaptchaVerifier
        );
      }

      setConfirmationResult(confirmation);
      setShowOtpInput(true);
      setLoading(false);

      // Auto-fill OTP in development mode
      if (isDummyMode) {
        setOtp(DUMMY_OTP);
      }
    } catch (err) {
      console.error("OTP Error:", err);
      let errorMessage = "Failed to send OTP. Please try again.";

      // Handle specific Firebase error messages
      if (err.code === "auth/invalid-phone-number") {
        errorMessage =
          "Invalid phone number format. Please enter a valid number.";
      } else if (err.code === "auth/too-many-requests") {
        errorMessage = "Too many requests. Please try again later.";
      } else if (err.code === "auth/captcha-check-failed") {
        errorMessage = "reCAPTCHA verification failed. Please try again.";
      } else if (err.code === "auth/quota-exceeded") {
        errorMessage =
          "Service temporarily unavailable. Please try again later.";
      }

      setError(errorMessage);
      setLoading(false);

      // Reset recaptcha on error
      if (!isDummyMode && window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
      }
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate OTP
    if (!otp || otp.length !== 6 || !/^\d+$/.test(otp)) {
      setError("Please enter a valid 6-digit OTP");
      setLoading(false);
      return;
    }

    try {
      // Use the auth service for verification regardless of mode
      await verifyOtpService(confirmationResult, otp);
      // Auth state will change and App.js will redirect to dashboard
    } catch (err) {
      console.error("OTP Verification Error:", err);

      let errorMessage = "Invalid OTP. Please try again.";

      // Handle specific error codes
      if (err.code === "auth/code-expired") {
        errorMessage = "OTP has expired. Please request a new one.";
      } else if (err.code === "auth/invalid-verification-code") {
        errorMessage =
          "The OTP you entered is incorrect. Please check and try again.";
      }

      setError(errorMessage);
      setLoading(false);
    }
  };

  const handleTryAgain = () => {
    setShowOtpInput(false);
    setOtp("");
    setError("");
    if (!isDummyMode && window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
    }
  };

  // Toggle between real auth and dummy auth (for development)
  const toggleAuthMode = () => {
    setIsDummyMode(!isDummyMode);
    setShowOtpInput(false);
    setOtp("");
    setError("");
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <div className="card w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">FinUPI</h1>
          <p className="text-text-muted">Instant Microloans for Everyone</p>

          {useDummyAuth && (
            <div className="mt-2 text-xs bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200 p-2 rounded">
              {isDummyMode ? (
                <span>
                  DEVELOPMENT MODE: Using dummy authentication (OTP: {DUMMY_OTP}
                  )
                </span>
              ) : (
                <span>
                  DEVELOPMENT MODE: Using real Firebase authentication
                </span>
              )}
              <button onClick={toggleAuthMode} className="ml-2 underline">
                Toggle
              </button>
            </div>
          )}
        </div>

        {!showOtpInput ? (
          <form onSubmit={handleSendOtp}>
            <div className="mb-6">
              <label className="block text-text-muted mb-2" htmlFor="phone">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                className="input w-full"
                placeholder="Enter your phone number (e.g., 9876543210)"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
              <p className="text-sm text-text-muted mt-2">
                {isDummyMode
                  ? "Using dummy authentication. Any valid phone number will work."
                  : "We'll send you a one-time password to verify your phone"}
              </p>
            </div>

            <button
              type="submit"
              className="btn-primary w-full"
              disabled={loading}
            >
              {loading ? "Sending OTP..." : "Get OTP"}
            </button>

            {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

            {/* This div is used by Firebase for reCAPTCHA rendering */}
            <div
              id="recaptcha-container"
              className="mt-4 flex justify-center"
            ></div>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp}>
            <div className="mb-6">
              <label className="block text-text-muted mb-2" htmlFor="otp">
                Enter OTP
              </label>
              <input
                type="text"
                id="otp"
                className="input w-full"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                required
              />
              <p className="text-sm text-text-muted mt-2">
                {isDummyMode
                  ? `OTP sent to ${phoneNumber} (Use ${DUMMY_OTP} to login)`
                  : `OTP sent to ${phoneNumber}`}
              </p>
            </div>

            <button
              type="submit"
              className="btn-primary w-full mb-4"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            <button
              type="button"
              className="btn-text w-full"
              onClick={handleTryAgain}
            >
              Try Different Number
            </button>

            {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
