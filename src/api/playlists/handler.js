import autoBind from "auto-bind";
import ClientError from "../../exceptions/ClientError.js";

class PlaylistsHandler {
  constructor(service, validator, songsService, playlistActivitiesService) {
    this._service = service;
    this._validator = validator;
    this._songsService = songsService;
    this._playlistActivitiesService = playlistActivitiesService;

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
      const { id: credentialId } = request.auth.credentials;

      await this._service.verifyPlaylistOwner(id, credentialId);
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

  async postSongToPlaylistHandler(request, h) {
    try {
      this._validator.validatePostAddSongToPlaylistPayload(request.payload);
      const { id: credentialId } = request.auth.credentials;
      const { id: playlistId } = request.params;

      const { songId } = request.payload;

      await this._service.verifyPlaylistAccess(playlistId, credentialId);

      await this._songsService.verifySongIdValid(songId);

      await this._service.addSongToPlaylist(playlistId, songId);

      await this._playlistActivitiesService.addPlaylistActivities(playlistId, songId, credentialId, "add");

      const response = h.response({
        status: "success",
        message: "Song berhasil ditambahkan",
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

  async getSongsOnPlaylistHandler(request, h) {
    try {
      const { id: credentialId } = request.auth.credentials;

      const { id: playlistId } = request.params;

      await this._service.verifyPlaylistAccess(playlistId, credentialId);

      const playlist = await this._service.getSongsOnPlaylist(playlistId);

      return {
        status: "success",
        data: {
          playlist,
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

  async deleteSongOnPlaylistHandler(request, h) {
    try {
      const { id: credentialId } = request.auth.credentials;

      const { id: playlistId } = request.params;
      const { songId } = request.payload;

      await this._service.verifyPlaylistAccess(playlistId, credentialId);

      await this._service.deleteSongOnPlaylistById(playlistId, songId);

      await this._playlistActivitiesService.addPlaylistActivities(playlistId, songId, credentialId, "delete");

      return {
        status: "success",
        message: "Song berhasil dihapus",
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

  async getPlaylistActivitiesHandler(request, h) {
    try {
      const { id: playlistId } = request.params;
      const { id: credentialId } = request.auth.credentials;

      await this._service.verifyPlaylistAccess(playlistId, credentialId);

      const activities = await this._playlistActivitiesService.getPlaylistActivites(playlistId);

      return {
        status: "success",
        data: {
          playlistId,
          activities,
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
