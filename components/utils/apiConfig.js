import axios from "axios";

const api = env =>
  axios.create({baseURL: env.BASE_API || "http://localhost:3100"});
export default api;
