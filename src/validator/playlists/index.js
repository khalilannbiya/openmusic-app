import InvariantError from "../../exceptions/InvariantError.js";
import { PostPlaylistsPayloadSchema, PostAddSongPayloadSchema } from "./schema.js";

const PlaylistsValidator = {
  validatePostPlaylistsPayload: (payload) => {
    const validationResult = PostPlaylistsPayloadSchema.validate(payload);

    if (validationResult.error) throw new InvariantError(validationResult.error.message);
  },
  validatePostAddSongPayload: (payload) => {
    const validationResult = PostAddSongPayloadSchema.validate(payload);

    if (validationResult.error) throw new InvariantError(validationResult.error.message);
  },
};

export default PlaylistsValidator;
