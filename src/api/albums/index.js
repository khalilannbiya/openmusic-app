// import AlbumsHandler from "./handler.js";
// import routes from "./routes.js";
const AlbumsHandler = require("./handler.js");
const routes = require("./routes.js");

// export default {
//   name: "albums",
//   version: "1.0.0",
//   register: async (server, { service, validator }) => {
//     const albumsHandler = new AlbumsHandler(service, validator);
//     server.route(routes(albumsHandler));
//   },
// };
module.exports = {
  name: "albums",
  version: "1.0.0",
  register: async (server, { service, validator }) => {
    const albumsHandler = new AlbumsHandler(service, validator);
    server.route(routes(albumsHandler));
  },
};
