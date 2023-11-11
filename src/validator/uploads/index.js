import InvariantError from "../../exceptions/InvariantError.js";
import { ImageHeadersSchema } from "./schema.js";

const UploadsValidator = {
  validateImageHeaders: (payload) => {
    const validationResult = ImageHeadersSchema.validate(payload);

    if (validationResult.error) throw new InvariantError(validationResult.error.message);
  },
};

export default UploadsValidator;
