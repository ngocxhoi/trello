import { getServerSession } from "#auth";

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event);

  const protectedRoutes = ["/api/users/", "/api/boards", "/api/lists", "/test"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    getRequestURL(event).pathname.startsWith(route)
  );

  if (!isProtectedRoute) return;

  if (!session) {
    throw createError({
      status: 401,
      statusMessage: "Unauthenticated",
      message: "You must be logged to access this resource because no session",
    });
  }

  event.context.user = session?.user;
});
