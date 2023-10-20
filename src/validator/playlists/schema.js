import Joi from "joi";

export const PostPlaylistsPayloadSchema = Joi.object({
  name: Joi.string().required(),
});

export const PostAddSongToPlaylistPayloadSchema = Joi.object({
  songId: Joi.string().required(),
});
