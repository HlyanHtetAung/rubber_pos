import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import { Select } from "@mui/material";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";

export function SellerForm({
  addFunc,
  townList,
  editForm,
  editFunc,
  selectedSeller,
}) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      phone: null,
      sellerName: null,
      townAddress: "",
    },
  });

  const onSubmit = (data) => {
    editForm
      ? editFunc(data.sellerName, data.townAddress, data.phone)
      : addFunc(data.sellerName, data.townAddress, data.phone);
    reset();
  };

  useEffect(() => {
    if (editForm) {
      reset({
        phone: selectedSeller.ph_no,
        sellerName: selectedSeller.supplier_name,
        townAddress: selectedSeller.address.address_id,
      });
    }
  }, []);

  return (
    <div>
      <h3 className='text-center text-4xl mb-5'>
        {editForm ? "ဝယ်သူ ပြင်ရန်" : "ဝယ်သူ အသစ်ထည့်ရန်"}
      </h3>
      <form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        className='flex flex-col gap-3'
      >
        <TextField
          id='outlined-basic'
          label='အမည်'
          variant='outlined'
          {...register("sellerName", {
            required: "အမည်ထည့်သွင်းရန်လိုအပ်ပါသည်။",
          })}
          type='text'
          error={!!errors.sellerName}
          helperText={errors.sellerName ? "အမည်ထည့်သွင်းရန်လိုအပ်ပါသည်။" : ""}
        />
        <TextField
          id='outlined-basic'
          label='ဖုန်းနံပါတ်'
          variant='outlined'
          {...register("phone", {
            required: "ဖုန်းနံပါတ်ထည့်သွင်းရန်လိုအပ်ပါသည်။",
          })}
          type='number'
          error={!!errors.phone}
          helperText={errors.phone ? "ဖုန်းနံပါတ်ထည့်သွင်းရန်လိုအပ်ပါသည်။" : ""}
        />
        <Controller
          name='townAddress'
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <FormControl error={!!errors.townAddress}>
              <InputLabel>လိပ်စာ</InputLabel>
              <Select required label='Town Address' {...field} id='townAddress'>
                {townList.map((addressList) => (
                  <MenuItem
                    key={addressList.address_id}
                    value={addressList.address_id}
                  >
                    {addressList.address}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>
                {errors.townAddress ? "လိပ်စာရွေးရန်လိုအပ်ပါသည်။" : ""}
              </FormHelperText>
            </FormControl>
          )}
        />
        <div className='flex gap-10'>
          {/* <Button
            className="flex-1"
            variant="contained"
            onClick={() => {
              reset();
            }}
          >
            ဖျက်ရန်
          </Button> */}
          <Button type='submit' variant='contained' className='flex-1'>
            {editForm ? "ပြင်မည်။" : "အသစ်ထည့်မည်။"}
          </Button>
        </div>
      </form>
    </div>
  );
}
