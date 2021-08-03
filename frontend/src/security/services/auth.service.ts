import axios from "axios";
import defs from "./defs"

const register = (data: { username: string; email:string, password: string }) => {
  return axios.post(defs.API_URL + "register", {data});
};

const login = (data: { email: string; password: string }) => {
  return axios
    .post(defs.API_URL + "login", {data})
    .then((response) => {
      if (response.data.accessToken) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }

      return response.status;
    });
};

const logout = () => {
  localStorage.removeItem("user");
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user")!);   // NOT SURE
};

export default {
  register,
  login,
  logout,
  getCurrentUser,
};
