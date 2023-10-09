// import ClientError from "./ClientError.js";
const ClientError = require("./ClientError.js");

class InvariantError extends ClientError {
  constructor(message) {
    super(message);

    this.name = "InvariantError";
  }
}

// export default InvariantError;
module.exports = InvariantError;
