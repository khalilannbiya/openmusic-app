// import Joi from "joi";
const Joi = require("joi");

// export const SongPayloadSchema = Joi.object({
//   title: Joi.string().required(),
//   year: Joi.number().required(),
//   genre: Joi.string().required(),
//   performer: Joi.string().required(),
//   duration: Joi.number(),
//   albumId: Joi.string(),
// });

// Definisikan skema
const SongPayloadSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().required(),
  genre: Joi.string().required(),
  performer: Joi.string().required(),
  duration: Joi.number(),
  albumId: Joi.string(),
});

// Ekspor skema sebagai modul CommonJS
module.exports = { SongPayloadSchema };
