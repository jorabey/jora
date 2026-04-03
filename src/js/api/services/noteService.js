// api/services/noteService.js
import { apiClient } from "../client.js";

export const noteService = {
  getAll: () => apiClient.get("/notes"),
  create: (data) => apiClient.post("/notes", data),
  delete: (id) => apiClient.delete(`/notes/${id}`),
};
