import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { courses } from "@/server/db/schema";

export const courseRouter = createTRPCRouter({
  getAllHeadlines: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select({
        id: courses.id,
        title: courses.title,
        createdAt: courses.createdAt,
        imageUrl: courses.imageUrl,
      })
      .from(courses)
      .orderBy(courses.createdAt);
  }),
  getDetailsById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input: { id } }) => {
      const [course] = await ctx.db
        .select()
        .from(courses)
        .where(eq(courses.id, id))
        .limit(1);

      if (!course) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Course not found",
        });
      }

      if (course.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to access this course",
        });
      }

      return course;
    }),
  create: protectedProcedure
    .input(z.object({ title: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const course = {
        id: crypto.randomUUID(),
        title: input.title,
        userId: ctx.session.user.id,
      };
      await ctx.db.insert(courses).values(course);
      return course;
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1).optional(),
        description: z.string().min(1).optional(),
        imageUrl: z.string().url().optional(),
        categoryId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const condition = and(
        eq(courses.id, input.id),
        eq(courses.userId, ctx.session.user.id)
      );

      try {
        await ctx.db
          .update(courses)
          .set({
            title: input.title,
            description: input.description,
            imageUrl: input.imageUrl,
            categoryId: input.categoryId,
          })
          .where(condition);
      } catch {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Course not found or you are not authorized to access it",
        });
      }

      const [course] = await ctx.db
        .select()
        .from(courses)
        .where(condition)
        .limit(1);

      return course ?? null;
    }),
});
