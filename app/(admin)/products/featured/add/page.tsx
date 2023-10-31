import FeaturedProductTable from "@components/FeaturedProductTable";
import FeaturedProductForm from "@components/FeaturedProductForm";
import React from "react";

export default function AddFeaturedProduct() {
  return (
    <div>
      <FeaturedProductForm />
      <FeaturedProductTable products={[]} />
    </div>
  );
}
