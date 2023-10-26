import PlaylistsHandler from "./handler.js";
import routes from "./routes.js";

export default {
  name: "playlists",
  version: "1.0.0",
  register: async (server, { service, validator, songsService, playlistActivitiesService }) => {
    const playlistsHandler = new PlaylistsHandler(service, validator, songsService, playlistActivitiesService);
    server.route(routes(playlistsHandler));
  },
};
