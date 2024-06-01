import { prisma } from "~/server/prisma";

export default defineEventHandler(async (event) => {
  const user = await event.context.user;

  try {
    const listId = getRouterParam(event, "listId");
    const list = await prisma.list.delete({
      where: {
        id: listId,
        userId: user.id,
      },
    });

    if (!list) {
      throw createError({
        status: 404,
        message: "List not found",
      });
    }
  } catch (error) {
    return error;
  }
});
