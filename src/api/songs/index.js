// import SongsHandler from "./handler.js";
// import routes from "./routes.js";
const SongsHandler = require("./handler.js");
const routes = require("./routes.js");

// export default {
//   name: "songs",
//   version: "1.0.0",
//   register: async (server, { service, validator }) => {
//     const songsHandler = new SongsHandler(service, validator);
//     server.route(routes(songsHandler));
//   },
// };
module.exports = {
  name: "songs",
  version: "1.0.0",
  register: async (server, { service, validator }) => {
    const songsHandler = new SongsHandler(service, validator);
    server.route(routes(songsHandler));
  },
};
