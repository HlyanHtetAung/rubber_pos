import { Container } from "@mui/material";
import TextField from "@mui/material/TextField";
import React, { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Pagination from "@mui/material/Pagination";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { InputAdornment } from "@mui/material";
import { PREVIEW_VOUCHER_ROUTE } from "../navigation/routes";
import { getVoucher } from "../api/voucher";
import { reviewVoucher } from "../redux/reviewVoucherSlice";
import dayjs from "dayjs";
import Autocomplete from "@mui/material/Autocomplete";
import { getSupplier } from "../api/supplier";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export function Voucher() {
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [sellers, setSellers] = useState([]);
  const navigate = useNavigate();
  const [vouchers, setVouchers] = useState([]);
  const dispatch = useDispatch();
  const [pageSize, setPageSize] = useState(25);
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(vouchers.length / pageSize);
  const pageContent = vouchers.slice((page - 1) * pageSize, page * pageSize);

  const columns = [
    { id: "voucherId", label: "Voucher Id", minWidth: 170 },
    { id: "supplierNme", label: "အမည်", minWidth: 170 },
    { id: "date", label: "ရက်စွဲ", minWidth: 170 },
    { id: "totalPrice", label: "စုစုပေါင်းရှင်းငွေ", minWidth: 170 },
    { id: "action", label: "", minWidth: 170 },
  ];

  const handlePage = (page) => setPage(page);

  const getVouchers = async (date, supplierId) => {
    const response = await getVoucher(date, supplierId);
    setVouchers(response);
  };

  const getAllVouchers = async () => {
    const respsone = await getVoucher();
    setSelectedSeller(null);
    setSelectedDate(null);
    setVouchers(respsone);
  };

  const getAllSellers = async () => {
    const result = await getSupplier();
    const mappedResult = result;
    mappedResult.forEach((element) => {
      element.label = element.supplier_name;
    });
    setSellers(mappedResult);
  };

  const filterHandle = () => {
    const date =
      selectedDate != null ? new Date(selectedDate).toLocaleDateString() : "";

    const supplierId =
      selectedSeller !== null ? selectedSeller.supplier_id : "";

    getVouchers(date, supplierId);
  };

  const handleSearchVoucher = (e) => {
    if (e.target.value == "") {
      getVouchers();
    }
    setVouchers(
      vouchers.filter((voucher) =>
        voucher.voucher_id.toLowerCase().includes(e.target.value.toLowerCase())
      )
    );
  };

  useEffect(() => {
    getAllSellers();
    getVouchers();
  }, []);

  return (
    <Container maxWidth='xl' className='mt-8'>
      <div className='flex justify-between mb-3'>
        <div className='flex gap-2'>
          <Autocomplete
            value={selectedSeller}
            onChange={(e, value) => setSelectedSeller(value)}
            getOptionLabel={(option) => {
              return option.supplier_name || "";
            }}
            disablePortal
            id='combo-box-demo'
            options={sellers}
            sx={{ width: 300 }}
            renderInput={(params) => (
              <TextField {...params} label='အမည်ရွေးရန်' />
            )}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              format='DD/MM/YYYY'
              value={selectedDate}
              onChange={(newDate) => setSelectedDate(newDate)}
            />
          </LocalizationProvider>
          <Button onClick={filterHandle} variant='contained'>
            ရွေးကြည့်ရန်
          </Button>
          <Button onClick={getAllVouchers} variant='contained'>
            အကုန်ကြည့်မည်
          </Button>
        </div>
        <TextField
          onChange={handleSearchVoucher}
          sx={{ width: 350 }}
          id='outlined-basic'
          label='ဘောင်ချာနံပါတ်ဖြင့်ရှာမည် '
          variant='outlined'
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </div>

      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: "65vh" }}>
          <Table stickyHeader aria-label='sticky table'>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    sx={{
                      textAlign: column.id == "totalAmount" ? "end" : null,
                    }}
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {pageContent.map((voucher, index) => {
                const supplierNameAry = [
                  ...new Set(
                    voucher.purchase_voucher.map(
                      (el) => el.purchase.supplier.supplier_name
                    )
                  ),
                ];
                return (
                  <TableRow role='checkbox' key={index}>
                    <TableCell>{voucher.voucher_id}</TableCell>
                    <TableCell> {supplierNameAry.join(", ")}</TableCell>
                    <TableCell>
                      {dayjs(voucher.voucher_date).format("MM/DD/YYYY")}
                    </TableCell>
                    <TableCell>
                      {new Intl.NumberFormat().format(voucher.paid_amount)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant='contained'
                        onClick={() => {
                          dispatch(reviewVoucher({ data: voucher }));
                          navigate(PREVIEW_VOUCHER_ROUTE);
                        }}
                      >
                        ကြည့်မည်
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <div className='flex justify-between p-6 items-center'>
          {pageContent.length == 0 ? (
            <h1>စာရင်းမရှိသေးပါ။</h1>
          ) : (
            <h1>စာရင်းစုစုပေါင်း = {vouchers.length}</h1>
          )}

          <Pagination
            color='primary'
            count={totalPages}
            onChange={(event, value) => handlePage(value)}
            page={page}
            size='large'
          ></Pagination>
        </div>
      </Paper>
    </Container>
  );
}
