import React, { useRef } from "react";
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

export function PreviewVoucher() {
  const componentRef = useRef();

  const navigate = useNavigate();
  const { voucherReview } = useSelector((state) => state.reviewVoucher);
  const supplierNameAry = [
    ...new Set(
      voucherReview.purchase_voucher.map(
        (el) => el.purchase.supplier.supplier_name
      )
    ),
  ];

  const dispatch = useDispatch();

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

  const getTotalAmount = voucherReview.purchase_voucher
    .map((voucher) => voucher.purchase.total_amount)
    .reduce((prev, current) => prev + current, 0);

  return (
    <Container maxWidth='xl' className='mt-8'>
      <div className='flex gap-3 justify-end mb-3'>
        <Button
          variant='contained'
          onClick={() => {
            dispatch(clearPrint());
            navigate(REPORT_PAGE_ROUTE);
          }}
        >
          မထုတ်တော့ပါ
        </Button>
        <Button variant='contained' onClick={handlePrint}>
          Print ထုတ်မည်
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
            <TableHead style={{ height: "60px" }}>
              {haveSupplierName.map((column) => (
                <TableCell
                  className='border-r border-black'
                  sx={{
                    textAlign: column.id == "totalAmount" ? "end" : null,
                  }}
                  key={column.id}
                  align={column.align}
                >
                  <p className='text-sm'>{column.label}</p>
                </TableCell>
              ))}
            </TableHead>
            <TableBody>
              {voucherReview.purchase_voucher.map((voucher, index) => (
                <TableRow
                  key={index}
                  // className="bg-green-500"
                  role='checkbox'
                >
                  {supplierNameAry.length > 1 ? (
                    <TableCell className='border-r border-t border-black'>
                      <p className='text-sm'>
                        {voucher.purchase.supplier.supplier_name}
                      </p>
                    </TableCell>
                  ) : null}
                  <TableCell className='border-r border-t border-b border-black'>
                    <p className='text-sm'>
                      {dayjs(voucher.purchase.purchase_date).format(
                        "DD/MM/YYYY"
                      )}{" "}
                    </p>
                  </TableCell>
                  <TableCell className='border-r border-t border-b border-black'>
                    <p className='text-sm'>{voucher.purchase.rubber_pound} </p>
                  </TableCell>
                  <TableCell className='border-r border-t border-b  border-black'>
                    <p className='text-sm'>
                      {voucher.purchase.percentage.toFixed(2)}{" "}
                    </p>
                  </TableCell>
                  <TableCell className='border-r border-t border-b border-black'>
                    <p className='text-sm'>
                      {voucher.purchase.dry_rubber_pound}{" "}
                    </p>
                  </TableCell>
                  <TableCell className='border-r border-t border-b  border-black'>
                    <p className='text-sm'>
                      {voucher.purchase.todayprice.tdy_price}{" "}
                    </p>
                  </TableCell>

                  <TableCell
                    className='border-r border-t border-b border-black'
                    sx={{ textAlign: "end" }}
                  >
                    <p className='text-sm'>{voucher.purchase.total_amount} </p>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={2} className='border-t border-black' />
                <TableCell colSpan={3} className='border-t border-black'>
                  <p className='text-sm'>စုစုပေါင်းရငွေ : </p>
                </TableCell>
                <TableCell
                  colSpan={2}
                  align='right'
                  className='border-r border-t border-black'
                >
                  <p className='text-sm'>{getTotalAmount} </p>
                </TableCell>
              </TableRow>
              <TableRow style={{ pageBreakInside: "avoid" }}>
                <TableCell colSpan={2} className='border-t border-black' />
                <TableCell colSpan={3} className='border-t border-black'>
                  <p className='text-sm'>သွင်းငွေ : </p>
                </TableCell>
                <TableCell
                  colSpan={2}
                  align='right'
                  className='border-r border-t border-black'
                >
                  <p className='text-base'>{voucherReview.loan} </p>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={2} className='border-t border-black' />
                <TableCell colSpan={3} className='border-t border-black'>
                  <p className='text-base'>ရှင်းငွေ : </p>
                </TableCell>
                <TableCell
                  colSpan={2}
                  align='right'
                  className='border-r border-t border-black'
                >
                  <p className='text-base'>{voucherReview.paid_amount} </p>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </Container>
  );
}
