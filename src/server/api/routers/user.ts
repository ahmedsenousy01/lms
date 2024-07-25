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
    .input(z.object({ email: z.string(), password: passwordSchema }))
    .mutation(async ({ ctx, input }) => {
      // TODO: this fn doesn't run change the db state while it should
      const [user] = await ctx.db
        .select()
        .from(users)
        .where(eq(users.email, input.email))
        .limit(1);

      if (user) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Email already exists",
        });
      }

      const newUser = {
        id: crypto.randomUUID(),
        email: input.email,
        password: await bcrypt.hash(input.password, 10),
      };
      await ctx.db.insert(users).values(newUser);

      return newUser;
    }),
});
