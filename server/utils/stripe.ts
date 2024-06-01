import Stripe from "stripe";

export default () => {
  const config = useRuntimeConfig();
  if (!config.STRIPE_SECRET_KEY) {
    throw createError({
      statusCode: 500,
      message: "Stripe secret key not found",
    });
  }

  const stripe = new Stripe(config.STRIPE_SECRET_KEY);
  return stripe;
};
