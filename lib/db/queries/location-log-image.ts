import type { InsertLocationLogImage } from "../schema";

import db from "..";
import { locationLogImage } from "../schema";

export async function insertLocationLogImage(
  locationLogId: number,
  insertable: InsertLocationLogImage,
  userId: number,
) {
  const [inserted] = await db.insert(locationLogImage).values({
    ...insertable,
    userId,
    locationLogId,
  }).returning();

  return inserted;
}
