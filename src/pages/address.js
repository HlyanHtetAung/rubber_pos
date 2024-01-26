import { Container } from "@mui/material";
import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Pagination from "@mui/material/Pagination";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { getAddress, addressName, updateAddress } from "../api/address";
import { AddressForm } from "../components/addressForm";
import { SnackbarProvider, useSnackbar } from "notistack";

export function Address() {
  const [pageSize, setPageSize] = useState(25);
  const [page, setPage] = useState(1);
  const [townAddress, setTownAddress] = useState([]);
  const [selectedTown, setSelectedTown] = useState();
  const [open, setOpen] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const totalPages = Math.ceil(townAddress.length / pageSize);
  const pageContent = townAddress.slice((page - 1) * pageSize, page * pageSize);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleEditOpen = () => setOpenEdit(true);
  const handleEditClose = () => setOpenEdit(false);

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
    { id: "Address", label: "လိပ်စာ အမည်များ", minWidth: 170 },
    { id: "23", label: "", minWidth: 170 },
    { id: "33", label: "", minWidth: 170 },
    { id: "22", label: "", minWidth: 170 },
  ];

  const addNewAddress = async (addName) => {
    const result = await addressName(addName);
    setTownAddress((prev) => [...prev, result]);
    handleClose();
    handleSuccessMessage("လိပ်စာထည့်ပြီးပါပြီ။", "success");
  };

  const editAddress = async (addrName) => {
    const result = await updateAddress(selectedTown.address_id, addrName);
    getTownAddress();
    setOpenEdit(false);
    handleSuccessMessage("လိပ်စာပြင်ပြီးပါပြီ။", "success");
  };

  const getTownAddress = async () => {
    const result = await getAddress();
    setTownAddress(result);
  };

  const handleSearchAddress = (e) => {
    if (e.target.value == "") {
      getTownAddress();
    }
    setTownAddress(
      townAddress.filter((town) =>
        town.address.toLowerCase().includes(e.target.value.toLowerCase())
      )
    );
  };

  const handleSuccessMessage = (successMessage, variant) => {
    enqueueSnackbar(successMessage, { variant });
  };

  useEffect(() => {
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
            <AddressForm addFunc={addNewAddress} addressList={townAddress} />
          </Box>
        </Modal>
        <Modal
          open={openEdit}
          onClose={handleEditClose}
          aria-labelledby='modal-modal-title'
          aria-describedby='modal-modal-description'
        >
          <Box sx={style}>
            <AddressForm
              editForm
              editFunc={editAddress}
              selectedTown={selectedTown}
            />
          </Box>
        </Modal>
        <div className='flex justify-between items-center mb-4 gap-3'>
          <h3 className='text-2xl font-bold pl-2'>လိပ်စာများ</h3>
          <div className='flex gap-3'>
            <div className='flex gap-3'>
              <Button
                className='flex-1'
                variant='contained'
                onClick={handleOpen}
              >
                အသစ်ထည့်ရန်
              </Button>
            </div>
            <TextField
              onChange={handleSearchAddress}
              sx={{ width: 350 }}
              id='outlined-basic'
              label='လိပ်စာ ရှာရန်'
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
                      style={{
                        minWidth: column.minWidth,
                        fontWeight: "bold",
                        fontSize: "20px",
                      }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {townAddress.map((town, index) => (
                  <TableRow
                    // className="bg-green-500"
                    role='checkbox'
                    key={town.address_id}
                  >
                    <TableCell>{town.address}</TableCell>
                    <TableCell>{""}</TableCell>
                    <TableCell>{""}</TableCell>
                    <TableCell>
                      <Button
                        variant='contained'
                        onClick={() => {
                          handleEditOpen();
                          setSelectedTown(town);
                        }}
                      >
                        ပြင်ရန်
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
              <h1>စာရင်း စုစုပေါင်း = {townAddress.length}</h1>
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
