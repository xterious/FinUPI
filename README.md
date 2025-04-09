# FinUPI - Hackathon Project

FinUPI is a financial app that provides instant microloans based on UPI transaction history, built in 24 hours for a hackathon.

## Tech Stack

- **Frontend**: React.js (JavaScript)
- **Backend**: Firebase (Auth + Firestore)
- **Hosting**: Vercel
- **Styling**: Tailwind CSS + Custom UI with neon green/black theme

## Core Features

1. **UPI Login & Transaction Analysis**

   - Login via phone number (OTP)
   - Read-only access to UPI transactions (using mock NPCI API for hackathon)
   - AI Credit Score calculation (0-100)

2. **Instant Microloans**

   - Loan offers (₹1k-50k, 1-30 days)
   - Money sent directly to UPI-linked bank account

3. **Gamified Rewards**

   - Refer 10 friends → Increase borrowing limit or get 1% interest discount
   - Badges for on-time repayments

4. **Auto-Repayment + Reminders**
   - UPI Auto-Debit on due date
   - WhatsApp/SMS reminders

## Hackathon Shortcuts

- **Simple AI**: Used mathematical formula for credit scoring
- **Demo Mode**: Pre-loaded sample UPI data
- **LocalStorage**: Used for demo data storage

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Update Firebase config in `src/firebase.js`
4. Run the development server: `npm start`

## Deployment

The app is configured for easy deployment to Vercel:

```
npm run build
vercel --prod
```

## Future Improvements

- Implement real UPI transaction API integration
- Add comprehensive payment gateway
- Develop admin dashboard for loan management
- Implement real-time notifications
- Add more gamification features

## License

This project was created for a hackathon and is for demonstration purposes only.
