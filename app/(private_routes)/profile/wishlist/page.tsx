import startDb from "@lib/db";
import WishlistModel from "@models/wishlistModel";
import { auth } from "@/auth";
import { ObjectId } from "mongoose";
import { redirect } from "next/navigation";
import React from "react";

const fetchProducts = async () => {
  const session = await auth();
  if (!session?.user) return redirect("/404");

  await startDb();
  const wishlist = await WishlistModel.findOne<{
    products: [
      {
        _id: ObjectId;
        title: string;
        thumbnail: { url: string };
        price: { discounted: number };
      }
    ];
  }>({
    user: session.user.id,
  }).populate({
    path: "products",
    select: "title thumbnail.url price.discounted",
  });

  if (!wishlist) return [];

  return wishlist?.products.map(({ _id, title, thumbnail, price }) => {
    return {
      id: _id.toString(),
      title,
      price: price.discounted,
      thumbnail: thumbnail.url,
    };
  });
};

export default async function Wishlist() {
  const products = await fetchProducts();
  console.log(products);

  return <div>Wishlist</div>;
}
