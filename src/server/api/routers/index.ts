import { attachmentRouter } from "./attachment";
import { categoryRouter } from "./category";
import { chapterRouter } from "./chapter";
import { courseRouter } from "./course";
import { userRouter } from "./user";

const routers = {
  courseRouter,
  userRouter,
  categoryRouter,
  attachmentRouter,
  chapterRouter,
};

export default routers;
