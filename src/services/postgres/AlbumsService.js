import pkg from "pg";
import { nanoid } from "nanoid";
import { mapDBToModelAlbums } from "../../utils/index.js";
import InvariantError from "../../exceptions/InvariantError.js";
import NotFoundError from "../../exceptions/NotFoundError.js";

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

    const { rows } = await this._pool.query(query);

    if (!rows[0].id) throw new InvariantError("Album gagal ditambahkan!");

    return rows[0].id;
  }

  async getAlbumById(id) {
    const queryJoin = {
      text: "SELECT songs.id, songs.title, songs.performer FROM albums JOIN songs ON albums.id = songs.album_id WHERE albums.id = $1",
      values: [id],
    };

    const queryAlbum = {
      text: "SELECT id, name, cover_url FROM albums WHERE id = $1",
      values: [id],
    };

    const [{ rows: resultJoin }, { rows: resultAlbum }] = await Promise.all([this._pool.query(queryJoin), this._pool.query(queryAlbum)]);

    if (!resultAlbum.length) throw new NotFoundError("Album tidak ditemukan!");

    return {
      ...mapDBToModelAlbums(resultAlbum[0]),
      songs: resultJoin,
    };
  }

  async editAlbumById(id, { name, year }) {
    const query = {
      text: "UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id",
      values: [name, year, id],
    };

    const { rows } = await this._pool.query(query);

    if (!rows.length) throw new NotFoundError("Gagal memperbarui album. ID tidak ditemukan");
  }

  async deleteAlbumById(id) {
    const query = {
      text: "DELETE FROM albums WHERE id = $1 RETURNING id",
      values: [id],
    };

    const { rows } = await this._pool.query(query);

    if (!rows.length) throw new NotFoundError("Album gagal dihapus. ID tidak ditemukan");
  }

  async addCoverAlbumById(albumId, filename) {
    const query = {
      text: "UPDATE albums SET cover_url = $1 WHERE id = $2 RETURNING id",
      values: [filename, albumId],
    };

    const { rows } = await this._pool.query(query);

    if (!rows[0].id) throw new InvariantError("Cover album gagal diunggah!");
  }
}

export default AlbumsService;
