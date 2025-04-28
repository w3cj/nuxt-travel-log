import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { z } from "zod";

import { deleteLocationLogImage } from "~/lib/db/queries/location-log-image";
import env from "~/lib/env";
import createS3Client from "~/utils/create-s3-client";
import defineAuthenticatedEventHandler from "~/utils/define-authenticated-event-handler";

export default defineAuthenticatedEventHandler(async (event) => {
  const imageId = getRouterParam(event, "image-id") as string;

  if (!z.coerce.number().safeParse(imageId).success) {
    throw createError({
      statusCode: 422,
      statusMessage: "Invalid image id.",
    });
  }

  const slug = getRouterParam(event, "slug") as string;
  const id = getRouterParam(event, "id") as string;

  await event.$fetch(`/api/locations/${slug}/${id}`);

  const deleted = await deleteLocationLogImage(Number(imageId), event.context.user.id);

  if (deleted) {
    const client = createS3Client();
    const command = new DeleteObjectCommand({
      Bucket: env.S3_BUCKET,
      Key: deleted.key,
    });

    await client.send(command);
  }

  setResponseStatus(event, 204);
});
