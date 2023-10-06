import { AlbumPayloadSchema } from "./schema.js";

const AlbumsValidator = {
  validateAlbumPayload: (payload) => {
    const validationResult = AlbumPayloadSchema.validate(payload);

    if (validationResult.error) throw new Error(validationResult.error.message);
  },
};

export default AlbumsValidator;
