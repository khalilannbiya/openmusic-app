import dotenv from "dotenv";

dotenv.config();

export const mapDBToModel = ({ id, title, year, performer, genre, duration, album_id }) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  albumId: album_id,
});

export const mapDBToModelAlbums = ({ id, name, year, cover_url }) => ({
  id,
  name,
  year,
  coverUrl: cover_url ? `http://${process.env.HOST}:${process.env.PORT}/albums/${id}/covers/${cover_url}` : null,
});
