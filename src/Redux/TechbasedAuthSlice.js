import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axiosInstance from "../Helper/axiosInstance";
import toast from "react-hot-toast";

const initialState = {
  isLoggedIn: localStorage.getItem("isLoggedIn") || false,
  token: localStorage.getItem("token") || '',
  analytics: {},
  allorders: {}
};
// get analytics
// get all orders

const TechbasedSlice = createSlice({
  name: "techbased",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(TechbasedMerchantLogin.fulfilled, (state, action) => {
        localStorage.setItem("isLoggedIn", true);
        localStorage.setItem("token", action?.payload?.token);
        state.isLoggedIn = true;
        state.token = action?.payload.token
      })
      .addCase(TechBasedMerchantGetAnalytics.fulfilled, (state, action) => {
        state.analytics = action?.payload
      })
      .addCase(TechBasedMerchantGetAllOrder.fulfilled, (state, action) => {
        console.log(action)
        state.allorders = action?.payload
      })
  }
})
export const { } = TechbasedSlice.actions;
export default TechbasedSlice.reducer;