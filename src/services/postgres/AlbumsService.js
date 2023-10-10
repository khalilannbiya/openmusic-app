import pkg from "pg";
import { nanoid } from "nanoid";
import InvariantError from "../../exceptions/InvariantError.js";
import NotFoundError from "../../exceptions/NotFoundError.js";
import { simpleResponseSong } from "../../utils/index.js";

const { Pool } = pkg;

class AlbumsService {
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
    const queryJoin = {
      text: "SELECT * FROM albums JOIN songs ON albums.id = songs.album_id WHERE albums.id = $1",
      values: [id],
    };

    const queryAlbum = {
      text: "SELECT * FROM albums WHERE id = $1",
      values: [id],
    };

    const [resultJoin, resultAlbum] = await Promise.all([this._pool.query(queryJoin), this._pool.query(queryAlbum)]);

    if (!resultAlbum.rows.length) throw new NotFoundError("Album tidak ditemukan!");

    return {
      ...resultAlbum.rows[0],
      songs: resultJoin.rows.map(simpleResponseSong),
    };
  }

  async editAlbumById(id, { name, year }) {
    const query = {
      text: "UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id",
      values: [name, year, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) throw new NotFoundError("Gagal memperbarui album. ID tidak ditemukan");
  }

  async deleteAlbumById(id) {
    const query = {
      text: "DELETE FROM albums WHERE id = $1 RETURNING id",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) throw new NotFoundError("Album gagal dihapus. ID tidak ditemukan");
  }
}

export default AlbumsService;
