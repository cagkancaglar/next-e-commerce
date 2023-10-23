"use client";
import React from "react";
import { NewProductInfo, ProductResponse, ProductToUpdate } from "@/app/types";
import ProductForm, { InitialValue } from "./ProductForm";
import {
  removeAndUpdateProductImage,
  removeImageFromCloud,
  updateProduct,
} from "../(admin)/products/action";
import { updateProductInfoSchema } from "@utils/validationSchema";
import { ValidationError } from "yup";
import { toast } from "react-toastify";
import { uploadImage } from "@utils/helper";

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

  const handleOnSubmit = async (values: NewProductInfo) => {
    try {
      const { thumbnail, images } = values;
      await updateProductInfoSchema.validate(values, { abortEarly: false });

      const dataToUpdate: ProductToUpdate = {
        title: values.title,
        description: values.description,
        bulletPoints: values.bulletPoints,
        category: values.category,
        quantity: values.quantity,
        price: {
          base: values.mrp,
          discounted: values.salePrice,
        },
      };

      if (thumbnail) {
        await removeImageFromCloud(product.thumbnail.id);
        const { id, url } = await uploadImage(thumbnail);
        dataToUpdate.thumbnail = { id, url };
      }

      if (images.length) {
        const uploadPromise = images.map(async (imgFile) => {
          return await uploadImage(imgFile);
        });
        dataToUpdate.images = await Promise.all(uploadPromise);
      }

      await updateProduct(product.id, dataToUpdate);
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
      <ProductForm
        onImageRemove={handleImageRemove}
        initialValue={initialValue}
        onSubmit={handleOnSubmit}
      />
    </div>
  );
}
