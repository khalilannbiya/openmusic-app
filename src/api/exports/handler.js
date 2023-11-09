import autoBind from "auto-bind";
import ClientError from "../../exceptions/ClientError.js";

class ExportsHandler {
  constructor(service, validator, playlistsService) {
    this._service = service;
    this._validator = validator;
    this._playlistsService = playlistsService;

    autoBind(this);
  }

  async postExportSongInPlaylistHandler(request, h) {
    try {
      this._validator.validateExportSongInPlaylistPayload(request.payload);

      const { id: credentialId } = request.auth.credentials;
      const { playlistId } = request.params;
      const { targetEmail } = request.payload;

      const message = {
        playlistId,
        targetEmail,
      };

      await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);

      await this._service.sendMessage("export:songs", JSON.stringify(message));

      const response = h.response({
        status: "success",
        message: "Permintaan Anda sedang kami proses",
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
}

export default ExportsHandler;
