import { ListSchema } from "~/schemas/List.schema";
import { prisma } from "~/server/prisma";
import { Validator } from "#nuxt-server-utils";

export default defineEventHandler(async (event) => {
  const user = await event.context.user;
  const body = await readBody(event);
  let query = getQuery(event);
  let boardId = query.boardId as string;

  try {
    // Validator.validateSchema(ListSchema, body);
    const lists = await prisma.list.updateMany({
      where: {
        boardId: boardId,
        userId: user.id,
      },
      data: body,
    });
    return lists;
  } catch (error) {
    return error;
  }
});
