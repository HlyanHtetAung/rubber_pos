import React, { useRef, useState } from "react";
import { Container } from "@mui/material";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { REPORT_PAGE_ROUTE } from "../navigation/routes";
import { clearPrint } from "../redux/printSlice";
import { useReactToPrint } from "react-to-print";
import { postVoucher } from "../api/voucher";
import TextField from "@mui/material/TextField";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { SnackbarProvider, useSnackbar } from "notistack";
import { height } from "@mui/system";

export function Print() {
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = React.useState(false);
  const [prePaidAmount, setPrePaidAmount] = useState(0);

  const componentRef = useRef();

  const navigate = useNavigate();
  const { toPrintForm } = useSelector((state) => state.prints);

  const supplierNameAry = [
    ...new Set(toPrintForm.map((el) => el.supplier_name)),
  ];

  const handleOpenPrintModal = () => setOpen(true);
  const handleClosePrintModal = () => {
    setOpen(false);
    dispatch(clearPrint());
    navigate(REPORT_PAGE_ROUTE);
  };

  const dispatch = useDispatch();

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
  const columns = [
    { id: "purchaseDate", label: "နေ့စွဲ" },
    { id: "rubberPounds", label: "အစည်းပေါင်" },
    { id: "percentage", label: "ရာခိုင်နှုန်း(%)" },
    { id: "dryPounds", label: "အခြောက်ပေါင်" },
    { id: "todayPrice", label: "ဈေးနှုန်း" },
    { id: "totalAmount", label: "စုစုပေါင်းရငွေ" },
  ];

  const columnsWithSupplierName = [
    { id: "supplierName", label: "အမည်" },
    { id: "purchaseDate", label: "နေ့စွဲ" },
    { id: "rubberPounds", label: "အစည်းပေါင်" },
    { id: "percentage", label: "ရာခိုင်နှုန်း(%)" },
    { id: "dryPounds", label: "အခြောက်ပေါင်" },
    { id: "todayPrice", label: "ဈေးနှုန်း" },
    { id: "totalAmount", label: "စုစုပေါင်းရငွေ" },
  ];

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    pageStyle: `@media print
    {
       @page
       {
        size: 7in 8.5in;
        size: portrait;
        margin: 0.5cm 0.5cm 0.5cm 0.5cm;
      }
    }`,
    onAfterPrint: () => {
      dispatch(clearPrint());
      navigate(REPORT_PAGE_ROUTE);
    },
  });

  const haveSupplierName =
    supplierNameAry.length > 1 ? columnsWithSupplierName : columns;

  const getTotalAmount = toPrintForm
    .map((el) => el.total_amount)
    .reduce((prev, current) => prev + current, 0);

  const getRemainAmount = getTotalAmount - prePaidAmount;

  const handlePostVoucher = async () => {
    const voucherData = {
      voucher_date: new Date().toISOString(),
      total_amount: parseFloat(getTotalAmount),
      loan: parseFloat(prePaidAmount),
      paid_amount: parseFloat(getRemainAmount),
      purchaseIdList: toPrintForm.map((el) => ({
        purchase_id: el.purchase_id,
      })),
    };
    const response = await postVoucher(voucherData);
    handleSuccessMessage("သိမ်းပြီးပါပြီ။", "success");
  };

  const handleSuccessMessage = (successMessage, variant) => {
    enqueueSnackbar(successMessage, { variant, autoHideDuration: 2000 });
  };

  return (
    <SnackbarProvider>
      <Container maxWidth='xl' className='mt-8'>
        <Modal
          open={open}
          onClose={handleClosePrintModal}
          aria-labelledby='modal-modal-title'
          aria-describedby='modal-modal-description'
        >
          <Box sx={style} className='flex flex-col justify-between gap-3'>
            <h3 className='text-center text-xl pb-5'>ဘောင်ချာထုတ်မည်လား။</h3>
            <div className='flex justify-between gap-3'>
              <Button
                className='flex-1'
                variant='contained'
                onClick={handleClosePrintModal}
              >
                မထုတ်သေးပါ။
              </Button>
              <Button
                className='flex-1'
                variant='contained'
                onClick={handlePrint}
              >
                ဘောင်ချာထုတ်မည်။
              </Button>
            </div>
          </Box>
        </Modal>
        <div className='flex justify-end gap-3'>
          <TextField
            value={prePaidAmount}
            onChange={(e) => setPrePaidAmount(e.target.value)}
            size='medium'
            id='outlined-basic'
            label='ကြိုရှင်းငွေနှုတ်ရန်'
            variant='outlined'
            type='number'
          />
          <Button
            variant='contained'
            onClick={() => {
              dispatch(clearPrint());
              navigate(REPORT_PAGE_ROUTE);
            }}
          >
            မသိမ်းသေးပါ။
          </Button>
          <Button
            disabled={toPrintForm.length == 0 ? true : false}
            variant='contained'
            onClick={() => {
              handleOpenPrintModal();
              handlePostVoucher();
            }}
          >
            သိမ်းမည်။
          </Button>
        </div>

        <div
          className='p-5'
          ref={componentRef}
          sx={{ width: "100%", overflow: "hidden" }}
        >
          <h1 className='text-center font-bold text-3xl pt-3'>
            ပွင့်တိုင်းအောင်
          </h1>
          <h1 className='text-center font-normal text-xl pt-3 mb-7'>
            ရာဘာ နှင့် ဓာတ်မြေဩဇာရောင်းဝယ်ရေး
          </h1>
          <div className='px-4 pb-3 flex justify-between text-base'>
            <h2>အမည် : {supplierNameAry.join(", ")}</h2>
            <h2 className='whitespace-nowrap'>
              Date : {new Date().toDateString()}
            </h2>
          </div>
          <TableContainer>
            <Table
              size='small'
              stickyHeader
              aria-label='sticky table'
              className='border-t border-l border-b border-black'
            >
              <TableRow style={{ height: "60px" }}>
                {haveSupplierName.map((column) => (
                  <TableCell
                    className='border-r border-black'
                    sx={{
                      textAlign: column.id == "totalAmount" ? "end" : null,
                    }}
                    key={column.id}
                    align={column.align}
                  >
                    <p className='text-base'>{column.label}</p>
                  </TableCell>
                ))}
              </TableRow>

              <TableBody>
                {toPrintForm.map((report, index) => (
                  <TableRow role='checkbox' key={index}>
                    {supplierNameAry.length > 1 ? (
                      <TableCell className='border-r border-t border-black'>
                        <p className='text-base'>{report.supplier_name}</p>
                      </TableCell>
                    ) : null}
                    <TableCell className='border-r border-t border-b border-black'>
                      <p className='text-base'>
                        {dayjs(report.purchase_date).format("DD/MM/YYYY")}
                      </p>
                    </TableCell>
                    <TableCell className='border-r border-t border-b border-black'>
                      <p className='text-base'>{report.rubber_pound}</p>
                    </TableCell>
                    <TableCell className='border-r border-t border-b  border-black'>
                      <p className='text-base'>
                        {report.percentage.toFixed(2)}
                      </p>
                    </TableCell>
                    <TableCell className='border-r border-t border-b border-black'>
                      <p className='text-base'>{report.dry_rubber_pound}</p>
                    </TableCell>
                    <TableCell className='border-r border-t border-b  border-black'>
                      <p className='text-base'>{report.tdy_price}</p>
                    </TableCell>
                    <TableCell
                      className='border-r border-t border-b border-black'
                      sx={{ textAlign: "end" }}
                    >
                      <p className='text-base'>{report.total_amount}</p>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow style={{ pageBreakInside: "avoid" }}>
                  <TableCell colSpan={2} className='border-t border-black' />
                  <TableCell colSpan={3} className='border-t border-black'>
                    <p className='text-base'>စုစုပေါင်းရငွေ :</p>
                  </TableCell>
                  <TableCell
                    colSpan={2}
                    align='right'
                    className='border-r border-t border-black'
                  >
                    <p className='text-base'>{getTotalAmount}</p>
                  </TableCell>
                </TableRow>
                <TableRow style={{ pageBreakInside: "avoid" }}>
                  <TableCell colSpan={2} className='border-t border-black' />
                  <TableCell colSpan={3} className='border-t border-black'>
                    <p className='text-base'>သွင်းငွေ :</p>
                  </TableCell>
                  <TableCell
                    colSpan={2}
                    align='right'
                    className='border-r border-t border-black'
                  >
                    <p className='text-base'>{prePaidAmount}</p>
                  </TableCell>
                </TableRow>
                <TableRow style={{ pageBreakInside: "avoid" }}>
                  <TableCell colSpan={2} className='border-t border-black' />
                  <TableCell colSpan={3} className='border-t border-black'>
                    <p className='text-base'>ရှင်းငွေ :</p>
                  </TableCell>
                  <TableCell
                    colSpan={2}
                    align='right'
                    className='border-r border-t border-black'
                  >
                    <p className='text-base'>{getRemainAmount}</p>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </Container>
    </SnackbarProvider>
  );
}
