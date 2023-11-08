import startDb from "@lib/db";
import OrderModel from "@models/orderModel";
import { auth } from "@/auth";
import { isValidObjectId } from "mongoose";
import { NextResponse } from "next/server";

const validStatus = ["delivered", "ordered", "shipped"];

export const POST = async (req: Request) => {
  try {
    const session = await auth();
    const user = session?.user;

    if (user?.role !== "admin")
      return NextResponse.json(
        {
          error: "Unauthorized request!",
        },
        { status: 401 }
      );

    const { orderId, deliveryStatus } = await req.json();

    if (!isValidObjectId(orderId) || !deliveryStatus.includes(validStatus))
      return NextResponse.json(
        {
          error: "Invalid data!",
        },
        { status: 401 }
      );

    await startDb();
    await OrderModel.findByIdAndUpdate(orderId, { deliveryStatus });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Something went wrong, could not change delivery status!",
      },
      { status: 500 }
    );
  }
};
