import { ListSchema } from "~/schemas/List.schema";
import { prisma } from "~/server/prisma";
import { Validator } from "#nuxt-server-utils";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const user = event.context.user;

  try {
    Validator.validateSchema(ListSchema, body);

    let list = await prisma.list.create({
      data: {
        ...body,
        userId: user.id,
      },
    });

    if (!list) {
      throw createError({
        statusCode: 400,
        message: "Some thing went wrong",
      });
    }
    return list;
  } catch (error) {
    return error;
  }
});
