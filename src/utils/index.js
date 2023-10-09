export const mapDBToModel = ({ id, title, year, performer, genre, duration, album_id }) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  albumId: album_id,
});

export const simpleResponseSong = ({ id, title, performer }) => ({
  id,
  title,
  performer,
});
