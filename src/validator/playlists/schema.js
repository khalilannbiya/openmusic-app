import Joi from "joi";

export const PostPlaylistsPayloadSchema = Joi.object({
  name: Joi.string().required(),
});

export const PostAddSongPayloadSchema = Joi.object({
  songId: Joi.string().required(),
});
