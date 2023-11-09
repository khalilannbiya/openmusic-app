const routes = (handler) => [
  {
    method: "POST",
    path: "/export/playlists/{playlistId}",
    handler: handler.postExportSongInPlaylistHandler,
    options: {
      auth: "openmusicapp_jwt",
    },
  },
];

export default routes;
