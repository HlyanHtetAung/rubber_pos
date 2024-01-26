import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

export function AddressForm({ addFunc, editForm, editFunc, selectedTown }) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      addressName: "",
    },
  });

  const onSubmit = (data) => {
    editForm ? editFunc(data.addressName) : addFunc(data.addressName);
    reset();
  };

  useEffect(() => {
    if (editForm) {
      reset({
        addressName: selectedTown.address,
      });
    }
  }, []);

  return (
    <div>
      <h3 className='text-center text-4xl mb-5'>
        {editForm ? "လိပ်စာ ပြင်ရန်" : "လိပ်စာ အသစ်ထည့်ရန်"}
      </h3>
      <form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        className='flex flex-col gap-3'
      >
        <TextField
          id='outlined-basic'
          label='လိပ်စာအမည်'
          variant='outlined'
          {...register("addressName", {
            required: "လိပ်စာအမည်ထည့်ရန်လိုအပ်ပါသည်။",
          })}
          type='text'
          error={!!errors.addressName}
          helperText={errors.addressName ? "လိပ်စာအမည်ထည့်ရန်လိုအပ်ပါသည်။" : ""}
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
            {editForm ? "ပြုပြင်မည်။" : "ထည့်သွင်းမည်။"}
          </Button>
        </div>
      </form>
    </div>
  );
}
