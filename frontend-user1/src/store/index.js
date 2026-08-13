import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import consultationReducer from "../features/consultation/consultationSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    consultation: consultationReducer,
  },
});
