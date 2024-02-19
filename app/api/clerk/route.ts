import { NextRequest } from "next/server";
import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { Webhook } from "svix";
import { db } from "@/lib/db";

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET || "";

async function validateWebhook(req: NextRequest) {
  const headerPayload = headers();
  const payloadString = await req.text();
  const svixHeaders = {
    "svix-id": headerPayload.get("svix-id")!,
    "svix-timestamp": headerPayload.get("svix-timestamp")!,
    "svix-signature": headerPayload.get("svix-signature")!,
  };

  const wh = new Webhook(webhookSecret);
  return wh.verify(payloadString, svixHeaders) as WebhookEvent;
}

enum UserEventType {
  UserCreated = "user.created",
  UserUpdated = "user.updated",
  UserDeleted = "user.deleted",
}

export async function POST(req: NextRequest) {
  const event = await validateWebhook(req);

  switch (event.type) {
    case UserEventType.UserCreated:
      // Handle user creation
      await db.user.create({
        data: {
          id: event.data.id,
          email: event.data.email_addresses[0].email_address,
          name: event.data.first_name,
          pfpUrl: event.data.image_url,
        },
      });
      break;
    case UserEventType.UserUpdated:
      // Handle user update
      await db.user.upsert({
        where: {
          id: event.data.id,
        },
        create: {
          id: event.data.id,
          email: event.data.email_addresses[0].email_address,
          name: event.data.first_name,
          pfpUrl: event.data.image_url,
        },
        update: {
          email: event.data.email_addresses[0].email_address,
          name: event.data.first_name,
          pfpUrl: event.data.image_url,
        },
      });
      break;
    case UserEventType.UserDeleted:
      // Handle user deletion
      await db.user.delete({
        where: {
          id: event.data.id,
        },
      });
      break;
    default:
      console.error(
        `[CLERK_WEBHOOK_ERROR]: Unhandled event type: ${event.type}`
      );
      break;
  }

  return new Response("OK");
}
