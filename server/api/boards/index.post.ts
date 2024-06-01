import { BoardSchema } from "~/schemas/Board.schema";
import { prisma } from "~/server/prisma";
import { Validator } from "#nuxt-server-utils";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const user = event.context.user;
  try {
    Validator.validateSchema(BoardSchema, body);

    const boardCount = await prisma.board.findMany({
      where: {
        userId: user.id,
      },
      select: {
        id: true,
      },
    });
    if (boardCount.length >= 1 && !user.hasActiveSubscription) {
      throw createError({
        statusCode: 403,
        message:
          "You can't have more than 1 board in free plan. Please upgrade your plan and try again",
      });
    }

    await prisma.board.create({
      data: {
        ...body,
        userId: user.id,
      },
    });
  } catch (error) {
    return error;
  }
});
