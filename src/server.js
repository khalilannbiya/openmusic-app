import dotenv from "dotenv";

import Hapi from "@hapi/hapi";
import Jwt from "@hapi/jwt";
import path from "path";
import Inert from "@hapi/inert";

// for fixing the issue of __dirname being undefined
import { fileURLToPath } from "url";

import songs from "./api/songs/index.js";
import SongsService from "./services/postgres/SongsService.js";
import SongsValidator from "./validator/songs/index.js";

import albums from "./api/albums/index.js";
import AlbumsService from "./services/postgres/AlbumsService.js";
import AlbumsValidator from "./validator/albums/index.js";

import users from "./api/users/index.js";
import UsersService from "./services/postgres/UsersService.js";
import UsersValidator from "./validator/users/index.js";

import authentications from "./api/authentications/index.js";
import AuthenticationsService from "./services/postgres/AuthenticationsService.js";
import TokenManager from "./tokenize/TokenManager.js";
import AuthenticationsValidator from "./validator/authentications/index.js";

import playlists from "./api/playlists/index.js";
import PlaylistsValidator from "./validator/playlists/index.js";
import PlaylistsService from "./services/postgres/PlaylistsService.js";

import collaborations from "./api/collaborations/index.js";
import CollaborationsValidator from "./validator/collaborations/index.js";
import CollaborationsService from "./services/postgres/CollaborationsService.js";

import PlaylistActivitiesService from "./services/postgres/PlaylistActivitiesService.js";

import _exports from "./api/exports/index.js";
import ProducerService from "./services/rabbitmq/ProducerService.js";
import ExportsValidator from "./validator/exports/index.js";

import uploads from "./api/uploads/index.js";
import StorageService from "./services/storage/StorageService.js";
import UploadsValidator from "./validator/uploads/index.js";

import CacheService from "./services/redis/CacheService.js";

dotenv.config();

const init = async () => {
  // for fixing the issue of __dirname being undefined
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const cacheService = new CacheService();
  const albumsService = new AlbumsService(cacheService);
  const songsService = new SongsService();
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const collaborationsService = new CollaborationsService(cacheService);
  const playlistsService = new PlaylistsService(collaborationsService, cacheService);
  const playlistActivitiesService = new PlaylistActivitiesService();
  const storageService = new StorageService(path.resolve(__dirname, "assets/images/album"));

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
      plugin: Jwt,
    },
    {
      plugin: Inert,
    },
  ]);

  // strategy autentikasi jwt
  server.auth.strategy("openmusicapp_jwt", "jwt", {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
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
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: playlists,
      options: {
        service: playlistsService,
        validator: PlaylistsValidator,
        songsService,
        playlistActivitiesService,
      },
    },
    {
      plugin: collaborations,
      options: {
        collaborationsService,
        playlistsService,
        usersService,
        validator: CollaborationsValidator,
      },
    },
    {
      plugin: _exports,
      options: {
        service: ProducerService,
        validator: ExportsValidator,
        playlistsService,
      },
    },
    {
      plugin: uploads,
      options: {
        service: storageService,
        validator: UploadsValidator,
        albumsService,
      },
    },
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
