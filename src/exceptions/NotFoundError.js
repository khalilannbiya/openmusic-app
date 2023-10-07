import ClientError from "./ClientError.js";

class NotFoundeError extends ClientError {
  constructor(message) {
    super(message, 404);

    this.name = "NotFoundError";
  }
}

export default NotFoundeError;
