import { SongPayloadSchema } from "./schema.js";

const SongsValidator = {
  validateSongPayload: (payload) => {
    const validationResult = SongPayloadSchema.validate(payload);

    if (validationResult.error) throw new Error(validationResult.error.message);
  },
};

export default SongsValidator;
