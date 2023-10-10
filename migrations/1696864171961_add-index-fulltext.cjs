/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.sql("CREATE INDEX songs_title_performer_search ON songs USING GIN (to_tsvector('indonesian', title || ' ' || performer))");
};

exports.down = (pgm) => {
  pgm.sql("DROP INDEX IF EXISTS songs_title_performer_search");
};
