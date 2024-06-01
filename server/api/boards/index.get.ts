import { prisma } from "~/server/prisma";

export default defineEventHandler(async (event: any) => {
  const user = await event.context.user;

  try {
    const boards = prisma.board.findMany({
      where: {
        userId: user.id,
      },
    });

    return boards;
  } catch (error) {
    console.log(error);
  }
});
