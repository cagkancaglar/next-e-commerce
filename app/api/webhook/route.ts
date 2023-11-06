import { getCartItems } from "@lib/cartHelper";
import OrderModel from "@models/orderModel";
import { StripeCustomer } from "@/app/types";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripeSecret = process.env.STRIPE_SECRET_KEY!;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

const stripe = new Stripe(stripeSecret, {
  apiVersion: "2023-10-16",
});

export const POST = async (req: Request) => {
  const data = await req.text();

  const signature = req.headers.get("stripe-signature")!;

  let event;

  try {
    event = await stripe.webhooks.constructEvent(
      data,
      signature,
      webhookSecret
    );
  } catch (error) {
    return NextResponse.json(
      { error: (error as any).message },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const stripeSession = event.data.object as {
      customer: string;
      payment_intent: string;
      amount_subtotal: number;
      customer_details: any;
      payment_status: string;
    };

    const customer = (await stripe.customers.retrieve(
      stripeSession.customer
    )) as unknown as StripeCustomer;

    const { cartId, userId, type } = customer.metadata;

    // create new order
    if (type === "checkout") {
      const cartItems = await getCartItems(userId, cartId);

      OrderModel.create({
        userId,
        stripeCustomerId: stripeSession.customer,
        paymentIntent: stripeSession.payment_intent,
        totalAmount: stripeSession.amount_subtotal / 100,
        shippingDetails: {
          address: stripeSession.customer_details.address,
          email: stripeSession.customer_details.email,
          name: stripeSession.customer_details.name,
        },
        paymentStatus: stripeSession.payment_status,
        deliveryStatus: "ordered",
        orderItems: cartItems.products,
      });
    }

    // recount our stock
  }

  return NextResponse.json({});
};