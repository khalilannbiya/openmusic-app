import path from "path";
// for fixing the issue of __dirname being undefined
import { fileURLToPath } from "url";

// for fixing the issue of __dirname being undefined
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const routes = (handler) => [
  {
    method: "POST",
    path: "/albums/{id}/covers",
    handler: handler.postUploadCoverAlbumHandler,
    options: {
      payload: {
        allow: "multipart/form-data",
        multipart: true,
        output: "stream",
        maxBytes: 512000,
      },
    },
  },
  {
    method: "GET",
    path: "/albums/cover/{param*}",
    handler: {
      directory: {
        path: path.resolve(__dirname, "../../assets/images/album"),
      },
    },
  },
];

export default routes;
