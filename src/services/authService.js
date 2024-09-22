import axios from "axios";

const API_BASE_URL = "https://dev.intraversewebservices.com/api";

export const login = async (email, password) => {
  const url = `${API_BASE_URL}/main/v1/account/login?populate=detail`;

  const response = await axios.post(url, {
    email,
    password,
  });

  // Correctly extract token from response.data.data.token
  if (response.data && response.data.data && response.data.data.token) {
    return response.data.data.token;
  }

  throw new Error("Login failed. Token not received.");
};
