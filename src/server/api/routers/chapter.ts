import { TRPCError } from "@trpc/server";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { chapters, courses } from "@/server/db/schema";

export const chapterRouter = createTRPCRouter({
  getByCourseId: protectedProcedure
    .input(
      z.object({
        courseId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db
        .select({
          id: chapters.id,
          title: chapters.title,
          description: chapters.description,
          isPublished: chapters.isPublished,
          courseId: chapters.courseId,
        })
        .from(chapters)
        .where(eq(chapters.courseId, input.courseId))
        .orderBy(chapters.position);
    }),
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1, { message: "title is required" }),
        courseId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [course] = await ctx.db
        .select({
          userId: courses.userId,
        })
        .from(courses)
        .where(eq(courses.id, input.courseId))
        .limit(1);

      if (!course) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Course not found",
        });
      }

      if (course.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to access this course",
        });
      }

      const [lastChapter] = await ctx.db
        .select({
          position: chapters.position,
        })
        .from(chapters)
        .where(eq(chapters.courseId, input.courseId))
        .orderBy(desc(chapters.position))
        .limit(1);

      const position = lastChapter?.position ? lastChapter.position + 1 : 1;

      const chapter = {
        id: crypto.randomUUID(),
        title: input.title,
        courseId: input.courseId,
        position,
      };
      await ctx.db.insert(chapters).values(chapter);
      return {
        ...chapter,
        description: null,
        isPublished: false,
        isFree: false,
        videoUrl: null,
        muxAssetId: null,
        muxPlaybackId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }),
  reorder: protectedProcedure
    .input(
      z.object({
        chapters: z.array(
          z.object({
            id: z.string(),
            newPosition: z.number(),
          })
        ),
        courseId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async tx => {
        try {
          for (const chapter of input.chapters) {
            await tx
              .update(chapters)
              .set({
                position: chapter.newPosition,
              })
              .where(eq(chapters.id, chapter.id))
              .execute();
          }
        } catch (error) {
          tx.rollback();
          throw error;
        }
      });

      const reorderedChapters = await ctx.db
        .select({
          id: chapters.id,
          title: chapters.title,
          description: chapters.description,
          isPublished: chapters.isPublished,
          courseId: chapters.courseId,
          position: chapters.position,
        })
        .from(chapters)
        .where(eq(chapters.courseId, input.courseId))
        .orderBy(chapters.position);

      return reorderedChapters;
    }),
});
