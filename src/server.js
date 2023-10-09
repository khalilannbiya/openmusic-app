// import dotenv from "dotenv";
// dotenv.config();

// import Hapi from "@hapi/hapi";
// import albums from "./api/albums/index.js";
// import songs from "./api/songs/index.js";
// import AlbumsService from "./services/inMemory/AlbumsService.js";
// import SongsService from "./services/inMemory/SongsService.js";
// import AlbumsValidator from "./validator/albums/index.js";
// import SongsValidator from "./validator/songs/index.js";

const dotenv = require("dotenv");
dotenv.config();

const Hapi = require("@hapi/hapi");

const albums = require("./api/albums/index.js");
const songs = require("./api/songs/index.js");
const AlbumsService = require("./services/inMemory/AlbumsService.js");
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
