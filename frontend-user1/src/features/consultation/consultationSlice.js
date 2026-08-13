import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import consultationService from "./consultationService";

export const createConsultation = createAsyncThunk(
  "consultation/create",
  async (consultationData, thunkAPI) => {
    try {
      return await consultationService.createConsultation(consultationData);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Unable to submit consultation request",
      );
    }
  },
);

const consultationSlice = createSlice({
  name: "consultation",
  initialState: {
    isSubmitting: false,
    error: null,
  },
  reducers: {
    clearConsultationError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createConsultation.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(createConsultation.fulfilled, (state) => {
        state.isSubmitting = false;
      })
      .addCase(createConsultation.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload;
      });
  },
});

export const { clearConsultationError } = consultationSlice.actions;

export default consultationSlice.reducer;
