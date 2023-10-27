import Joi from "joi";

export const AlbumPayloadSchema = Joi.object({
  name: Joi.string().max(50).required(),
  year: Joi.number().required(),
});
