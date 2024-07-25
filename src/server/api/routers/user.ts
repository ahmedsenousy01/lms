import { passwordSchema } from "@/schema/auth";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { users } from "@/server/db/schema";

export const userRouter = createTRPCRouter({
  getByEmail: protectedProcedure
    .input(z.object({ email: z.string() }))
    .query(async ({ ctx, input: { email } }) => {
      const [user] = await ctx.db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      return user ?? null;
    }),
  create: publicProcedure
    .input(
      z.object({
        firstName: z.string(),
        lastName: z.string(),
        email: z.string(),
        password: passwordSchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const existingUser = await ctx.db
          .select()
          .from(users)
          .where(eq(users.email, input.email))
          .limit(1);

        if (existingUser.length > 0) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Email already exists",
          });
        }

        const newUser = {
          id: crypto.randomUUID(),
          name: `${input.firstName} ${input.lastName}`,
          email: input.email,
          password: await bcrypt.hash(input.password, 10),
        };

        // Insert new user into the database
        await ctx.db.insert(users).values(newUser).execute();
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "An unexpected error occurred",
          });
        }
      }
    }),
});
