import axios from 'axios'

export const ServerURL =
  process.env.NODE_ENV === "production" ? "" : "http://localhost:8080/";

  export const API = axios.create({
    baseURL: "http://localhost:8080",
   headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });

  export const getHeaders = () =>{
    return {
        headers:{
            'Content-Type':'application/json',
            Accept:'application/json'
        },
        withCredentials:true
    }
}