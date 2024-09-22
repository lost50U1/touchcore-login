import axios from "axios";

const API_BASE_URL = "https://dev.intraversewebservices.com/api";
const AUTOCOMPLETE_URL = `${API_BASE_URL}/product/v1/package/auto-complete`;

export const searchTours = async (query, token) => {
  const axiosCancelToken = axios.CancelToken.source();

  const response = await axios.get(`${AUTOCOMPLETE_URL}?q=${query}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cancelToken: axiosCancelToken.token,
  });

  return {
    axiosCancelToken,
    data: response.data.data,
  };
};
