exports.up = (pgm) => {
  pgm.addColumns("albums", {
    cover_url: {
      type: "VARCHAR(50)",
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumns("albums", "cover_url");
};
