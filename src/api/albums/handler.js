// import autoBind from "auto-bind";
const autoBind = require("auto-bind");
const ClientError = require("../../exceptions/ClientError");

class AlbumsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  postAlbumHandler(request, h) {
    try {
      this._validator.validateAlbumPayload(request.payload);
      const albumId = this._service.addAlbum(request.payload);

      const response = h.response({
        status: "success",
        data: {
          albumId,
        },
      });

      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: "fail",
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server Error
      const response = h.response({
        status: "Error",
        message: "Maaf, terjadi kegagalan pada server kami!",
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  getAlbumByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const album = this._service.getAlbumById(id);

      return {
        status: "success",
        data: {
          album,
        },
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: "fail",
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server Error
      const response = h.response({
        status: "Error",
        message: "Maaf, terjadi kegagalan pada server kami!",
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  putAlbumByIdHandler(request, h) {
    try {
      this._validator.validateAlbumPayload(request.payload);

      const { id } = request.params;
      const { name, year } = request.payload;

      this._service.editAlbumById(id, { name, year });

      return {
        status: "success",
        message: "Album berhasil diperbarui!",
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: "fail",
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server Error
      const response = h.response({
        status: "Error",
        message: "Maaf, terjadi kegagalan pada server kami!",
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  deleteAlbumByIdHandler(request, h) {
    try {
      const { id } = request.params;
      this._service.deleteAlbumById(id);
      return {
        status: "success",
        message: "Album berhasil dihapus!",
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: "fail",
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server Error
      const response = h.response({
        status: "Error",
        message: "Maaf, terjadi kegagalan pada server kami!",
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
}

// export default AlbumsHandler;
module.exports = AlbumsHandler;
