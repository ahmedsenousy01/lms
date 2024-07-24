import { createUploadthing, type FileRouter } from "uploadthing/next";

import { UploadThingError } from "uploadthing/server";

import { auth } from "@/server/auth";

const f = createUploadthing();

export const mainFileRouter = {
  courseThumbnail: f({
    image: { maxFileSize: "4MB" },
  })
    .middleware(async ({}) => {
      const session = await auth();

      if (!session || !session.user) throw new UploadThingError("Unauthorized");

      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata }) => {
      return { uploadedBy: metadata.userId };
    }),
  courseAttachment: f(["text", "image", "video", "audio", "pdf"])
    .middleware(async ({}) => {
      const session = await auth();

      if (!session || !session.user) throw new UploadThingError("Unauthorized");

      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata }) => {
      return { uploadedBy: metadata.userId };
    }),
  chapterVideo: f({
    video: { maxFileSize: "512MB" },
  })
    .middleware(async ({}) => {
      const session = await auth();

      if (!session || !session.user) throw new UploadThingError("Unauthorized");

      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata }) => {
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type MainFileRouter = typeof mainFileRouter;
