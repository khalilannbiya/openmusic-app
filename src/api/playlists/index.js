import PlaylistsHandler from "./handler.js";
import routes from "./routes.js";

export default {
  name: "playlists",
  version: "1.0.0",
  register: async (server, { service, validator, songsService }) => {
    const playlistsHandler = new PlaylistsHandler(service, validator, songsService);
    server.route(routes(playlistsHandler));
  },
};
