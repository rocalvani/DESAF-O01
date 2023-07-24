import axios from 'axios'

export const ServerURL =
  process.env.NODE_ENV === "production" ? "" : "http://localhost:8080/";

  export const API = axios.create({
    baseURL: "http://localhost:8080",
    withCredentials: true,
  });