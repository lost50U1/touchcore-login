import axios from "axios";

const AUTOCOMPLETE_URL =
  "https://dev.intraversewebservices.com/api/product/v1/package/auto-complete";

let cancelTokenSource = null;

export const searchPackages = async (query, token) => {
  if (cancelTokenSource) {
    cancelTokenSource.cancel("Operation canceled due to new request.");
  }

  cancelTokenSource = axios.CancelToken.source();

  try {
    const response = await axios.get(`${AUTOCOMPLETE_URL}?q=${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cancelToken: cancelTokenSource.token,
    });
    return response.data;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log("Request canceled:", error.message);
    } else {
      console.error("Error fetching autocomplete results", error);
    }
    throw error;
  }
};
