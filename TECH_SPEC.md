New repo
# FinUPI - Technical Specification

## 1. Architecture Overview

FinUPI is built using a client-side rendering architecture with React.js and Firebase services.

```
┌───────────────┐      ┌───────────────┐      ┌───────────────┐
│               │      │               │      │               │
│   React.js    │◄────►│   Firebase    │◄────►│ Mock UPI API  │
│   Frontend    │      │   Backend     │      │               │
│               │      │               │      │               │
└───────────────┘      └───────────────┘      └───────────────┘
```

## 2. Frontend Architecture

### 2.1 Technology Stack

- **Framework**: React.js (JavaScript)
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **Charts**: Chart.js / React-ChartJS-2
- **State Management**: React Hooks / Context API
- **Build Tool**: Create React App

### 2.2 Key Components

```
├── App (Root Component)
├── Pages
│   ├── Login
│   ├── Dashboard
│   ├── CreditScore
│   ├── LoanOffers
│   ├── ApplyLoan
│   ├── Repayments
│   └── Profile
├── Components
│   ├── Navbar
│   ├── Footer
│   ├── CreditScoreChart
│   ├── LoanCalculator
│   ├── TransactionsTable
│   ├── RepaymentProgress
│   └── ReferralCard
└── Contexts
    ├── AuthContext
    └── UserDataContext
```

### 2.3 UI/UX Design

- **Color Scheme**:

  - Primary: Electric Blue (#2B6CB0) with gradient variations
  - Secondary: Cyber Green (#00FF9D) for highlights and CTAs
  - Accent: Neon Purple (#9F7AEA) for interactive elements
  - Background: Dark Navy (#0F172A) for main surfaces
  - Surface: Deep Space (#1E293B) for cards and components
  - Text:
    - Primary: White (#FFFFFF)
    - Secondary: Light Gray (#CBD5E1)
    - Accent: Electric Blue (#2B6CB0)

- **Gradients**:

  - Primary Gradient: Electric Blue (#2B6CB0) → Cyber Green (#00FF9D)
  - Secondary Gradient: Neon Purple (#9F7AEA) → Electric Blue (#2B6CB0)
  - Background Gradient: Dark Navy (#0F172A) → Deep Space (#1E293B)

- **Typography**:

  - Primary: Space Grotesk (Modern, geometric sans-serif)
  - Secondary: Inter (Clean, readable sans-serif)
  - Display: Clash Display (For hero sections and headlines)

- **Components**:

  - Glassmorphism effects for cards and modals
  - Subtle particle animations in background
  - Dynamic hover states with gradient transitions
  - Floating elements with micro-interactions
  - Custom scrollbars with gradient tracks

- **Responsive Design**:

  - Mobile-first approach with desktop optimization
  - Adaptive layouts that respond to screen size
  - Fluid typography scaling
  - Dynamic grid systems
  - Breakpoints optimized for modern devices

- **Animations & Interactions**:

  - Smooth page transitions
  - Loading states with animated gradients
  - Hover effects with subtle scaling and color shifts
  - Progress indicators with gradient fills
  - Micro-interactions for user feedback

- **Accessibility**:
  - WCAG 2.1 AA compliance
  - High contrast ratios for text
  - Keyboard navigation support
  - Screen reader optimization
  - Reduced motion options

## 3. Backend Architecture

### 3.1 Firebase Integration

- **Authentication**: Firebase Auth with Phone (OTP) authentication
- **Database**: Firestore for user data, loan records, transactions
- **Storage**: Firebase Storage (if needed for KYC documents in the future)
- **Hosting**: Vercel for frontend, Firebase for backend functions

### 3.2 Data Models

```javascript
// User Model
{
  uid: String,          // Firebase Auth UID
  phoneNumber: String,  // Verified phone number
  createdAt: Timestamp, // Account creation date
  creditScore: Number,  // FinUPI score (0-100)
  loanLimit: Number,    // Maximum eligible loan amount
  referralCode: String, // Unique referral code
  referredBy: String,   // Referral code used during signup
  referralCount: Number // Number of successful referrals
}

// Loan Model
{
  id: String,           // Unique loan ID
  userId: String,       // User ID
  amount: Number,       // Loan amount
  interestRate: Number, // Interest rate percentage
  interestAmount: Number, // Interest amount
  duration: Number,     // Loan duration in days
  startDate: Timestamp, // Loan start date
  dueDate: Timestamp,   // Repayment due date
  status: String,       // 'pending', 'active', 'repaid', 'overdue'
  repaidAmount: Number, // Amount repaid so far
  repaymentDate: Timestamp // Actual repayment date
}

// Transaction Model
{
  id: String,           // UPI transaction ID
  userId: String,       // User ID
  date: Timestamp,      // Transaction date
  merchant: String,     // Merchant name
  amount: Number,       // Transaction amount
  type: String,         // 'debit' or 'credit'
  category: String      // Transaction category (optional)
}
```

## 4. AI Credit Score Algorithm Implementation

For the hackathon, the credit score is calculated using a simplified mathematical model:

```javascript
const calculateCreditScore = (transactions) => {
  if (!transactions || transactions.length === 0) {
    return 50; // Default score
  }

  // 1. Transaction Frequency: More transactions = higher score
  const txFrequency = Math.min(100, (transactions.length / 30) * 100);

  // 2. Transaction Amount: Higher amounts = higher score (capped)
  const totalAmount = transactions.reduce((sum, tx) => sum + tx.amount, 0);
  const avgAmount = totalAmount / transactions.length;
  const txAmount = Math.min(100, (avgAmount / 1000) * 100);

  // 3. Credit vs Debit ratio
  const creditTxs = transactions.filter((tx) => tx.type === "credit");
  const debitTxs = transactions.filter((tx) => tx.type === "debit");
  const creditAmount = creditTxs.reduce((sum, tx) => sum + tx.amount, 0);
  const debitAmount = debitTxs.reduce((sum, tx) => sum + tx.amount, 0);
  const balanceRatio = Math.min(100, (creditAmount / (debitAmount || 1)) * 50);

  // 4. Merchant diversity (unique merchants)
  const uniqueMerchants = new Set(transactions.map((tx) => tx.merchant)).size;
  const merchantDiversity = Math.min(100, (uniqueMerchants / 10) * 100);

  // Weighted average of factors
  const score =
    txFrequency * 0.3 +
    txAmount * 0.3 +
    balanceRatio * 0.2 +
    merchantDiversity * 0.2;

  return Math.round(score);
};
```

## 5. Mock UPI API Implementation

For the hackathon, we'll simulate UPI integration with mock data:

```javascript
// Mock UPI Transaction Data
const mockTransactions = [
  {
    id: "tx1",
    date: "2023-07-05",
    merchant: "Swiggy",
    amount: 450,
    type: "debit",
  },
  // More transactions...
];

// Simulate UPI transaction access
const fetchUpiTransactions = async (userId) => {
  // In a real app, this would call the actual UPI API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockTransactions);
    }, 1000); // Simulate API delay
  });
};
```

## 6. Security Considerations

- **Authentication**: Secure OTP-based phone authentication
- **Data Access**: Read-only access to UPI transactions
- **API Security**: Firebase Auth tokens for API authentication
- **Data Privacy**: Transaction data stored securely, not shared with third parties
- **Secure Storage**: Sensitive data encrypted in database

## 7. Development & Deployment Process

### 7.1 Development Environment

- React app created with Create React App
- Firebase config stored in environment variables
- Local development using Firebase emulators

### 7.2 Deployment Process

1. Build React app: `npm run build`
2. Deploy to Vercel: `vercel --prod`
3. Configure Firebase services via Firebase console

### 7.3 Testing Strategy

For the hackathon:

- Manual testing of core user flows
- Testing on different devices and screen sizes
- Verification of loan calculation logic
