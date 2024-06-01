import { prisma } from "~/server/prisma";
import { Validator } from "#nuxt-server-utils";
import { CardSchema } from "~/schemas/Card.schema";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const user = event.context.user;
  const listId = getRouterParam(event, "listId");
  const cardId = getRouterParam(event, "cardId");

  try {
    Validator.validateSchema(CardSchema.partial(), body);
    const card = await prisma.card.update({
      where: {
        id: cardId,
        listId: listId,
        userId: user.id,
      },
      data: {
        ...body,
      },
    });

    if (!card) {
      throw createError({
        statusCode: 404,
        message: "Card not found",
      });
    }
    return card;
  } catch (error) {
    return error;
  }
});
