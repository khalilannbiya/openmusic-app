import pkg from "pg";
import { nanoid } from "nanoid";
import InvariantError from "../../exceptions/InvariantError.js";

const { Pool } = pkg;

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylist(credentialId, { name }) {
    const id = `playlist-${nanoid(16)}`;

    const query = {
      text: "INSERT INTO playlists VALUES($1, $2, $3) RETURNING id",
      values: [id, credentialId, name],
    };

    const { rows } = await this._pool.query(query);

    if (!rows[0].id) throw new InvariantError("Playlist gagal ditambahkan!");

    return rows[0].id;
  }
}

export default PlaylistsService;
