import { prisma } from "~/server/prisma";

export default defineEventHandler(async (event: any) => {
  const user = await event.context.user;
  const boardId = getRouterParam(event, "boardId");

  try {
    const board = prisma.board.findFirst({
      where: {
        id: boardId,
        userId: user.id,
      },
      include: {
        lists: {
          orderBy: {
            order: "asc",
          },
          include: {
            cards: {
              orderBy: {
                order: "asc",
              },
            },
          },
        },
      },
    });

    return board;
  } catch (error) {
    console.log(error);
  }
});
