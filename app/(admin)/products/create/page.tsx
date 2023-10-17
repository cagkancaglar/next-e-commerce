"use client";
import { NewProductInfo } from "@/app/types";
import ProductForm from "@components/ProductForm";
import React from "react";

export default function Create() {
  const handleCreateProduct = (values: NewProductInfo) => {};

  return (
    <div>
      <ProductForm onSubmit={handleCreateProduct} />
    </div>
  );
}
