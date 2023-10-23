"use client";
import React from "react";
import { ProductResponse } from "@/app/types";
import ProductForm, { InitialValue } from "./ProductForm";
import { removeAndUpdateProductImage } from "../(admin)/products/action";

interface Props {
  product: ProductResponse;
}

export default function UpdateProduct({ product }: Props) {
  const initialValue: InitialValue = {
    ...product,
    thumbnail: product.thumbnail.url,
    images: product.images?.map(({ url }) => url),
    mrp: product.price.base,
    salePrice: product.price.discounted,
    bulletPoints: product.bulletPoints || [],
  };

  const handleImageRemove = (source: string) => {
    const splittedData = source.split("/");
    const lastItem = splittedData[splittedData.length - 1];
    const publicId = lastItem.split(".")[0];

    removeAndUpdateProductImage(product.id, publicId);
  };

  return (
    <div>
      <ProductForm
        onImageRemove={handleImageRemove}
        initialValue={initialValue}
        onSubmit={(values) => {
          console.log(values);
        }}
      />
    </div>
  );
}
