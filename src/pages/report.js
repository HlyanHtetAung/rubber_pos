import { Container } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { getPurchase, getPurchaseByDate } from "../api/purchase";
import { getSupplier } from "../api/supplier";
import { getAddress } from "../api/address";
import { deletePurchase, deletePurchaseById } from "../api/purchase";
import Pagination from "@mui/material/Pagination";
import dayjs from "dayjs";
import Autocomplete from "@mui/material/Autocomplete";
import Badge from "@mui/material/Badge";
import Checkbox from "@mui/material/Checkbox";
import { useSelector, useDispatch } from "react-redux";
import { addNewPrint, removePrint } from "../redux/printSlice";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";
import { PRINT_ROUTE } from "../navigation/routes";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import Modal from "@mui/material/Modal";
import { SnackbarProvider, useSnackbar } from "notistack";

export function Report() {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { toPrintForm } = useSelector((state) => state.prints);

  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [isMonthYear, setIsMonthYear] = useState(2);
  const [pageSize, setPageSize] = useState(32);
  const [page, setPage] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [selectedDate, setSelectedDate] = React.useState(null);
  const [townAddress, setTownAddress] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [reports, setReports] = React.useState([]);
  const totalPages = Math.ceil(reports.length / pageSize);
  const pageContent = reports.slice((page - 1) * pageSize, page * pageSize);

  const columns = [
    { id: "", label: "", minWidth: 30 },
    { id: "purchaseDate", label: "နေ့စွဲ", minWidth: 170 },
    { id: "supplierName", label: "အမည်", minWidth: 170 },
    { id: "rubberPounds", label: "အစည်းပေါင်", minWidth: 170 },
    { id: "percentage", label: "ရာခိုင်နှုန်း(%)", minWidth: 170 },
    { id: "dryPounds", label: "အခြောက်ပေါင်", minWidth: 170 },
    { id: "todayPrice", label: "ဈေးနှုန်း", minWidth: 170 },
    { id: "totalAmount", label: "စုစုပေါင်းရငွေ", minWidth: 170 },
    { id: "button", label: "", minWidth: 170 },
  ];

  const handlePage = (page) => setPage(page);

  const getAllReports = async () => {
    const result = await getPurchase();
    setSelectedDate(null);
    setSelectedSeller(null);
    setSelectedAddress(null);
    setReports(result);
  };

  const getAllSellers = async () => {
    const result = await getSupplier();
    const mappedResult = result;
    mappedResult.forEach((element) => {
      element.label = element.supplier_name;
    });
    setSellers(mappedResult);
  };

  const getTownAddress = async () => {
    const result = await getAddress();
    const mappedResult = result;
    mappedResult.forEach((element) => {
      element.label = element.address;
    });
    setTownAddress(mappedResult);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    getAllReports();
    getAllSellers();
    getTownAddress();
  }, []);

  const filterHandle = async () => {
    const month =
      selectedDate == null ? "" : new Date(selectedDate).getMonth() + 1;
    const year =
      selectedDate == null ? "" : new Date(selectedDate).getFullYear();

    const supplierId =
      selectedSeller !== null ? selectedSeller.supplier_id : "";
    const addressId =
      selectedAddress !== null ? selectedAddress.address_id : "";

    // 1 refer month and year
    if (isMonthYear == 1) {
      const result = await getPurchase(year, month, supplierId, addressId);
      setReports(result);
      return;
    }
    // 2 refer date
    if (isMonthYear == 2) {
      const result = await getPurchaseByDate(
        selectedDate != null ? new Date(selectedDate).toISOString() : "",
        supplierId,
        addressId
      );
      setReports(result);
      return;
    }
  };

  const handleChange = (event) => {
    setIsMonthYear(event.target.value);
  };

  const getTotalAmount = reports
    .map((el) => el.total_amount)
    .reduce((prev, current) => prev + current, 0);

  const getTotalRubberPound = reports
    .map((el) => el.dry_rubber_pound)
    .reduce((prev, current) => prev + current, 0);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 700,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
  };

  const deleteAllDataHandle = async () => {
    const response = await deletePurchase();

    if (response.message == "deleted successfully") {
      setReports([]);
    }
  };

  const deleteSingleReportHandle = async (toDeleteId) => {
    const response = await deletePurchaseById(toDeleteId);
    if (response.purchase_id) {
      handleSuccessMessage("ဖျက်ပြီးပါပြီ။");
      getAllReports();
    }
  };

  const handleSuccessMessage = (successMessage, variant) => {
    enqueueSnackbar(successMessage, { variant });
  };

  const handleErrorMessage = (errorMessage, variant) => {
    enqueueSnackbar(errorMessage, { variant });
  };

  return (
    <SnackbarProvider>
      <Container maxWidth='xl' className='mt-8'>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby='modal-modal-title'
          aria-describedby='modal-modal-description'
        >
          <Box sx={style}>
            <h3 className='text-center text-4xl mb-5 text-red-500 font-bold'>
              စာရင်းများကိုအကုန်ဖျက်မည်လား။
            </h3>
            <div className='flex justify-between gap-3 mt-5'>
              <Button onClick={handleClose} variant='contained' fullWidth>
                မဖျက်ပါ။
              </Button>
              <Button
                color='error'
                onClick={() => {
                  deleteAllDataHandle();
                  handleClose();
                }}
                variant='contained'
                fullWidth
              >
                ဖျက်ပါမည်။
              </Button>
            </div>
          </Box>
        </Modal>
        <div className='flex justify-between'>
          <Box sx={{ maxWidth: 200 }}>
            <FormControl fullWidth>
              <InputLabel className='bg-white' id='demo-simple-select-label'>
                ရွေးမည်
              </InputLabel>
              <Select
                labelId='demo-simple-select-label'
                id='demo-simple-select'
                value={isMonthYear}
                label='Age'
                onChange={handleChange}
              >
                <MenuItem value={2}>ရက်စွဲ ဖြင့်ရှာမည်</MenuItem>
                <MenuItem value={1}>လ/နှစ် ဖြင့်ရှာမည်</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Button onClick={handleOpen} variant='contained' color='error'>
            စာရင်းများဖျက်မည်
          </Button>
        </div>

        <div className='flex justify-between items-center mb-4 gap-3 mt-3'>
          <div className='flex gap-3'>
            {isMonthYear == 1 ? (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  views={["year", "month"]}
                  value={selectedDate}
                  onChange={(newDate) => setSelectedDate(newDate)}
                />
              </LocalizationProvider>
            ) : (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  format='DD/MM/YYYY'
                  value={selectedDate}
                  onChange={(newDate) => setSelectedDate(newDate)}
                />
              </LocalizationProvider>
            )}

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

            <Autocomplete
              value={selectedAddress}
              onChange={(e, value) => setSelectedAddress(value)}
              getOptionLabel={(option) => {
                return option.address || "";
              }}
              disablePortal
              id='combo-box-demo'
              options={townAddress}
              sx={{ width: 300 }}
              renderInput={(params) => (
                <TextField {...params} label='လိပ်စာရွေးရန်' />
              )}
            />

            <Button onClick={filterHandle} variant='contained'>
              ရွေးကြည့်ရန်
            </Button>

            <Button onClick={getAllReports} variant='contained'>
              အကုန်ကြည့်ရန်
            </Button>
          </div>
          <IconButton onClick={() => navigate(PRINT_ROUTE)} aria-label='cart'>
            <Badge badgeContent={toPrintForm.length} color='primary'>
              <ReceiptLongIcon fontSize='large' color='primary' />
            </Badge>
          </IconButton>
        </div>
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <TableContainer sx={{ maxHeight: "53vh" }}>
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
                {pageContent.map((report, index) => (
                  <TableRow
                    className={report.is_print == 1 ? "bg-green-100" : ""}
                    role='checkbox'
                    key={index}
                  >
                    <TableCell padding='checkbox' sx={{ maxWidth: "50" }}>
                      <Checkbox
                        disabled={report.is_print == 1 ? true : false}
                        checked={
                          toPrintForm.findIndex(
                            (el) => el.purchase_id == report.purchase_id
                          ) == -1
                            ? false
                            : true
                        }
                        onClick={() => {
                          toPrintForm.findIndex(
                            (el) => el.purchase_id == report.purchase_id
                          ) == -1
                            ? dispatch(
                                addNewPrint({
                                  data: report,
                                  func: handleErrorMessage,
                                })
                              )
                            : dispatch(removePrint(report.purchase_id));
                        }}
                        color='primary'
                        inputProps={{
                          "aria-label": "select all desserts",
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      {dayjs(report.purchase_date).format("DD/MM/YYYY")}
                    </TableCell>
                    <TableCell>{report.supplier_name}</TableCell>
                    <TableCell>{report.rubber_pound}</TableCell>
                    <TableCell>{report.percentage.toFixed(2)}</TableCell>
                    <TableCell>{report.dry_rubber_pound}</TableCell>

                    <TableCell>{report.tdy_price}</TableCell>
                    <TableCell sx={{ textAlign: "end" }}>
                      {new Intl.NumberFormat().format(report.total_amount)}
                    </TableCell>

                    <TableCell>
                      <Button
                        color='error'
                        onClick={() => {
                          deleteSingleReportHandle(report.purchase_id);
                        }}
                        variant='contained'
                        fullWidth
                      >
                        ဖျက်ပါမည်။
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <div className='flex justify-end pr-4 pt-2 gap-2 items-center'>
            <h3 className='text-xl'>
              စုစုပေါင်း ရော်ဘာအခြောက်ပေါင်: =
              {new Intl.NumberFormat().format(getTotalRubberPound)}
            </h3>
            <h3 className='text-xl'>
              စုစုပေါင်း: = {new Intl.NumberFormat().format(getTotalAmount)}
            </h3>
          </div>
          <div className='flex justify-between p-6 items-center'>
            {pageContent.length == 0 ? (
              <h1>စာရင်းမရှိသေးပါ။</h1>
            ) : (
              <h1>စာရင်းစုစုပေါင်း = {reports.length}</h1>
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
    </SnackbarProvider>
  );
}
