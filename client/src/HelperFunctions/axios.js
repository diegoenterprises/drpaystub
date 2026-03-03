import Axios from "axios";
const { REACT_APP_MODE, REACT_APP_BACKEND_URL_LOCAL, REACT_APP_FRONTEND_URL_LIVE } =
  process.env;

let url = REACT_APP_BACKEND_URL_LOCAL;
if (REACT_APP_MODE === "live") {
  url = REACT_APP_FRONTEND_URL_LIVE;
}

export const axios = Axios.create({
  baseURL: url,
});

// Attach JWT token on every request when available
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("tokens");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
