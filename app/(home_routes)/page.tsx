import React from "react";
import startDb from "@lib/db";
import ProductModel from "@models/productModel";
import GridView from "@components/GridView";
import ProductCard from "@components/ProductCard";
import FeaturedProductsSlider from "@components/FeaturedProductsSlider";
import FeaturedProductModel from "@models/featuredProduct";
import HorizontalMenu from "@components/HorizontalMenu";

interface LatestProduct {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnail: string;
  price: {
    base: number;
    discounted: number;
  };
  sale: number;
}

const fetchLatestProducts = async () => {
  await startDb();
  const products = await ProductModel.find().sort("-createdAt").limit(20);

  const productList = products.map((product) => {
    return {
      id: product._id.toString(),
      title: product.title,
      description: product.description,
      category: product.category,
      thumbnail: product.thumbnail.url,
      price: product.price,
      sale: product.sale,
    };
  });

  return JSON.stringify(productList);
};

const fetchFeaturedProducts = async () => {
  await startDb();
  const products = await FeaturedProductModel.find().sort("-createdAt");

  return products.map(({ _id, title, banner, link, linkTitle }) => {
    return {
      id: _id.toString(),
      title: title,
      banner: banner.url,
      link: link,
      linkTitle: linkTitle,
    };
  });
};

export default async function Home() {
  const latestProducts = await fetchLatestProducts();
  const parsedProducts = JSON.parse(latestProducts) as LatestProduct[];
  const featuredProducts = await fetchFeaturedProducts();

  return (
    <div className="my-4 space-y-4">
      <FeaturedProductsSlider products={featuredProducts} />
      <HorizontalMenu />
      <GridView>
        {parsedProducts.map((product, i) => {
          return <ProductCard key={i} product={product}></ProductCard>;
        })}
      </GridView>
    </div>
  );
}
