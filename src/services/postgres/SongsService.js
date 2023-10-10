import pkg from "pg";
const { Pool } = pkg;

import { nanoid } from "nanoid";
import InvariantError from "../../exceptions/InvariantError.js";
import NotFoundError from "../../exceptions/NotFoundError.js";
import { mapDBToModel } from "../../utils/index.js";

class SongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({ title, year, genre, performer, duration = null, albumId = null }) {
    const id = `song-${nanoid(16)}`;

    const query = {
      text: "INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id",
      values: [id, title, year, performer, genre, duration, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) throw new InvariantError("Song gagal ditambahkan!");

    return result.rows[0].id;
  }

  async getSongs({ title, performer }) {
    // Membuat query SQL untuk pencarian Full Text
    let query = "SELECT * FROM songs WHERE 1=1";

    const values = [];

    if (title) {
      query += " AND to_tsvector('english', title || ' ' || performer) @@ to_tsquery('english', $1)";
      values.push(title);
    }

    if (performer && title) {
      query += " AND to_tsvector('english', title || ' ' || performer) @@ to_tsquery('english', $2)";
      values.push(performer);
    } else if (performer && !title) {
      query += " AND to_tsvector('english', title || ' ' || performer) @@ to_tsquery('english', $1)";
      values.push(performer);
    }

    const result = await this._pool.query(query, values);

    return result.rows;
  }

  async getSongById(id) {
    const query = {
      text: "SELECT * FROM songs WHERE id = $1",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) throw new NotFoundError("Song tidak ditemukan!");

    return mapDBToModel(result.rows[0]);
  }

  async editSongById(id, { title, year, genre, performer, duration = null, albumId = null }) {
    const query = {
      text: "UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, album_id = $6 WHERE id = $7 RETURNING id",
      values: [title, year, genre, performer, duration, albumId, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) throw new NotFoundError("Gagal memperbarui song. ID tidak ditemukan");
  }

  async deleteSongById(id) {
    const query = {
      text: "DELETE FROM songs WHERE id = $1 RETURNING id",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) throw new NotFoundError("Song gagal dihapus. ID tidak ditemukan");
  }
}

export default SongsService;
