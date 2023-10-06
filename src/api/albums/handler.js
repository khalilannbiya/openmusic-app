import autoBind from "auto-bind";

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
      const response = h.response({
        status: "fail",
        message: error.message,
      });
      response.code(400);
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
      const response = h.response({
        status: "fail",
        message: error.message,
      });
      response.code(404);
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
      const response = h.response({
        status: "fail",
        message: error.message,
      });
      response.code(404);
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
      const response = h.response({
        status: "fail",
        message: error.message,
      });
      response.code(404);
      return response;
    }
  }
}

export default AlbumsHandler;
