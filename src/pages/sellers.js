import { Container } from "@mui/material";
import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Pagination from "@mui/material/Pagination";
import { InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { SellerForm } from "../components";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { getSupplier, addSupplier, updateSupplier } from "../api/supplier";
import { getAddress, addressName } from "../api/address";
import { SnackbarProvider, useSnackbar } from "notistack";

export function Sellers() {
  const [pageSize, setPageSize] = useState(25);
  const [page, setPage] = useState(1);
  const [selectedSeller, setSelectedSeller] = useState();
  const [sellers, setSellers] = useState([]);
  const [townAddress, setTownAddress] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const totalPages = Math.ceil(sellers.length / pageSize);
  const pageContent = sellers.slice((page - 1) * pageSize, page * pageSize);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleEditOpen = () => setOpenEdit(true);
  const handleEditClose = () => setOpenEdit(false);
  const { enqueueSnackbar } = useSnackbar();

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
    { id: "sellerName", label: "အမည်", minWidth: 170 },
    { id: "sellerTownAddress", label: "လိပ်စာ", minWidth: 170 },
    { id: "sellerPhoneNumber", label: "ဖုန်းနံပါတ်", minWidth: 170 },
    { id: "sellerAction", label: "", minWidth: 170 },
  ];

  const getAllSellers = async () => {
    const result = await getSupplier();
    setSellers(result);
  };

  const addNewSeller = async (supplierName, address, phone) => {
    const result = await addSupplier({
      supplier_name: supplierName,
      address_id: address,
      ph_no: phone,
    });
    setSellers((prev) => [...prev, result]);
    handleSuccessMessage("ဝယ်သူအသစ်ထည့်ပြီးပါပြီ။", "success");
    handleClose();
  };

  const editNewSeller = async (supplierName, address, phone) => {
    const result = await updateSupplier({
      supplier_id: selectedSeller.supplier_id,
      supplier_name: supplierName,
      address_id: address,
      ph_no: phone,
    });

    getAllSellers();
    handleEditClose();
    handleSuccessMessage("ပြင်ပြီးပါပြီ။", "success");
  };

  const getTownAddress = async () => {
    const result = await getAddress();
    setTownAddress(result);
  };

  const handleSearchSeller = (e) => {
    if (e.target.value == "") {
      getAllSellers();
    }
    setSellers(
      sellers.filter((seller) =>
        seller.supplier_name
          .toLowerCase()
          .includes(e.target.value.toLowerCase())
      )
    );
  };

  const handleSuccessMessage = (successMessage, variant) => {
    enqueueSnackbar(successMessage, { variant });
  };

  useEffect(() => {
    getAllSellers();
    getTownAddress();
  }, []);

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
            <SellerForm addFunc={addNewSeller} townList={townAddress} />
          </Box>
        </Modal>
        <Modal
          open={openEdit}
          onClose={handleEditClose}
          aria-labelledby='modal-modal-title'
          aria-describedby='modal-modal-description'
        >
          <Box sx={style}>
            <SellerForm
              addFunc={addNewSeller}
              townList={townAddress}
              editForm
              editFunc={editNewSeller}
              selectedSeller={selectedSeller}
            />
          </Box>
        </Modal>
        <div className='flex justify-between items-center mb-4 gap-3'>
          <h3 className='text-2xl font-bold'>အမည်စာရင်းအများ</h3>
          <div className='flex gap-3'>
            <div className='flex gap-3'>
              <Button
                className='flex-1'
                variant='contained'
                onClick={handleOpen}
              >
                ရောင်းသူအသစ်ထည့်ရန်
              </Button>
            </div>
            <TextField
              onChange={handleSearchSeller}
              sx={{ width: 350 }}
              id='outlined-basic'
              label='ရောင်းသူရှာရန် '
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
        </div>
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <TableContainer sx={{ maxHeight: "70vh" }}>
            <Table stickyHeader aria-label='sticky table'>
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
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
                {pageContent.map((seller, index) => (
                  <TableRow
                    // className="bg-green-500"
                    role='checkbox'
                    key={seller.supplier_id}
                  >
                    <TableCell>{seller.supplier_name}</TableCell>
                    <TableCell>{seller.address.address}</TableCell>
                    <TableCell>{seller.ph_no}</TableCell>
                    <TableCell>
                      <Button
                        variant='contained'
                        onClick={() => {
                          handleEditOpen();
                          setSelectedSeller(seller);
                        }}
                      >
                        ပြုပြင်ရန်
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <div className='flex justify-between p-6 items-center'>
            {pageContent.length == 0 ? (
              <h1>စာရင်းမရှိသေးပါ။</h1>
            ) : (
              <h1>စာရင်းစုစုပေါင်း = {townAddress.length}</h1>
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
