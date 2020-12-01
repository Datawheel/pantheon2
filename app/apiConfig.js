import axios from "axios";

const api = env => axios.create({baseURL: env.CANON_API || "http://localhost:3100"});
export default api;
