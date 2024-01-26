import React from "react";
import "./App.css";
import { HashRouter, Routes, Route } from "react-router-dom";
import {
  Sellers,
  Purchase,
  Report,
  Address,
  Print,
  Voucher,
  PreviewVoucher,
} from "./pages";
import { Navbar } from "./components";
import {
  ADDRESS_ROUTE,
  REPORT_PAGE_ROUTE,
  SELLER_ROUTE,
  PRINT_ROUTE,
  VOUCHER_ROUTE,
  PREVIEW_VOUCHER_ROUTE,
} from "./navigation/routes";

export default function App() {
  return (
    <div>
      <HashRouter>
        <Navbar />
        <Routes>
          <Route path="/">
            <Route index element={<Purchase />} />
            <Route path={REPORT_PAGE_ROUTE} element={<Report />} />
            <Route path={SELLER_ROUTE} element={<Sellers />} />
            <Route path={ADDRESS_ROUTE} element={<Address />} />
            <Route path={PRINT_ROUTE} element={<Print />} />
            <Route path={VOUCHER_ROUTE} element={<Voucher />} />
            <Route path={PREVIEW_VOUCHER_ROUTE} element={<PreviewVoucher />} />
            {/* <Route path="projects/:id" element={<ProjectDetailDashboard />} />
            <Route
              path="projects/employee/:id"
              element={<ProjectEmployeeDetailDashboard />}
            /> */}
          </Route>
        </Routes>
      </HashRouter>
    </div>
  );
}
