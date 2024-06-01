import { prisma } from "~/server/prisma";

export default defineEventHandler(async (event) => {
  const user = event.context.user;
  const listId = getRouterParam(event, "listId");
  const cardId = getRouterParam(event, "cardId");

  try {
    const card = await prisma.card.delete({
      where: {
        id: cardId,
        listId: listId,
        userId: user.id,
      },
    });

    if (!card) {
      throw createError({
        statusCode: 404,
        message: "Card not found",
      });
    }
    event.node.res.statusCode = 204;
    return true;
  } catch (error) {
    return error;
  }
});
