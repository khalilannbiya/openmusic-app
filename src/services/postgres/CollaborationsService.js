import pkg from "pg";
import { nanoid } from "nanoid";
import InvariantError from "../../exceptions/InvariantError.js";

const { Pool } = pkg;

class CollaborationsService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addCollaboration(playlistId, userId) {
    const id = `collab-${nanoid(16)}`;

    const query = {
      text: "INSERT INTO collaborations VALUES($1, $2, $3) RETURNING id",
      values: [id, userId, playlistId],
    };

    const { rows } = await this._pool.query(query);

    if (!rows.length) throw new InvariantError("Kolaborasi gagal ditambahkan");

    await this._cacheService.delete(`playlists:${userId}`);

    return rows[0].id;
  }

  async deleteCollaboration(playlistId, userId) {
    const query = {
      text: "DELETE FROM collaborations WHERE playlist_id = $1 AND user_id = $2 RETURNING id",
      values: [playlistId, userId],
    };

    const { rows } = await this._pool.query(query);

    if (!rows.length) throw new InvariantError("Kolaborasi gagal dihapus");

    await this._cacheService.delete(`playlists:${userId}`);
  }

  async verifyCollaborator(playlistId, userId) {
    const query = {
      text: "SELECT * FROM collaborations WHERE playlist_id = $1 AND user_id = $2",
      values: [playlistId, userId],
    };
    const { rows } = await this._pool.query(query);

    if (!rows.length) throw new InvariantError("Kolaborasi gagal diverifikasi");
  }
}
export default CollaborationsService;
