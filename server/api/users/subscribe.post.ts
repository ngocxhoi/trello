import { prisma } from "~/server/prisma";
import stripe from "~/server/utils/stripe";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const userId = await event.context.user.id;

  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw createError({
      statusCode: 401,
      message: "You are not logged in",
    });
  }

  if (!user.stripeCustomerId) {
    const customer = await stripe().customers.create({
      email: user.email,
      name: user.name,
    });

    user.stripeCustomerId = customer.id;
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        stripeCustomerId: customer.id,
      },
    });
  }

  const session = await stripe().checkout.sessions.create({
    customer: user.stripeCustomerId,
    line_items: [
      {
        price: config.public.STRIPE_PRICE_ID,
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `${config.auth.origin}`,
    cancel_url: `${config.auth.origin}`,
  });

  if (!session || !session.url) {
    throw createError({
      statusCode: 400,
      message: "Something went wrong",
    });
  }

  return session.url;
});
