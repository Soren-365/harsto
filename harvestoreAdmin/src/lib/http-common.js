import axios from "axios";

export default axios.create({
  baseURL: `http://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/api`,
  headers: {
    "Content-type": "application/json",
  },
});
