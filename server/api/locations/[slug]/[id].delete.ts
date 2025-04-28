import { z } from "zod";

import { findLocation } from "~/lib/db/queries/location";
import { deleteLocationLog } from "~/lib/db/queries/location-log";
import defineAuthenticatedEventHandler from "~/utils/define-authenticated-event-handler";

export default defineAuthenticatedEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug") as string;
  const location = await findLocation(slug, event.context.user.id);

  if (!location) {
    throw createError({
      statusCode: 404,
      statusMessage: "Location not found.",
    });
  }

  const id = getRouterParam(event, "id") as string;

  if (!z.coerce.number().safeParse(id).success) {
    throw createError({
      statusCode: 422,
      statusMessage: "Invalid id.",
    });
  }

  const deletedLog = await deleteLocationLog(Number(id), event.context.user.id);

  if (!deletedLog) {
    throw createError({
      statusCode: 404,
      statusMessage: "Location log not found.",
    });
  }

  setResponseStatus(event, 204);
});
