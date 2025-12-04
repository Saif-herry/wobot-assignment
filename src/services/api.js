// Use a CORS proxy
const CORS_PROXY = "https://cors-anywhere.herokuapp.com/"; // Free CORS proxy
// Or use your own proxy server
// const CORS_PROXY = "https://your-proxy-server.herokuapp.com/";

const API_BASE_URL = "https://api-app-staging.wobot.ai/app/v1";
const AUTH_TOKEN = "4ApVMIn5sTxeW7GQ5VWeWiy";

export const apiService = {
  // Fetch camera list
  async getCameras() {
    try {
      // Using CORS proxy to bypass CORS restrictions
      const proxyUrl = `${CORS_PROXY}${API_BASE_URL}/fetch/cameras`;

      const response = await fetch(proxyUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest", // Some proxies need this
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data.data);
      return data.data || [];
    } catch (error) {
      console.error("Error fetching cameras:", error);
      throw error;
    }
  },

  // Update camera status
  async updateCameraStatus(id, status) {
    try {
      const proxyUrl = `${CORS_PROXY}${API_BASE_URL}/update/camera/status`;

      const response = await fetch(proxyUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        body: JSON.stringify({ id, status }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error updating camera status:", error);
      throw error;
    }
  },
};
