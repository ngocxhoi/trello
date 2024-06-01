import { prisma } from "~/server/prisma";
import { hasActiveSubscription } from "~/server/utils/hasActiveSubscription";

export default defineEventHandler(async (event) => {
  const user = await event.context.user;
  const body = await readBody(event);

  try {
    // const userId = getRouterParam(event, "userId");
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        ...body,
        hasActiveSubscription: hasActiveSubscription(body.subscription.status),
      },
    });
    return "Account deleted successfully";
  } catch (error) {
    return error;
  }
});
