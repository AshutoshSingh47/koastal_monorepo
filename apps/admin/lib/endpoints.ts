export const endpoints = {
  users: {
    list: "/users", // GET
    create: "/users", // POST
    invite: "/users/invite",
    detail: (id: string) => `/users/${id}`, // GET
    updateStatus: (id: string) => `/users/${id}/status`, //PATCH
    delete: (id: string) => `/users/${id}`, // DELETE
  },
};
