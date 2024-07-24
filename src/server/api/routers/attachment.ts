import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { attachments } from "@/server/db/schema";

export const attachmentRouter = createTRPCRouter({
  add: protectedProcedure
    .input(
      z.object({
        url: z.string().url(),
        courseId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const attachment = {
        id: crypto.randomUUID(),
        name: input.url.split("/").pop() ?? crypto.randomUUID(),
        url: input.url,
        courseId: input.courseId,
      };
      await ctx.db.insert(attachments).values(attachment);
      return attachment;
    }),
  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        courseId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const condition = and(
        eq(attachments.id, input.id),
        eq(attachments.courseId, input.courseId)
      );

      try {
        await ctx.db.delete(attachments).where(condition);
      } catch {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Attachment not found or you are not authorized to access it",
        });
      }
    }),
});
