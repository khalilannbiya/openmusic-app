import Joi from "joi";

export const PostPlaylistsPayloadSchema = Joi.object({
  name: Joi.string().max(50).required(),
});

export const PostAddSongToPlaylistPayloadSchema = Joi.object({
  songId: Joi.string().max(50).required(),
});
