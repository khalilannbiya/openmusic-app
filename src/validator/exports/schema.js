import Joi from "joi";

const ExportSongInPlaylistPayloadSchema = Joi.object({
  targetEmail: Joi.string().email({ tlds: true }).required(),
});

export default ExportSongInPlaylistPayloadSchema;
