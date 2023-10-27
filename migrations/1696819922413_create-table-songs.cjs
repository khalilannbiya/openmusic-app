exports.up = (pgm) => {
  pgm.createTable("songs", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    title: {
      type: "VARCHAR(100)",
      notNull: true,
    },
    year: {
      type: "INTEGER",
      notNull: true,
    },
    performer: {
      type: "VARCHAR(100)",
      notNull: true,
    },
    genre: {
      type: "VARCHAR(100)",
      notNull: true,
    },
    duration: {
      type: "INTEGER",
      notNull: false,
    },
    album_id: {
      type: "VARCHAR(50)",
      notNull: false,
      references: '"albums"',
      onDelete: "cascade",
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("songs");
};
