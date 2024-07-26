import { env } from "@/env";
import Mux from "@mux/mux-node";
import { TRPCError } from "@trpc/server";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { chapters, courses } from "@/server/db/schema";

const { video } = new Mux({
  tokenId: env.MUX_TOKEN_ID,
  tokenSecret: env.MUX_TOKEN_SECRET,
});

export const chapterRouter = createTRPCRouter({
  getById: protectedProcedure
    .input(
      z.object({
        chapterId: z.string(),
        courseId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const [chapter] = await ctx.db
        .select()
        .from(chapters)
        .where(
          and(
            eq(chapters.id, input.chapterId),
            eq(chapters.courseId, input.courseId)
          )
        )
        .limit(1);

      if (!chapter) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Chapter not found",
        });
      }

      return chapter;
    }),
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
  update: protectedProcedure
    .input(
      z.object({
        chapter: z.object({
          id: z.string(),
          title: z.string().optional(),
          description: z.string().optional(),
          isPublished: z.boolean().optional(),
          isFree: z.boolean().optional(),
          videoUrl: z.string().optional(),
          muxAssetId: z.string().optional(),
          muxPlaybackId: z.string().optional(),
        }),
        courseId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [chapter] = await ctx.db
        .select({
          id: chapters.id,
          muxAssetId: chapters.muxAssetId,
        })
        .from(chapters)
        .where(
          and(
            eq(chapters.id, input.chapter.id),
            eq(chapters.courseId, input.courseId)
          )
        )
        .limit(1);

      if (!chapter) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Chapter not found or you are not authorized to access it",
        });
      }

      try {
        await ctx.db
          .update(chapters)
          .set({
            title: input.chapter.title,
            description: input.chapter.description,
            isPublished: input.chapter.isPublished,
            isFree: input.chapter.isFree,
            videoUrl: input.chapter.videoUrl,
            muxAssetId: input.chapter.muxAssetId,
            muxPlaybackId: input.chapter.muxPlaybackId,
          })
          .where(
            and(
              eq(chapters.id, input.chapter.id),
              eq(chapters.courseId, input.courseId)
            )
          )
          .execute();

        if (input.chapter.videoUrl) {
          if (chapter.muxAssetId) {
            await video.assets.delete(chapter.muxAssetId);
          }

          const asset = await video.assets.create({
            input: [
              {
                url: input.chapter.videoUrl,
              },
            ],
            playback_policy: ["public"],
            test: false,
          });

          await ctx.db
            .update(chapters)
            .set({
              muxAssetId: asset.id,
              muxPlaybackId: asset.playback_ids?.[0]?.id,
            })
            .where(eq(chapters.id, input.chapter.id))
            .execute();

          return {
            ...input.chapter,
            muxAssetId: asset.id,
            muxPlaybackId: asset.playback_ids?.[0]?.id,
          };
        }
        return input.chapter;
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Error updating chapter",
        });
      }
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
