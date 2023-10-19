import autoBind from "auto-bind";
import ClientError from "../../exceptions/ClientError.js";

class PlaylistsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postPlaylistHandler(request, h) {
    try {
      this._validator.validatePostPlaylistsPayload(request.payload);

      const { id: credentialId } = request.auth.credentials;

      const playlistId = await this._service.addPlaylist(credentialId, request.payload);

      const response = h.response({
        status: "success",
        data: {
          playlistId,
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

  async getPlaylistsHandler(request, h) {
    try {
      const { id: credentialId } = request.auth.credentials;

      const playlists = await this._service.getPlaylists(credentialId);
      return {
        status: "success",
        data: {
          playlists,
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

  async deletePlaylistByIdHandler(request, h) {
    try {
      const { id } = request.params;

      await this._service.deletePlaylistById(id);

      return {
        status: "success",
        message: "Playlist berhasil dihapus",
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

      // Server ERROR!
      const response = h.response({
        status: "error",
        message: "Maaf, terjadi kegagalan pada server kami.",
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
}

export default PlaylistsHandler;
