import axios from "axios";

const API_URL =
  "https://dev.intraversewebservices.com/api/main/v1/account/login?populate=detail";

export const login = async (email, password) => {
  try {
    const response = await axios.post(API_URL, { email, password });
    const token = response.data.token;
    return token;
  } catch (error) {
    console.error("Invalid Credentials", error);
    throw error;
  }
};
