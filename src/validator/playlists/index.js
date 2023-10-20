import InvariantError from "../../exceptions/InvariantError.js";
import { PostPlaylistsPayloadSchema, PostAddSongToPlaylistPayloadSchema } from "./schema.js";

const PlaylistsValidator = {
  validatePostPlaylistsPayload: (payload) => {
    const validationResult = PostPlaylistsPayloadSchema.validate(payload);

    if (validationResult.error) throw new InvariantError(validationResult.error.message);
  },
  validatePostAddSongToPlaylistPayload: (payload) => {
    const validationResult = PostAddSongToPlaylistPayloadSchema.validate(payload);

    if (validationResult.error) throw new InvariantError(validationResult.error.message);
  },
};

export default PlaylistsValidator;
