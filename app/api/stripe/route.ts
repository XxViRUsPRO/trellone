import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    return new NextResponse("[STRIPE_WEBHOOK_ERROR]", { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  if (event.type === "checkout.session.completed") {
    // Handle successful checkout
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    // Check metadata for orgId
    if (!subscription?.metadata?.orgId) {
      return new NextResponse("[STRIPE_METADATA_ERROR]", { status: 400 });
    }

    // add organization to orgSubscription
    await db.orgSubscription.create({
      data: {
        organizationId: subscription.metadata.orgId,
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: subscription.customer as string,
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000
        ),
      },
    });
  } else if (event.type === "invoice.payment_succeeded") {
    // Handle successful payment
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    // Update orgSubscription with new current period end
    await db.orgSubscription.update({
      where: {
        stripeSubscriptionId: subscription.id,
      },
      data: {
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000
        ),
      },
    });
  }

  return new NextResponse(null, { status: 200 });
}
