import { CardSchema } from "~/schemas/Card.schema";
import { prisma } from "~/server/prisma";
import { Validator } from "#nuxt-server-utils";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const user = event.context.user;
  const listId = getRouterParam(event, "listId");
  try {
    Validator.validateSchema(CardSchema, body);
    await prisma.card.create({
      data: {
        ...body,
        userId: user.id,
      },
    });
  } catch (error) {
    return error;
  }
});
