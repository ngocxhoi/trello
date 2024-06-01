export default defineEventHandler(async (event) => {
  const user = event.context.user;
  if (!user.stripeCustomerId) {
    throw createError({
      status: 400,
      message: "User never subscribed to any service",
    });
  }

  const session = await stripe().billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: useRuntimeConfig().auth.origin,
  });

  return session.url;
});
