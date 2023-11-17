import pkg from "pg";
import { nanoid } from "nanoid";
import InvariantError from "../../exceptions/InvariantError.js";
import NotFoundError from "../../exceptions/NotFoundError.js";
import AuthorizationError from "../../exceptions/AuthorizationError.js";

const { Pool } = pkg;

class PlaylistsService {
  constructor(collaborationsService, cacheService) {
    this._pool = new Pool();
    this._collaborationsService = collaborationsService;
    this._cacheService = cacheService;
  }

  async addPlaylist(owner, { name }) {
    const id = `playlist-${nanoid(16)}`;

    const query = {
      text: "INSERT INTO playlists VALUES($1, $2, $3) RETURNING id",
      values: [id, owner, name],
    };

    const { rows } = await this._pool.query(query);

    if (!rows[0].id) throw new InvariantError("Playlist gagal ditambahkan!");

    await this._cacheService.delete(`playlists:${owner}`);

    return rows[0].id;
  }

  async getPlaylists(owner) {
    try {
      const result = await this._cacheService.get(`playlists:${owner}`);
      return {
        playlists: JSON.parse(result),
        isCache: true,
      };
    } catch (error) {
      const query = {
        text: "SELECT playlists.id, playlists.name, users.username FROM playlists LEFT JOIN users ON playlists.owner = users.id LEFT JOIN collaborations ON collaborations.playlist_id = playlists.id WHERE playlists.owner = $1 OR collaborations.user_id = $1",
        values: [owner],
      };
      const { rows } = await this._pool.query(query);

      await this._cacheService.set(`playlists:${owner}`, JSON.stringify(rows));

      return {
        playlists: rows,
        isCache: false,
      };
    }
  }

  async deletePlaylistById(id) {
    const query = {
      text: "DELETE FROM playlists WHERE id = $1 RETURNING id, owner",
      values: [id],
    };

    const { rows } = await this._pool.query(query);

    if (!rows.length) throw new NotFoundError("Playlist gagal dihapus. Id tidak ditemukan");

    const { owner } = rows[0];
    await this._cacheService.delete(`playlists:${owner}`);
  }

  async addSongToPlaylist(playlistId, songId) {
    const id = nanoid(16);

    const query = {
      text: "INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id",
      values: [id, playlistId, songId],
    };

    const { rows } = await this._pool.query(query);

    if (!rows[0].id) throw new InvariantError("Song gagal ditambahkan!");
  }

  async getSongsOnPlaylist(id) {
    const queryPlaylist = {
      text: "SELECT playlists.id, playlists.name, users.username FROM playlists INNER JOIN users ON playlists.owner = users.id WHERE playlists.id = $1",
      values: [id],
    };

    const querySongs = {
      text: "SELECT songs.id, songs.title, songs.performer FROM songs INNER JOIN playlist_songs ON songs.id = playlist_songs.song_id WHERE playlist_songs.playlist_id = $1",
      values: [id],
    };

    const [{ rows: songs }, { rows: playlist }] = await Promise.all([this._pool.query(querySongs), this._pool.query(queryPlaylist)]);

    if (!playlist.length) throw new NotFoundError("Playlist tidak ditemukan!");

    return {
      ...playlist[0],
      songs,
    };
  }

  async deleteSongOnPlaylistById(playlistId, songId) {
    const query = {
      text: "DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id ",
      values: [playlistId, songId],
    };

    const { rows } = await this._pool.query(query);

    if (!rows.length) throw new InvariantError("Song gagal dihapus. permintaan tidak valid");
  }

  async verifyPlaylistOwner(id, owner) {
    const query = {
      text: "SELECT * FROM playlists WHERE id = $1",
      values: [id],
    };

    const { rows } = await this._pool.query(query);
    if (!rows.length) throw new NotFoundError("Playlist tidak ditemukan");

    const playlist = rows[0];
    if (playlist.owner !== owner) throw new AuthorizationError("Anda tidak berhak mengakses resource ini");
  }

  async verifyPlaylistAccess(playlistId, userId) {
    try {
      await this.verifyPlaylistOwner(playlistId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }

      try {
        await this._collaborationsService.verifyCollaborator(playlistId, userId);
      } catch {
        throw error;
      }
    }
  }
}

export default PlaylistsService;
