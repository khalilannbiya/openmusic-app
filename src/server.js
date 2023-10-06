import Hapi from "@hapi/hapi";
import albums from "./api/albums/index.js";
import songs from "./api/songs/index.js";
import AlbumsService from "./services/inMemory/AlbumsService.js";
import SongsService from "./services/inMemory/SongsService.js";

const init = async () => {
  const albumsService = new AlbumsService();
  const songsService = new SongsService();

  const server = Hapi.server({
    port: 5000,
    host: "localhost",
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
      },
    },
    {
      plugin: songs,
      options: {
        service: songsService,
      },
    },
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
