import Stripe from "stripe";
import { prisma } from "~/server/prisma";
import stripe from "~/server/utils/stripe";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readRawBody(event);
  const stripeSignature = getHeader(event, "stripe-signature");

  if (!body || !stripeSignature) {
    throw createError({
      statusCode: 400,
      message: "Invalid data",
    });
  }

  try {
    const stripeEvent = stripe().webhooks.constructEvent(
      body,
      stripeSignature,
      config.STRIPE_WEBHOOK_SECRET
    );

    // console.log(stripeEvent.type);

    switch (stripeEvent.type) {
      case "customer.subscription.created":
      case "customer.subscription.deleted":
      case "customer.subscription.paused":
      case "customer.subscription.resumed":
      case "customer.subscription.updated": {
        const data = stripeEvent.data.object as Stripe.Subscription;

        const userFind = await prisma.user.findFirst({
          where: {
            stripeCustomerId: data.customer.toString(),
          },
        });
        if (!userFind) {
          throw createError({
            statusCode: 401,
            message: "You are not logged in",
          });
        }
        await prisma.user.update({
          where: {
            id: userFind.id,
          },
          data: {
            subscription: {
              id: data.id,
              status: data.status,
              priceId: data.items.data[0].price.id,
            },
            hasActiveSubscription: hasActiveSubscription(
              data.status.toString()
            ),
          },
        });

        // await $fetch("/api/users/1", {
        //   method: "PUT",
        //   body: {
        //     subscription: {
        //       id: data.id,
        //       status: data.status,
        //       priceId: data.items.data[0].price.id,
        //     },
        //   },
        // });
      }
    }

    return "ok";
  } catch (error: any) {
    console.log(error);
    throw createError({
      statusCode: 400,
      message: "Invalid request body",
    });
  }
});
