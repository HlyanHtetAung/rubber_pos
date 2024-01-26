import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { Container } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import { Select } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { getTdyPrice, addTdyPrice } from "../api/tdyPrice";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { SnackbarProvider, useSnackbar } from "notistack";
import { getSupplier } from "../api/supplier";
import Autocomplete from "@mui/material/Autocomplete";
import { addPurchase } from "../api/purchase";

export function Purchase() {
  const { enqueueSnackbar } = useSnackbar();
  const [sellers, setSellers] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [todayPrice, setTodayPrice] = useState({
    tdy_price_id: 0,
    tdy_price: 0,
    date: null,
  });
  const [disableEditTodayPrice, setDisableEditTodayPrice] = useState(true);

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      seller: "",
      totalPounds: null,
      percentage: null,
      dryPounds: 0,
      totalPrice: 0,
    },
  });

  const getAllSellers = async () => {
    const result = await getSupplier();

    const mappedResult = result;

    mappedResult.forEach((element) => {
      element.label = element.supplier_name;
    });

    setSellers(mappedResult);
  };

  const totalPounds = watch("totalPounds");
  const percentage = watch("percentage");

  // calculating total price
  if (totalPounds && percentage) {
    const value = (totalPounds * percentage).toFixed(3);
    setValue("dryPounds", value);
    const calculatedTotalPrice = value * todayPrice.tdy_price;
    setValue("totalPrice", Math.trunc(calculatedTotalPrice));
  }

  const onSubmit = (data) => {
    setSelectedSeller(null);
    purchaseHandle(data, "success");
  };

  // total price change handle
  const handleChangeTodayPrice = async (price, variant) => {
    if (price == "") {
      return;
    }
    const result = await addTdyPrice(price);
    enqueueSnackbar("ဝယ်စျေးပြောင်းပြီးပါပြီ", { variant });
    setTodayPrice(result);
  };

  const toggleEditTodayPrice = () => {
    if (todayPrice == "") {
      return;
    }
    if (disableEditTodayPrice == false) {
      handleChangeTodayPrice(todayPrice, "success");
      setDisableEditTodayPrice(true);
      return;
    }
    setDisableEditTodayPrice((prev) => !prev);
  };

  const getTodayPrice = async () => {
    const result = await getTdyPrice();
    setTodayPrice(result);
  };

  // post purchase
  const purchaseHandle = async (data, variant) => {
    const result = await addPurchase({
      supplier_id: data.seller,
      tdy_price_id: todayPrice.tdy_price_id,
      rubber_pound: data.totalPounds,
      percentage: data.percentage,
      dry_rubber_pound: data.dryPounds,
      total_amount: data.totalPrice,
      purchase_date: selectedDate.toISOString(),
      year: selectedDate.year().toString(),
      month: (selectedDate.month() + 1).toString(),
    });

    if (result.supplier_id) {
      enqueueSnackbar("ဝယ်ယူပြီးပါပြီ။", { variant });
      reset();
      return;
    }
  };

  useEffect(() => {
    getTodayPrice();
    getAllSellers();
  }, []);

  return (
    <SnackbarProvider>
      <Container maxWidth='xl' className='mt-8'>
        <h3 className='text-center text-4xl my-16'>ရော်ဘာအဝယ်စာရင်းထည့်ရန်</h3>
        <div className='flex justify-between mb-4'>
          {/* tdy price fix container */}
          <div className='flex gap-3'>
            <TextField
              required
              id='outlined-basic'
              label='ယနေ့ဝယ်စျေး'
              variant='outlined'
              InputLabelProps={{
                shrink: true,
              }}
              value={todayPrice.tdy_price}
              type='number'
              disabled={disableEditTodayPrice}
              onChange={(e) => setTodayPrice(e.target.value)}
              error={todayPrice == ""}
              helperText={
                todayPrice == "" ? "ယနေ့ဝယ်ဈေးထည့်ရန်လိုအပ်ပါသည်။" : ""
              }
            />
            <Button
              className='flex-1'
              variant='contained'
              onClick={toggleEditTodayPrice}
            >
              {disableEditTodayPrice == true ? "ရောင်းစျေးပြင်ရန်" : "ပြင်မည်"}
            </Button>
          </div>
          {/* tdy price fix container */}
          {/* datepicker */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              format='DD/MM/YYYY'
              value={selectedDate}
              onChange={(newDate) => setSelectedDate(newDate)}
            />
          </LocalizationProvider>
          {/* datepicker */}
        </div>

        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className='flex flex-col gap-3'
        >
          {/* seller autocomplete dropdown */}
          <Controller
            name={"seller"}
            control={control}
            rules={{
              required: "this field is requried",
            }}
            render={({ field, fieldState: { error } }) => {
              const { onChange, value, ref } = field;
              return (
                <div>
                  <Autocomplete
                    value={
                      value
                        ? sellers.find((option) => {
                            return value === option.supplier_id;
                          })
                        : null
                    }
                    getOptionLabel={(option) => {
                      return option.label;
                    }}
                    onChange={(event, newValue) => {
                      onChange(newValue ? newValue.supplier_id : null);
                    }}
                    id='controllable-states-demo'
                    options={sellers}
                    renderInput={(params) => (
                      <TextField
                        error={error ? true : false}
                        helperText={
                          error == true ? "ရောင်းသူရွေးရန်လိုအပ်ပါသည်။" : ""
                        }
                        {...params}
                        label={"အမည်"}
                        inputRef={ref}
                      />
                    )}
                  />
                </div>
              );
            }}
          />
          {/* seller autocomplete dropdown */}

          {/* rubber pound txtf */}
          <TextField
            id='outlined-basic'
            label='အစေးရည်ပေါင်'
            variant='outlined'
            {...register("totalPounds", {
              required: "အစေးပေါင်ထည့်ရန်လိုအပ်နေပါသေးသည်။",
            })}
            type='number'
            error={!!errors.totalPounds}
            helperText={
              errors.totalPounds ? "အစေးပေါင်ထည့်ရန်လိုအပ်နေပါသေးသည်။" : ""
            }
          />
          {/* rubber pound txtf */}
          {/* percentage txtf */}
          <TextField
            id='outlined-basic'
            label='ရာခိုင်နှုန်း(%)'
            variant='outlined'
            {...register("percentage", {
              required: "ရာခိုင်နှုန်းထည့်ရန်လိုအပ်နေပါသေးသည်။",
            })}
            type='number'
            error={!!errors.percentage}
            helperText={
              errors.percentage ? "ရာခိုင်နှုန်းထည့်ရန်လိုအပ်နေပါသေးသည်။" : ""
            }
          />
          {/* percentage txtf */}
          <TextField
            disabled
            id='outlined-basic'
            label='အခြောက်ပေါင်'
            variant='outlined'
            {...register("dryPounds")}
            type='number'
          />
          <TextField
            disabled
            id='outlined-basic'
            label='စုစုပေါင်းကျငွေ'
            variant='outlined'
            {...register("totalPrice")}
            type='number'
          />
          <div className='flex gap-10'>
            <Button type='submit' variant='contained' className='flex-1'>
              စာရင်းသွင်းမည်
            </Button>
            <Button
              className='flex-1'
              variant='contained'
              onClick={() => {
                reset();
              }}
            >
              ဖျက်ရန်
            </Button>
          </div>
        </form>
      </Container>
    </SnackbarProvider>
  );
}
