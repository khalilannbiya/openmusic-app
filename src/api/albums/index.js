import AlbumsHandler from "./handler.js";
import routes from "./routes.js";

export default {
  name: "albums",
  version: "1.0.0",
  register: async (server, { service }) => {
    const albumsHandler = new AlbumsHandler(service);
    server.route(routes(albumsHandler));
  },
};
