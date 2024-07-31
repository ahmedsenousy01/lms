export type FullCourseDto = {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  price: number | null;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date | null;
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
  category: {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date | null;
  } | null;
  attachments: {
    id: string;
    name: string;
    url: string;
    createdAt: Date;
    updatedAt: Date | null;
  }[];
  chapters: {
    id: string;
    title: string;
    description: string | null;
    videoUrl: string | null;
    position: number | null;
    isPublished: boolean;
    isFree: boolean;
    courseId: string;
    muxAssetId: string | null;
    muxPlaybackId: string | null;
    createdAt: Date;
    updatedAt: Date | null;
  }[];
};
