import pkg from "pg";
import InvariantError from "../../exceptions/InvariantError.js";

const { Pool } = pkg;

class AuthenticationsService {
  constructor() {
    this._pool = new Pool();
  }

  async addRefreshToken(token) {
    const query = {
      text: "INSERT INTO authentications VALUES($1)",
      values: [token],
    };

    await this._pool.query(query);
  }

  async verifyRefreshToken(token) {
    const query = {
      text: "SELECT token FROM authentications WHERE token = $1",
      values: [token],
    };

    const { rows } = await this._pool.query(query);

    if (!rows.length) throw new InvariantError("Refresh token tidak valid");
  }

  async deleteRefreshToken(token) {
    const query = {
      text: "DELETE FROM authentications WHERE token = $1",
      values: [token],
    };

    await this._pool.query(query);
  }
}

export default AuthenticationsService;