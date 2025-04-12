import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  creditScore: 0,
  maxLoanAmount: 5000,
  maxLoanDuration: 36,
  scoreCategory: 'Unknown',
  lastUpdated: new Date().toISOString(),
};

export const creditSlice = createSlice({
  name: 'credit',
  initialState,
  reducers: {
    setCreditScore: (state, action) => {
      state.creditScore = action.payload;
      state.lastUpdated = new Date().toISOString();
    },
    setMaxLoanAmount: (state, action) => {
      state.maxLoanAmount = action.payload;
      state.lastUpdated = new Date().toISOString();
    },
    setMaxLoanDuration: (state, action) => {
      state.maxLoanDuration = action.payload;
      state.lastUpdated = new Date().toISOString();
    },
    setScoreCategory: (state, action) => {
      state.scoreCategory = action.payload;
      state.lastUpdated = new Date().toISOString();
    },
    updateCreditInfo: (state, action) => {
      return { ...state, ...action.payload, lastUpdated: new Date().toISOString() };
    },
  },
});

export const { setCreditScore, setMaxLoanAmount, setMaxLoanDuration, setScoreCategory, updateCreditInfo } = creditSlice.actions;

export default creditSlice.reducer; 