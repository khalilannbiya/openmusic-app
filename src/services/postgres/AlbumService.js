const { Pool } = require("pg");
const InvariantError = require("../../exceptions/InvariantError.js");
const NotFoundError = require("../../exceptions/NotFoundError.js");

class AlbumService {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbum({ name, year }) {
    const id = `album-${nanoid(16)}`;

    const query = {
      text: "INSERT INTO albums VALUES($1, $2, $3) RETURNING id",
      values: [id, name, year],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) throw new InvariantError("Album gagal ditambahkan!");

    return result.rows[0].id;
  }

  async getAlbumById(id) {
    const query = {
      text: "SELECT * FROM albums WHERE id = $1",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) throw new NotFoundError("Album tidak ditemukan!");

    return result.rows[0];
  }

  async editAlbumById(id, { name, year }) {
    const query = {
      text: "UPDATE albums SET name = $2, year = $3 WHERE id = $1 RETURNING id",
      value: [id, name, year],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) throw new NotFoundError("Gagal memperbarui album. ID tidak ditemukan");
  }
}
