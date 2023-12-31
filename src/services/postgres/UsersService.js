import pkg from "pg";
import { nanoid } from "nanoid";
import bcrypt from "bcrypt";

import InvariantError from "../../exceptions/InvariantError.js";
import AuthenticationError from "../../exceptions/AuthenticationError.js";
import NotFoundError from "../../exceptions/NotFoundError.js";

const { Pool } = pkg;

class UsersService {
  constructor() {
    this._pool = new Pool();
  }

  async addUser({ username, password, fullname }) {
    const id = `user-${nanoid(16)}`;

    // Verifikasi username
    await this.verifyNewUsername(username);

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = {
      text: "INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id",
      values: [id, username, hashedPassword, fullname],
    };

    const { rows } = await this._pool.query(query);

    if (!rows[0].id) throw new InvariantError("User gagal ditambahkan");

    return rows[0].id;
  }

  async verifyNewUsername(username) {
    const query = {
      text: "SELECT username FROM users WHERE username = $1",
      values: [username],
    };

    const { rows } = await this._pool.query(query);

    if (rows.length > 0) throw new InvariantError("Gagal menambahkan user. Username sudah digunakan");
  }

  async verifyUserCredential(username, password) {
    const query = {
      text: "SELECT id, password FROM users WHERE username = $1",
      values: [username],
    };

    const { rows } = await this._pool.query(query);

    if (!rows.length) throw new AuthenticationError("Kredensial yang Anda berikan salah");

    const { id, password: hashedPassword } = rows[0];

    const match = await bcrypt.compare(password, hashedPassword);

    if (!match) throw new AuthenticationError("Kredensial yang Anda berikan salah");

    return id;
  }

  async getUserById(userId) {
    const query = {
      text: "SELECT id, username, fullname FROM users WHERE id = $1",
      values: [userId],
    };

    const { rows } = await this._pool.query(query);

    if (!rows.length) throw new NotFoundError("User tidak ditemukan");

    return rows[0];
  }
}

export default UsersService;
