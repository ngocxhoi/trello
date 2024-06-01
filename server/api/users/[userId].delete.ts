import { prisma } from "~/server/prisma";

export default defineEventHandler(async (event) => {
  const user = await event.context.user;

  try {
    // const userId = getRouterParam(event, "userId");
    await prisma.user.delete({
      where: {
        id: user.id,
      },
    });
    return "Account deleted successfully";
  } catch (error) {
    return error;
  }
});
