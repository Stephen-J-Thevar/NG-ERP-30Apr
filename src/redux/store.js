import { configureStore } from "@reduxjs/toolkit";
import dummyReducer from "./features/dummy";

const store = configureStore({
  reducer: {
    dummy: dummyReducer,
  },
});

export default store;
