// src/api/customerService.js
import api from "./api";

const customerService = {
  getAll: () => {
    return api.get("/customers");
  },
  getById: (id) => {
    return api.get(`/customers/${id}`);
  },
  create: (data) => {
    // data debe ser { Name, Email }
    return api.post("/customers", data);
  },
  update: (id, data) => {
    // data debe ser { Name, Email }
    return api.put(`/customers/${id}`, data);
  },
  softDelete: (id) => {
    return api.delete(`/customers/${id}`);
  },
};

export default customerService;
