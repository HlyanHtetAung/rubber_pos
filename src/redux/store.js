import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import sellersSliceReducer from "./sellerSlice";
import printSliceReducer from "./printSlice";
import reviewVoucherSliceReducer from "./reviewVoucherSlice";

export const store = configureStore({
  reducer: {
    sellers: sellersSliceReducer,
    prints: printSliceReducer,
    reviewVoucher: reviewVoucherSliceReducer,
  },
  middleware: getDefaultMiddleware({
    serializableCheck: false,
  }),
});
