import { nanoid } from "nanoid";

class AlbumsService {
  constructor() {
    this._albums = [];
  }

  addAlbum({ name, year }) {
    const id = `album-${nanoid(16)}`;

    const newNote = {
      id,
      name,
      year,
    };

    this._albums.push(newNote);

    const isSuccess = this._albums.filter((album) => album.id === id).length > 0;

    if (!isSuccess) throw new Error("Album gagal ditambahkan!");

    return id;
  }

  getAlbumById(id) {
    const album = this._albums.filter((a) => a.id === id)[0];

    if (!album) throw new Error("Album tidak ditemukan!");

    return album;
  }

  editAlbumById(id, { name, year }) {
    const index = this._albums.findIndex((album) => album.id === id);

    if (index === -1) throw new Error("Gagal memperbarui album. ID tidak ditemukan");

    this._albums[index] = {
      ...this._albums[index],
      name,
      year,
    };
  }

  deleteAlbumById(id) {
    const index = this._albums.findIndex((album) => album.id === id);
    if (index === -1) throw new Error("Album gagal dihapus. ID tidak ditemukan");

    this._albums.splice(index, 1);
  }
}

export default AlbumsService;