import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:44397/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
// api.js
