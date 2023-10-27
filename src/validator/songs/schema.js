import Joi from "joi";

export const SongPayloadSchema = Joi.object({
  title: Joi.string().max(100).required(),
  year: Joi.number().required(),
  genre: Joi.string().max(100).required(),
  performer: Joi.string().max(100).required(),
  duration: Joi.number(),
  albumId: Joi.string().max(50),
});
