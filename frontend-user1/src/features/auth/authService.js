import api from "../../services/api";

const login = async (credentials) => {
  const response = await api.post("/auth/login", credentials);

  return response.data;
};

const signup = async (userData) => {
  const response = await api.post("/auth/signup", userData);

  return response.data;
};

const logout = async () => {
  try {
    await api.post("/auth/logout");
  } finally {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
  }
};

const getCurrentUser = async () => {
  const response = await api.get("/auth/me");

  return response.data;
};

const authService = {
  login,
  signup,
  logout,
  getCurrentUser,
};

export default authService;
