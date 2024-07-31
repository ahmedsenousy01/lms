import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { courses } from "@/server/db/schema";

import { getCourseDetailsById } from "../data-access/course";

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
  getByUserId: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const userCourses = await ctx.db.query.courses.findMany({
        where: eq(courses.userId, input.userId),
        with: {
          user: true,
          category: true,
          attachments: true,
          chapters: true,
        },
      });

      return userCourses;
    }),
  getDetailsById: protectedProcedure
    .input(
      z.object({
        courseId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const course = await getCourseDetailsById({
        courseId: input.courseId,
        with: {
          user: true,
          category: true,
          attachments: true,
          chapters: true,
        },
      });
      console.log(course);

      if (!course) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Course not found",
        });
      }

      if (course.user.id !== ctx.session.user.id) {
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
        price: z.number().optional(),
        isPublished: z.boolean().optional(),
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
            price: input.price,
            isPublished: input.isPublished,
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
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const condition = and(
        eq(courses.id, input.id),
        eq(courses.userId, ctx.session.user.id)
      );

      try {
        await ctx.db.delete(courses).where(condition);
      } catch {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Course not found or you are not authorized to access it",
        });
      }

      return null;
    }),
});
