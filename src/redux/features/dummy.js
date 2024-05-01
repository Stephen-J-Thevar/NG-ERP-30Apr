import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  dummy: "dummy",
};

const dummySlice = createSlice({
  name: "dummy",
  initialState,
  reducers: {
    reset: () => initialState,
  },
});
export default dummySlice.reducer;

export const { reset } = dummySlice.actions;
