import axios from "axios";

const clientConfig = {
  host: process.env.HOSTNAME || "localhost",
  port: process.env.PORT || "3100"
};

let baseURL = `http://${clientConfig.host}:${clientConfig.port}`;
// let baseURL = "https://api.pantheon.world";
if (process.env.NODE_ENV === "production") {
  baseURL = "https://api.pantheon.world";
}

export default axios.create({baseURL});
