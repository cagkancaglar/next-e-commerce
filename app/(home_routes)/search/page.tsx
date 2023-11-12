import GridView from "@components/GridView";
import ProductCard, { Product } from "@components/ProductCard";
import startDb from "@lib/db";
import ProductModel, { ProductDocument } from "@models/productModel";
import SearchFilter from "@components/SearchFilter";
import React from "react";
import { FilterQuery } from "mongoose";

type options = {
  query: string;
  priceSort?: "asc" | "desc";
  maxRating?: number;
  minRating?: number;
};

interface Props {
  searchParams: options;
}

const searchProducts = async (options: options) => {
  await startDb();

  const { query, maxRating, minRating, priceSort } = options;

  const filter: FilterQuery<ProductDocument> = {
    title: { $regex: query, $options: "i" },
  };

  if (typeof minRating === "number" && typeof maxRating === "number") {
    const minCondition = minRating >= 0;
    const maxCondition = maxRating <= 5;

    if (minCondition && maxCondition) {
      filter.rating = { $gte: minRating, $lte: maxRating };
    }
  }

  const products = await ProductModel.find({
    ...filter,
  }).sort({ "price.discounted": priceSort === "asc" ? 1 : -1 });

  const productList = products.map((product) => {
    return {
      id: product._id.toString(),
      title: product.title,
      description: product.description,
      category: product.category,
      thumbnail: product.thumbnail.url,
      price: product.price,
      sale: product.sale,
      rating: product.rating,
    };
  });

  return JSON.stringify(productList);
};

export default async function Search({ searchParams }: Props) {
  const { minRating, maxRating } = searchParams;

  const results = JSON.parse(
    await searchProducts({
      ...searchParams,
      maxRating: maxRating ? +maxRating : undefined,
      minRating: minRating ? +minRating : undefined,
    })
  ) as Product[];

  return (
    <div>
      <SearchFilter>
        <GridView>
          {results.map((product, i) => {
            return <ProductCard key={i} product={product}></ProductCard>;
          })}
        </GridView>
      </SearchFilter>
    </div>
  );
}
