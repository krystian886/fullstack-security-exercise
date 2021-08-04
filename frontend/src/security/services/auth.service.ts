import axios from "axios";
import defs from "./defs"

class AuthService {
  async login(data: { username: string; password: string }) {
    try {
      const response = await axios.post(defs.API_URL + "login", data);
      if (response.data.token) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }
      return response.status; 
    } catch (error) {
      console.log(error);
    }
  };

  logout() {
    localStorage.removeItem("user");
  }

  async register(data: {username: string; email: string; password: string;}) {
    try {
      const response = await axios.post(defs.API_URL + "register", data);
      return response.status; 
    } catch (error) {
      console.log(error);
    }
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem("user")!);   // NOT SURE
  };

}

export default new AuthService();