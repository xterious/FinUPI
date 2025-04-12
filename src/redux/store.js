import { configureStore } from '@reduxjs/toolkit';
import creditReducer from './slices/creditSlice';

export const store = configureStore({
  reducer: {
    credit: creditReducer,
  },
});

export default store; 