import { configureStore } from "@reduxjs/toolkit";
import boardReducer from "./slices/boardSlice";
import thunk from 'redux-thunk';
const store = configureStore({
  reducer: {
    board: boardReducer,
  },
  middleware: [thunk],
});

export default store;
