import axios from "axios";
import { environment } from "../environment.js";

export default axios.create({
  baseURL: `http://${environment.api_host}:${environment.api_port}/api`,
  headers: {
    "Content-type": "application/json",
  },
});
