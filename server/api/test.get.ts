export default defineEventHandler(async (event) => {
  const user = await event.context.user;
  return user;
});
