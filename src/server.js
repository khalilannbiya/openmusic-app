import dotenv from "dotenv";

import Hapi from "@hapi/hapi";

import songs from "./api/songs/index.js";
import SongsService from "./services/postgres/SongsService.js";
import SongsValidator from "./validator/songs/index.js";

import albums from "./api/albums/index.js";
import AlbumsService from "./services/postgres/AlbumsService.js";
import AlbumsValidator from "./validator/albums/index.js";

import users from "./api/users/index.js";
import UsersService from "./services/postgres/UsersService.js";
import UsersValidator from "./validator/users/index.js";

dotenv.config();

const init = async () => {
  const albumsService = new AlbumsService();
  const songsService = new SongsService();
  const usersService = new UsersService();

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
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
