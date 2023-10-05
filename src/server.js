import Hapi from "@hapi/hapi";
import albums from "./api/albums/index.js";
import AlbumsService from "./services/inMemory/AlbumsService.js";

const init = async () => {
  const albumsService = new AlbumsService();

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
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
