"use server";

import { auth, currentUser } from "@clerk/nextjs";
import { DataType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { StripeRedirect } from "./schema";
import { createSafeAction } from "@/lib/create-safe-action";
import { absoluteUrl } from "@/lib/utils";
import { stripe } from "@/lib/stripe";

const handler = async (data: DataType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId) {
    return {
      error: "Unauthorized",
    };
  }

  if (!orgId) {
    return {
      error: "Organization not found",
    };
  }

  const user = await currentUser();

  if (!user) {
    return {
      error: "Unauthorized",
    };
  }

  const settingsUrl = absoluteUrl(`/organization/${orgId}`);

  let url = "";

  try {
    const subscription = await db.orgSubscription.findUnique({
      where: {
        organizationId: orgId,
      },
    });

    if (subscription && subscription.stripeCustomerId) {
      const session = await stripe.billingPortal.sessions.create({
        customer: subscription.stripeCustomerId,
        return_url: settingsUrl,
      });

      url = session.url;
    } else {
      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        payment_method_types: ["card"],
        billing_address_collection: "auto",
        customer_email: user.emailAddresses[0].emailAddress,
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: "Trellone Pro",
                description: "Trellone Pro Subscription",
              },
              unit_amount: 1000,
              recurring: {
                interval: "month",
              },
            },
            quantity: 1,
          },
        ],
        subscription_data: {
          metadata: {
            orgId: orgId,
          },
        },
        metadata: {
          orgId: orgId,
        },
        success_url: settingsUrl,
        cancel_url: settingsUrl,
      });

      url = session.url || "";
    }
  } catch (error) {
    console.error(error);
    return {
      error: "Something went wrong",
    };
  }

  revalidatePath(`/organization/${orgId}`);
  return {
    data: url,
  };
};

export const stripeRedirect = createSafeAction(StripeRedirect, handler);
