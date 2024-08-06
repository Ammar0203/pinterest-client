import api from "./api";

const Auth = {
  login: (token) => {
    localStorage.setItem("token", JSON.stringify(token));
    api.defaults.headers.common["Authorization"] = token;
  },
  init: () => {
    let token = JSON.parse(localStorage.getItem("token"));
    api.defaults.headers.common["Authorization"] = token !== null ? token : "";
  },
  auth: () => localStorage.getItem("token") !== null,
  guest: () => localStorage.getItem("token") === null,
  logout: () => {
    delete api.defaults.headers.common["Authorization"];
    localStorage.removeItem("token");
  },
  getToken: () => {
    let token = JSON.parse(localStorage.getItem("token"));
    return token !== null ? token : "";
  },
};

export default Auth;
