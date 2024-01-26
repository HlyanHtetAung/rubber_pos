import { createSlice } from "@reduxjs/toolkit";

const printSlice = createSlice({
  name: "printSlice",
  initialState: {
    toPrintForm: [],
  },
  reducers: {
    addNewPrint: (state, action) => {
      const { data, func } = action.payload;
      const sortData = [...state.toPrintForm, data];
      sortData.sort((a, b) => {
        return new Date(a.purchase_date) - new Date(b.purchase_date);
      });
      state.toPrintForm = sortData;
    },
    removePrint: (state, action) => {
      const id = action.payload;

      const deletedAry = [...state.toPrintForm].filter(
        (el) => el.purchase_id !== id
      );
      state.toPrintForm = deletedAry;
    },
    clearPrint: (state) => {
      state.toPrintForm = [];
    },
  },
});

export const { addNewPrint, removePrint, clearPrint } = printSlice.actions;

export default printSlice.reducer;
