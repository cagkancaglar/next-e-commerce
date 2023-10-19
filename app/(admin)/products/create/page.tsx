"use client";
import { NewProductInfo } from "@/app/types";
import { newProductInfoSchema } from "@/app/utils/validationSchema";
import ProductForm from "@components/ProductForm";
import React from "react";
import { ValidationError } from "yup";
import { toast } from "react-toastify";
import { uploadImage } from "@/app/utils/helper";

export default function Create() {
  const handleCreateProduct = async (values: NewProductInfo) => {
    try {
      // await newProductInfoSchema.validate(values, { abortEarly: false });
      await uploadImage(values.thumbnail!)
    } catch (error) {
      if (error instanceof ValidationError) {
        error.inner.map((err) => {
          toast.error(err.message);
        });
      }
    }
  };

  return (
    <div>
      <ProductForm onSubmit={handleCreateProduct} />
    </div>
  );
}
