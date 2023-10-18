const routes = (handler) => [
  {
    method: "GET",
    path: "/users",
    handler: handler.postUserHandler,
  },
  // {
  //   method: "GET",
  //   path: "/users/{id}",
  //   handler: handler.getUserByIdHandler,
  // },
];

export default routes;
