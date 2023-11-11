import autoBind from "auto-bind";
import ClientError from "../../exceptions/ClientError.js";

class AlbumsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postAlbumHandler(request, h) {
    try {
      this._validator.validateAlbumPayload(request.payload);
      const albumId = await this._service.addAlbum(request.payload);

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

  async getAlbumByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const album = await this._service.getAlbumById(id);

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

  async putAlbumByIdHandler(request, h) {
    try {
      this._validator.validateAlbumPayload(request.payload);

      const { id } = request.params;
      const { name, year } = request.payload;

      await this._service.editAlbumById(id, { name, year });

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

  async deleteAlbumByIdHandler(request, h) {
    try {
      const { id } = request.params;
      await this._service.deleteAlbumById(id);
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

  async postLikeAlbumHandler(request, h) {
    try {
      const { id: credentialId } = request.auth.credentials;
      const { id: albumId } = request.params;

      await this._service.addLikeAlbum(credentialId, albumId);

      const response = h.response({
        status: "success",
        message: "Berhasil menyukai album",
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

  async deleteLikeAlbumHandler(request, h) {
    try {
      const { id: credentialId } = request.auth.credentials;
      const { id: albumId } = request.params;

      await this._service.deleteLikeAlbum(credentialId, albumId);

      return {
        status: "success",
        message: "Batal menyukai album!",
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

  async getLikeAlbumHandler(request, h) {
    try {
      const { id: albumId } = request.params;

      const likes = await this._service.getLikeAlbum(albumId);

      return {
        status: "success",
        data: {
          likes,
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
}

export default AlbumsHandler;
