import SongsHandler from "./handler.js";
import routes from "./routes.js";

export default {
  name: "songs",
  version: "1.0.0",
  register: async (server, { service }) => {
    const songsHandler = new SongsHandler(service);
    server.route(routes(songsHandler));
  },
};
