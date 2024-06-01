import { prisma } from "../../prisma";
import { SignUpSchema } from "~/schemas/Signup.schema";
import { Validator } from "#nuxt-server-utils";
import { hasActiveSubscription } from "~/server/utils/hasActiveSubscription";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  try {
    Validator.validateSchema(SignUpSchema, body);
    const hash_password = await generateHash(body.password);
    await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: hash_password,
        stripeCustomerId: body.stripeCustomerId,
        subscription: {
          id: body.subscription.id,
          status: body.subscription.status,
          priceId: body.subscription.priceId,
        },
        hasActiveSubscription: hasActiveSubscription(body.subscription.status),
      },
    });

    return "User was created successfully";
  } catch (error) {
    return error;
  }
});
