import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";

import * as schema from "../src/server/db/schema";

const db = drizzle(sql, { schema });

async function main() {
  try {
    await db.insert(schema.categories).values([
      {
        name: "Computer Science",
      },
      {
        name: "Music",
      },
      {
        name: "Fitness",
      },
      {
        name: "Photography",
      },
      {
        name: "Accounting",
      },
      {
        name: "Engineering",
      },
      {
        name: "Filming",
      },
    ]);
    console.error("Seeded categories");
  } catch (error) {
    console.error(error);
  }
}

void main();
