import { BoardSchema } from "~/schemas/Board.schema";
import { prisma } from "~/server/prisma";
import { Validator } from "#nuxt-server-utils";

export default defineEventHandler(async (event) => {
  const user = await event.context.user;
  const body = await readBody(event);

  try {
    Validator.validateSchema(BoardSchema, body);
    const boardId = getRouterParam(event, "boardId");
    const board = await prisma.board.update({
      where: {
        id: boardId,
        userId: user.id,
      },
      data: body,
    });
    return board;
  } catch (error) {
    return error;
  }
});
