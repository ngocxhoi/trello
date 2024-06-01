import { ListSchema } from "~/schemas/List.schema";
import { prisma } from "~/server/prisma";
import { Validator } from "#nuxt-server-utils";

export default defineEventHandler(async (event) => {
  const user = await event.context.user;
  const body = await readBody(event);
  const listId = getRouterParam(event, "listId");

  try {
    const list = await prisma.list.update({
      where: {
        id: listId,
        userId: user.id,
      },
      data: body,
    });

    if (list) return list;
    throw createError({
      statusCode: 404,
      message: "List not found",
    });
  } catch (error) {
    return error;
  }
});
