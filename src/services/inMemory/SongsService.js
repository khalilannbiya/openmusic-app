// import { nanoid } from "nanoid";
// import InvariantError from "../../exceptions/InvariantError.js";
// import NotFoundError from "../../exceptions/NotFoundError.js";
const { nanoid } = require("nanoid");
const InvariantError = require("../../exceptions/InvariantError.js");
const NotFoundError = require("../../exceptions/NotFoundError.js");

class SongsService {
  constructor() {
    this._songs = [];
  }

  addSong({ title, year, genre, performer, duration = null, albumId = null }) {
    const id = `song-${nanoid(16)}`;

    const newSong = {
      id,
      title,
      year,
      genre,
      performer,
      duration,
      albumId,
    };

    this._songs.push(newSong);

    const isSuccess = this._songs.filter((song) => song.id === id).length > 0;

    if (!isSuccess) throw new InvariantError("Song gagal ditambahkan!");

    return id;
  }

  getSongs() {
    return this._songs;
  }

  getSongById(id) {
    const song = this._songs.filter((s) => s.id === id)[0];

    if (!song) throw new NotFoundError("Song tidak ditemukan!");

    return song;
  }

  editSongById(id, { title, year, genre, performer, duration = null, albumId = null }) {
    const index = this._songs.findIndex((song) => song.id === id);

    if (index === -1) throw new NotFoundError("Gagal memperbarui song. ID tidak ditemukan");

    this._songs[index] = {
      ...this._songs[index],
      title,
      year,
      genre,
      performer,
      duration,
      albumId,
    };
  }

  deleteSongById(id) {
    const index = this._songs.findIndex((song) => song.id === id);
    if (index === -1) throw new NotFoundError("Song gagal dihapus. ID tidak ditemukan");

    this._songs.splice(index, 1);
  }
}

// export default SongsService;
module.exports = SongsService;
