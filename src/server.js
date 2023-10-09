const dotenv = require("dotenv");
dotenv.config();

const Hapi = require("@hapi/hapi");

const albums = require("./api/albums/index.js");
const songs = require("./api/songs/index.js");
const AlbumsService = require("./services/postgres/AlbumService.js");
const SongsService = require("./services/inMemory/SongsService.js");
const AlbumsValidator = require("./validator/albums/index.js");
const SongsValidator = require("./validator/songs/index.js");

const init = async () => {
  const albumsService = new AlbumsService();
  const songsService = new SongsService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  await server.register([
    {
      plugin: albums,
      options: {
        service: albumsService,
        validator: AlbumsValidator,
      },
    },
    {
      plugin: songs,
      options: {
        service: songsService,
        validator: SongsValidator,
      },
    },
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
