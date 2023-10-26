import pkg from "pg";
import { nanoid } from "nanoid";
import InvariantError from "../../exceptions/InvariantError.js";
import NotFoundError from "../../exceptions/NotFoundError.js";

const { Pool } = pkg;

class PlaylistActivitiesService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylistActivities(playlistId, songId, userId, action) {
    const id = nanoid(16);
    const time = new Date().toISOString();

    const query = {
      text: "INSERT INTO playlist_song_activities VALUES($1, $2, $3, $4, $5, $6) RETURNING id",
      values: [id, playlistId, songId, userId, action, time],
    };

    const { rows } = await this._pool.query(query);

    if (!rows.length) throw new InvariantError("Request tidak valid");
  }

  async getPlaylistActivites(playlistId) {
    const query = {
      text: "SELECT users.username, songs.title, playlist_song_activities.action, playlist_song_activities.time FROM playlist_song_activities LEFT JOIN users ON users.id = playlist_song_activities.user_id LEFT JOIN songs ON songs.id = playlist_song_activities.song_id WHERE playlist_song_activities.playlist_id = $1",
      values: [playlistId],
    };

    const { rows } = await this._pool.query(query);

    if (!rows.length) throw new NotFoundError("Id playlist tida ditemukan!");

    return rows;
  }
}

export default PlaylistActivitiesService;
