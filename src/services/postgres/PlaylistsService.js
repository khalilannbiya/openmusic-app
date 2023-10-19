import pkg from "pg";
import { nanoid } from "nanoid";
import InvariantError from "../../exceptions/InvariantError.js";

const { Pool } = pkg;

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylist(owner, { name }) {
    const id = `playlist-${nanoid(16)}`;

    const query = {
      text: "INSERT INTO playlists VALUES($1, $2, $3) RETURNING id",
      values: [id, owner, name],
    };

    const { rows } = await this._pool.query(query);

    if (!rows[0].id) throw new InvariantError("Playlist gagal ditambahkan!");

    return rows[0].id;
  }

  async getPlaylists(owner) {
    const query = {
      text: "SELECT playlists.id, playlists.name, users.username FROM playlists LEFT JOIN users ON playlists.owner = users.id WHERE playlists.owner = $1",
      values: [owner],
    };
    const { rows } = await this._pool.query(query);
    return rows;
  }

  // TODO: aktifkan ketika ingin digunakan untuk verifikasi owner
  // async verifyPlaylistOwner(id, owner) {
  //   const query = {
  //     text: "SELECT * FROM playlists WHERE id = $1",
  //     values: [id],
  //   };

  //   const { rows } = await this._pool.query(query);
  //   if (!rows.length) throw new NotFoundError("Playlist tidak ditemukan");

  //   const playlist = rows[0];
  //   if (playlist.owner !== owner) throw new AuthorizationError("Anda tidak berhak mengakses resource ini");
  // }
}

export default PlaylistsService;
