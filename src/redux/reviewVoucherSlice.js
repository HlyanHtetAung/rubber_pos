import { createSlice } from "@reduxjs/toolkit";

const reviewVoucherSlice = createSlice({
  name: "reviewVoucherSlice",
  initialState: {
    voucherReview: { purchase_voucher: [] },
  },
  reducers: {
    reviewVoucher: (state, action) => {
      const { data } = action.payload;
      console.log(data.purchase_voucher);
      state.voucherReview = data;
    },
  },
});

export const { reviewVoucher } = reviewVoucherSlice.actions;

export default reviewVoucherSlice.reducer;
