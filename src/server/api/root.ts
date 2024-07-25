import routers from "@/server/api/routers";
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  course: routers.courseRouter,
  user: routers.userRouter,
  category: routers.categoryRouter,
  attachment: routers.attachmentRouter,
  chapter: routers.chapterRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.course.all();
 *       ^? Course[]
 */
export const createCaller = createCallerFactory(appRouter);
