import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    session: {},
  },
  reducers: {
    setSession: (state, action: PayloadAction<object>) => {
      state.session = action.payload;
    },
  },
});

export const { setSession } = authSlice.actions;

export default authSlice.reducer;
