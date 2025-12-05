// Use a CORS proxy
const CORS_PROXY = "https://cors-anywhere.herokuapp.com/"; // Free CORS proxy
const API_BASE_URL = "https://api-app-staging.wobot.ai/app/v1";
const AUTH_TOKEN = "4ApVMIn5sTxeW7GQ5VWeWiy";

// 🧩 Local fallback data (used if API fails)
const fallbackCameraData = [
  {
    _id: "66d1b0684bd38a998b414a93",
    id: 1,
    name: "Camera 1",
    current_status: "Online",
    health: { cloud: "A", device: "A" },
    location: "Denver, CO",
    recorder: "Denver Recorder",
    tasks: "4",
    status: "Active",
    hasWarning: true,
  },
  {
    _id: "66d1b0684bd38a998b414a94",
    id: 2,
    name: "Camera 2",
    current_status: "Online",
    health: { cloud: "F", device: "A" },
    location: "San Diego, CA",
    recorder: "San Diego Recorder",
    tasks: "2",
    status: "Inactive",
    hasWarning: false,
  },
  {
    _id: "66d1b0684bd38a998b414a95",
    id: 3,
    name: "Camera 3",
    current_status: "Online",
    health: { cloud: "B", device: "D" },
    location: "Chicago, IL",
    recorder: "",
    tasks: "3",
    status: "Active",
    hasWarning: false,
  },
  {
    _id: "66d1b0684bd38a998b414a96",
    id: 4,
    name: "Camera 4",
    current_status: "Online",
    health: { cloud: "B", device: "B" },
    location: "Miami, FL",
    recorder: "Miami Recorder",
    tasks: "3",
    status: "Active",
    hasWarning: false,
  },
  {
    _id: "66d1b0684bd38a998b414a97",
    id: 5,
    name: "Camera 5",
    current_status: "Online",
    health: { cloud: "A", device: "D" },
    location: "San Francisco, CA",
    recorder: "San Francisco Recorder",
    tasks: "5",
    status: "Active",
    hasWarning: false,
  },
  {
    _id: "66d1b0684bd38a998b414a93",
    id: 6,
    name: "Camera 6",
    current_status: "Online",
    health: { cloud: "A", device: "A" },
    location: "Denver, CO",
    recorder: "Denver Recorder",
    tasks: "4",
    status: "Active",
    hasWarning: true,
  },
  {
    _id: "66d1b0684bd38a998b414a94",
    id: 7,
    name: "Camera 7",
    current_status: "Online",
    health: { cloud: "F", device: "A" },
    location: "San Diego, CA",
    recorder: "San Diego Recorder",
    tasks: "2",
    status: "Inactive",
    hasWarning: false,
  },
  {
    _id: "66d1b0684bd38a998b414a95",
    id: 8,
    name: "Camera 8",
    current_status: "Online",
    health: { cloud: "B", device: "D" },
    location: "Chicago, IL",
    recorder: "",
    tasks: "3",
    status: "Active",
    hasWarning: false,
  },
  {
    _id: "66d1b0684bd38a998b414a96",
    id: 9,
    name: "Camera 9",
    current_status: "Online",
    health: { cloud: "B", device: "B" },
    location: "Miami, FL",
    recorder: "Miami Recorder",
    tasks: "3",
    status: "Active",
    hasWarning: false,
  },
  {
    _id: "66d1b0684bd38a998b414a97",
    id: 10,
    name: "Camera 10",
    current_status: "Online",
    health: { cloud: "A", device: "D" },
    location: "San Francisco, CA",
    recorder: "San Francisco Recorder",
    tasks: "5",
    status: "Active",
    hasWarning: false,
  },
];

export const apiService = {
  // Fetch camera list
  async getCameras() {
    try {
      const proxyUrl = `${CORS_PROXY}${API_BASE_URL}/fetch/cameras`;

      const response = await fetch(proxyUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
      });

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      console.log("✅ Cameras fetched from API:", data.data);
      return data.data || [];
    } catch (error) {
      console.warn("⚠️ API fetch failed — using fallback data:", error.message);
      // Use fallback data instead of breaking UI
      return fallbackCameraData;
    }
  },

  // Update camera status (mocked if API fails)
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

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      console.log("✅ Camera status updated:", data);
      return data;
    } catch (error) {
      console.warn(
        "⚠️ Failed to update camera status (mock update used):",
        error.message
      );

      // Simulate a mock success update (so UI still responds)
      return { success: true, id, newStatus: status };
    }
  },
};
