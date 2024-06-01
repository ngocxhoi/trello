import { prisma } from "~/server/prisma";

export default defineEventHandler(async (event: any) => {
  const listId = getRouterParam(event, "listId");
  const user = await event.context.user;

  try {
    const cards = await prisma.card.findMany({
      where: {
        listId: listId,
        userId: user.id,
      },
    });

    if (!cards) {
      throw createError({
        statusCode: 400,
        message: "Card not found",
      });
    }

    return cards;
  } catch (error) {
    console.log(error);
  }
});
