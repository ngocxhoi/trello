import { prisma } from "~/server/prisma";

export default defineEventHandler(async (event: any) => {
  const user = await event.context.user;
  const listId = getRouterParam(event, "listId");

  try {
    const cards = prisma.card.findFirst({
      where: {
        listId: listId,
        userId: user.id,
      },
    });

    return cards;
  } catch (error) {
    console.log(error);
  }
});
