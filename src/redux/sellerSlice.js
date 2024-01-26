import { createSlice } from "@reduxjs/toolkit";

const sellersSlice = createSlice({
  name: "sellersSlice",
  initialState: {
    sellers: ["hello", "world"],
  },
  reducers: {
    createNewSeller: (state, action) => {
      const { data } = action.payload;
      state.sellers = [...state.sellers, data];
    },
    getAllSellers: (state, action) => {
      const { data } = action.payload;
      state.sellers = data;
    },
  },
});

export const { createNewSeller, getAllSellers } = sellersSlice.actions;

export default sellersSlice.reducer;
