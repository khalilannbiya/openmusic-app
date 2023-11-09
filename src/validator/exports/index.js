import InvariantError from "../../exceptions/InvariantError.js";
import ExportSongInPlaylistPayloadSchema from "./schema.js";

const ExportsValidator = {
  validateExportSongInPlaylistPayload: (payload) => {
    const validationResult = ExportSongInPlaylistPayloadSchema.validate(payload);

    if (validationResult.error) throw new InvariantError(validationResult.error.message);
  },
};

export default ExportsValidator;
