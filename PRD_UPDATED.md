# FinUPI - Product Requirements Document (Updated)

## 1. Introduction

FinUPI is a financial app that offers instant microloans based on UPI transaction history. Our target audience is individuals in need of short-term microloans, with a special focus on street vendors and small business owners. The app uniquely combines financial services with embedded financial education to create a holistic financial well-being platform.

## 2. Vision & Mission

**Vision**: To create a financially inclusive society where everyone has access to fair credit and the knowledge to use it wisely.

**Mission**: To provide instant, accessible microloans while simultaneously empowering users with financial education to make informed decisions and improve their long-term financial health.

## 3. User Flow

### 3.1 Authentication Flow

1. User discovers and downloads the application
2. User views onboarding screens with app value proposition and financial tips
3. User inputs phone number
4. User receives OTP via SMS
5. User enters OTP to verify phone number
6. User completes basic profile setup (name, email, preferences)
7. User is redirected to dashboard upon successful verification

### 3.2 Transaction Analysis Flow

1. User is educated about data usage and privacy considerations
2. User grants permission to access UPI transaction history (read-only)
3. System analyzes transaction patterns while displaying educational content:
   - Transaction frequency
   - Transaction amounts
   - Credit-Debit ratio
   - Merchant diversity
4. System calculates FinUPI Score (0-100)
5. User is presented with their score, component breakdown, and personalized improvement tips

### 3.3 Loan Application Flow

1. User views available loan offers based on their credit score
2. User compares loan options with transparent cost breakdowns
3. User selects desired loan amount and duration
4. User reviews loan terms (interest rate, repayment date, total amount)
5. User receives contextual financial advice about loan selection
6. User accepts terms and confirms loan application
7. System approves loan (instant for qualifying users)
8. Funds are transferred to user's UPI-linked bank account
9. User receives digital loan agreement and repayment information

### 3.4 Repayment Flow

1. System sends educational reminders before due date (WhatsApp/SMS/Push)
2. User receives financial tips about responsible repayment
3. On due date, system initiates UPI auto-debit
4. Upon successful repayment:
   - User receives confirmation and digital receipt
   - User earns on-time repayment badge
   - User's credit score increases
   - User receives positive reinforcement and financial insight

### 3.5 Financial Education Flow

1. User accesses personalized financial education content through:
   - Dashboard financial tip of the day
   - Contextual advice throughout the app
   - Dedicated financial education center
2. User completes financial literacy modules and quizzes
3. User sets financial goals and tracks progress
4. User receives personalized recommendations based on behavior

### 3.6 Referral Flow

1. User shares referral code with friends
2. Friend signs up using the referral code
3. When 10 friends sign up:
   - User receives either loan limit increase or interest rate discount
   - User earns referral badge
   - User receives community-focused financial wisdom

## 4. Core Features

### 4.1 UPI Login & Transaction Analysis

- Phone number authentication with OTP
- Read-only access to UPI transaction history
- AI-powered credit score calculation
- Transparent score component breakdown
- Historical score tracking

### 4.2 Instant Microloans

- Loan amounts: ₹1,000 - ₹50,000
- Loan duration: 1-30 days
- Interest rates: Based on credit score and loan duration
- Instant approval for qualifying users
- Funds transferred directly to UPI-linked bank account
- Digital loan agreement and documentation
- Transparent fee structure and total cost display

### 4.3 Financial Education Center

- Contextual financial tips throughout user journey
- "Finance Fact of the Day" on dashboard
- Library of financial literacy articles and videos
- Interactive financial calculators
- Personalized learning paths
- Financial quizzes with rewards
- Goal setting and tracking tools

### 4.4 Gamified Financial Wellness

- Badges for on-time repayments and financial literacy
- Progress tracking for credit score improvement
- Achievement system for financial behavior milestones
- Weekly financial challenges with rewards
- Referral program with tiered benefits
- Community leaderboards (privacy-focused)

### 4.5 Auto-Repayment + Smart Reminders

- UPI Auto-Debit on due date
- Tiered reminder system (3 days, 1 day, day of)
- WhatsApp/SMS/Push notification options
- Repayment confirmation notifications
- Educational content in reminders
- Digital receipts for all transactions

## 5. AI Credit Score Algorithm

Our credit score is calculated using the following factors:

1. Transaction Frequency (30%): How often the user makes UPI transactions
2. Transaction Amount (30%): Average value of transactions
3. Credit-Debit Ratio (20%): Balance between incoming and outgoing funds
4. Merchant Diversity (20%): Variety of merchants the user transacts with

Formula:

```
Score = (txFrequency * 0.3) + (txAmount * 0.3) + (balanceRatio * 0.2) + (merchantDiversity * 0.2)
```

The system provides personalized recommendations based on each component's score to help users improve their overall credit score.

## 6. Financial Education Integration

Financial education is deeply embedded throughout the application:

### 6.1 Contextual Education

- Relevant financial tips on every major screen
- Education moments during loading/processing screens
- Tooltips explaining financial terms and concepts
- Interactive tutorials for key features

### 6.2 Structured Learning

- Progressive financial literacy curriculum
- Bite-sized learning modules (<5 minutes each)
- Multimedia content (text, video, infographics)
- Quiz-based knowledge assessment
- Certificates for module completion

### 6.3 Behavioral Nudges

- Positive reinforcement for good financial decisions
- Gentle reminders about financial best practices
- Goal setting assistance and milestone tracking
- Community success stories and case studies

## 7. Technical Requirements

### 7.1 Frontend Requirements

- React-based responsive web application
- Progressive Web App (PWA) capabilities
- Mobile-first design approach
- Offline capability for educational content
- Real-time updates and notifications
- Interactive data visualizations
- Accessibility compliance

### 7.2 Backend Requirements

- Firebase Authentication for phone verification
- Firestore for data storage and management
- Cloud Functions for business logic
- Secure API integrations for UPI data
- Analytics integration for user behavior tracking
- Robust error handling and logging

### 7.3 API Integrations

- UPI transaction history API (read-only)
- UPI payment processing
- SMS gateway for OTP and notifications
- WhatsApp Business API
- Push notification services

### 7.4 Security Requirements

- End-to-end encryption for sensitive data
- Compliance with financial data regulations
- Secure authentication and session management
- Regular security audits and penetration testing
- Data anonymization for analytics

## 8. Non-Functional Requirements

### 8.1 Performance

- App load time under 3 seconds on 3G networks
- Transaction processing within 5 seconds
- Loan approval within 30 seconds for eligible users
- Smooth scrolling and transitions

### 8.2 Scalability

- Support for 100,000+ concurrent users
- Ability to process 1,000+ loan applications per minute
- Elastic infrastructure for peak usage periods

### 8.3 Reliability

- 99.9% uptime for core loan services
- Graceful degradation during service disruptions
- Automated backup and recovery procedures

### 8.4 Usability

- Intuitive UI requiring minimal onboarding
- Consistent design language throughout the app
- Clear error messages and recovery paths
- Comprehensive help and support resources

## 9. Implementation Phases

### 9.1 Phase 1 (MVP - Hackathon)

- Basic authentication flow
- UPI transaction analysis with mock data
- Simple credit score calculation
- Loan application and approval flow
- Basic financial tips integration

### 9.2 Phase 2 (Post-Hackathon)

- Real UPI integration
- Enhanced credit scoring algorithm
- Automated loan disbursement and collection
- Expanded financial education center
- Basic gamification elements

### 9.3 Phase 3 (Market Growth)

- Advanced analytics and personalization
- Community features and social learning
- Financial goal setting and tracking
- Expanded loan products and partnerships
- Advanced gamification and rewards

## 10. Success Metrics

### 10.1 User Engagement

- Monthly active users (target: 50,000 in 6 months)
- Average session duration (target: 5+ minutes)
- Financial education content consumption (target: 3+ articles per user monthly)
- Repeat visits (target: 5+ sessions per month)

### 10.2 Financial Impact

- Loan volume (target: ₹5 crore monthly by end of year)
- Repayment rate (target: 98%+)
- Average credit score improvement (target: +10 points in 3 months)
- User financial literacy assessment scores (target: 30% improvement)

### 10.3 Business Metrics

- User acquisition cost (target: <₹100 per user)
- Loan default rate (target: <2%)
- Revenue from interest (target: 20% MoM growth)
- User referrals (target: 5+ per 100 active users)

## 11. Future Roadmap

- Credit builder products for users with no credit history
- Merchant-specific loan products for small businesses
- Integrated savings features and goals
- Financial coaching and personalized advice
- Community lending circles
- Integration with formal credit bureaus
- Advanced financial analytics and insights
- Expanded financial wellness ecosystem

By combining instant microloans with comprehensive financial education, FinUPI aims to create a positive cycle of financial inclusion, literacy, and well-being for our users.
