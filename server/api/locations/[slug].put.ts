import { findLocationByName, updateLocationBySlug } from "~/lib/db/queries/location";
import { InsertLocation } from "~/lib/db/schema";
import defineAuthenticatedEventHandler from "~/utils/define-authenticated-event-handler";
import sendZodError from "~/utils/send-zod-error";

export default defineAuthenticatedEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug") as string;
  const result = await readValidatedBody(event, InsertLocation.safeParse);

  if (!result.success) {
    return sendZodError(event, result.error);
  }

  const existingLocation = await findLocationByName(result.data, event.context.user.id);

  if (existingLocation && existingLocation.slug !== slug) {
    return sendError(event, createError({
      statusCode: 409,
      statusMessage: "A location with that name already exists!",
    }));
  }

  return updateLocationBySlug(result.data, slug, event.context.user.id);
});
