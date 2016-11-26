import axios from 'axios';

const clientConfig = {
  host: process.env.HOSTNAME || 'localhost',
  port: process.env.PORT || '3100'
};

let baseURL = `http://${clientConfig.host}:${clientConfig.port}`;
if (process.env.NODE_ENV === "production") {
  baseURL = `http://pantheon-api.datawheel.us`;
}

export default axios.create({ baseURL });
