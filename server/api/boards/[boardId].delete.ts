import { BoardSchema } from "~/schemas/Board.schema";
import { prisma } from "~/server/prisma";

export default defineEventHandler(async (event) => {
  const user = await event.context.user;

  try {
    const boardId = getRouterParam(event, "boardId");
    const board = await prisma.board.delete({
      where: {
        id: boardId,
        userId: user.id,
      },
    });

    if (!board) {
      throw createError({
        status: 404,
        message: "Board not found",
      });
    }

    return board;
  } catch (error) {
    return error;
  }
});
