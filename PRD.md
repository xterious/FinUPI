# FinUPI - Product Requirements Document

## 1. Introduction

FinUPI is a financial app that offers instant microloans based on UPI transaction history. Our target audience is individuals in need of short-term microloans, with a special focus on street vendors and small business owners.

## 2. User Flow

### 2.1 Authentication Flow

1. User opens the application
2. User inputs phone number
3. User receives OTP via SMS
4. User enters OTP to verify phone number
5. User is redirected to dashboard upon successful verification

### 2.2 Transaction Analysis Flow

1. User grants permission to access UPI transaction history (read-only)
2. System analyzes transaction patterns:
   - Transaction frequency
   - Transaction amounts
   - Merchant diversity
   - Payment history
3. System calculates FinUPI Score (0-100)
4. User is presented with their score and loan eligibility

### 2.3 Loan Application Flow

1. User views available loan offers based on their credit score
2. User selects desired loan amount and duration
3. User reviews loan terms (interest rate, repayment date, total amount)
4. User accepts terms and confirms loan application
5. System approves loan (instant for qualifying users)
6. Funds are transferred to user's UPI-linked bank account

### 2.4 Repayment Flow

1. System sends reminders before due date (WhatsApp/SMS)
2. On due date, system initiates UPI auto-debit
3. Upon successful repayment:
   - User receives confirmation
   - User earns on-time repayment badge
   - User's credit score increases

### 2.5 Referral Flow

1. User shares referral code with friends
2. Friend signs up using the referral code
3. When 10 friends sign up:
   - User receives either loan limit increase or interest rate discount
   - User earns referral badge

## 3. Core Features

### 3.1 UPI Login & Transaction Analysis

- Phone number authentication with OTP
- Read-only access to UPI transaction history
- AI-powered credit score calculation

### 3.2 Instant Microloans

- Loan amounts: ₹1,000 - ₹50,000
- Loan duration: 1-30 days
- Interest rates: Based on credit score and loan duration
- Instant approval for qualifying users
- Funds transferred directly to UPI-linked bank account

### 3.3 Gamified Rewards

- Badges for on-time repayments
- Referral program: Refer 10 friends to increase borrowing limit or get 1% interest discount
- Progress bars showing credit score improvement

### 3.4 Auto-Repayment + Reminders

- UPI Auto-Debit on due date
- WhatsApp/SMS reminders before due date
- Repayment confirmation notifications

## 4. AI Credit Score Algorithm

Our "AI" credit score is calculated using the following factors:

1. Transaction Frequency (30%): How often the user makes UPI transactions
2. Transaction Amount (30%): Average value of transactions
3. Credit-Debit Ratio (20%): Balance between incoming and outgoing funds
4. Merchant Diversity (20%): Variety of merchants the user transacts with

Formula:

```
Score = (txFrequency * 0.3) + (txAmount * 0.3) + (balanceRatio * 0.2) + (merchantDiversity * 0.2)
```

## 5. Hackathon Implementation Notes

For the 24-hour hackathon, the following shortcuts will be implemented:

1. **Mock NPCI API**: Instead of real UPI integration, we'll use mock transaction data
2. **Simplified AI**: Use the mathematical formula described above instead of ML
3. **Demo Mode**: Pre-load sample UPI data for demonstration purposes
4. **LocalStorage**: Store user data locally instead of a full Firebase implementation
5. **UI Focus**: Prioritize clean UI/UX to showcase the concept

## 6. Post-Hackathon Roadmap

If this project were to be developed further:

1. Implement real UPI transaction API integration
2. Develop comprehensive risk assessment algorithms
3. Add KYC verification for higher loan amounts
4. Build admin dashboard for loan management
5. Implement real-time notifications
6. Add more gamification features and rewards
7. Develop partnerships with merchants for special offers
