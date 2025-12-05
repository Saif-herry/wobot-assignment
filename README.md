# 📸 Camera Table Component


A React component that displays, filters, paginates, and manages a list of security cameras. It supports search, filtering by location and status, pagination, and status toggling, with optional integration to an API service for fetching and updating data.

🎯 Live Demo
🔗 Live Application: [(https://wobot-assignment-black.vercel.app/)]
🔗 GitHub Repository: [Your Repository Link]

📋 Features Implemented
✅ Core Requirements (As per assignment)
📊 Data Integration: Real API integration with CORS proxy support

🔄 Status Updates: One-click toggle via checkbox (Active/Inactive)

🔍 Search Functionality: Real-time search across camera fields

📍 Filtering: Filter by location and status

📄 Pagination: Frontend pagination with configurable page sizes

🗑️ Delete Action: Remove cameras with confirmation

🎨 Design Matching: UI matches provided screenshot

✅ Additional Features
Modular Architecture: Clean separation with reusable components

Error Handling: Graceful error states with retry functionality

Loading States: Visual feedback during operations

Responsive Design: Works on all screen sizes

Real API Calls: Proper API integration with fallback

Performance Optimized: Efficient rendering and state management

🚀 Quick Start
Prerequisites
Node.js 16.x or higher

npm or yarn package manager

Installation
Clone and install

1). git clone <your-repo-url>
cd camera-management-app
npm install

2). Start development server
npm run dev

3). Build for production
npm run build

🏗️ Project Structure
src/
├── components/
│   ├── CameraTable.jsx              # Main table component
│   ├── CameraTableComponents.jsx    # Modular sub-components
│   └── (other reusable components)
├── services/
│   └── api.js                       # API service layer
├── styles/
│   └── Table.css                    # All styles
└── App.js                           # Root component


Modular Component Breakdown
CameraTable.jsx - Main container with:

State management (cameras, filters, pagination)

API integration logic

Business logic handlers

CameraTableComponents.jsx - Reusable sub-components:

Header: Logo and branding

TitleAndSearch: Page title with search functionality

FilterControls: Location and status filters

TableHeaderSection: Table column headers

TableFooter: Pagination controls



🔧 API Integration
API Service (services/api.js)

const API_BASE_URL = "https://api-app-staging.wobot.ai/app/v1";
const AUTH_TOKEN = "4ApVMin5sTxeW7GQ5VWeWiy";



CORS Handling
Since the API has CORS restrictions, the application uses:

CORS Anywhere proxy for development

Mock data fallback when API is unavailable

Local caching for better performance



export const apiService = {
  async getCameras() {
    // Fetches camera data from API
    // Uses CORS proxy for development
  },
  
  async updateCameraStatus(id, status) {
    // Updates camera status via POST request
    // Handles both real API and fallback
  }
};


Data Flow
Fetch Data: useEffect calls apiService.getCameras()

Process Data: Extract unique locations for filters

Apply Filters: Real-time filtering based on search and selections

Update Status: Checkbox click calls apiService.updateCameraStatus()

Pagination: Slice data for current page display


🎨 Key Features Implementation
1. Status Update System
   
const toggleCameraStatus = async (camera) => {
  const newStatus = camera.status === "Active" ? "Inactive" : "Active";
  
  // Show loading state
  setUpdatingStatus(prev => ({ ...prev, [camera.id]: true }));
  
  try {
    // Call API
    await apiService.updateCameraStatus(camera.id, newStatus);
    
    // Update local state
    setCameras(prev => prev.map(cam => 
      cam.id === camera.id ? { ...cam, status: newStatus } : cam
    ));
  } catch (error) {
    // Handle error
  } finally {
    // Clear loading state
    setUpdatingStatus(prev => ({ ...prev, [camera.id]: false }));
  }
};


2. Search & Filter System
Real-time Search: Debounced search across name, location, recorder

Location Filter: Dynamic dropdown from unique camera locations

Status Filter: Toggle between Active/Inactive/All

Reset on Filter Change: Automatically returns to page 1

3. Pagination System
Configurable items per page (10, 20, 50)

Dynamic page calculation

Previous/Next navigation

Current position display



📱 UI Components
 Header Section
. Wobot Intelligence logo
. Centered branding

Control Section
. Page title with description
. Search input with icon
. Location and status filters

Table Section
. Checkbox column for status toggle
. Health indicators (Cloud/Edge)
. Camera details (Location, Recorder, Tasks)
. Status badge with color coding
. Delete action button

Footer Section
. Items per page selector
. Page navigation controls
. Current position indicator

🎯 State Management
// Camera Data
const [cameras, setCameras] = useState([]);
const [filteredCameras, setFilteredCameras] = useState([]);

// UI State
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [updatingStatus, setUpdatingStatus] = useState({});

// Filters
const [searchTerm, setSearchTerm] = useState("");
const [statusFilter, setStatusFilter] = useState("all");
const [locationFilter, setLocationFilter] = useState("all");

// Pagination
const [currentPage, setCurrentPage] = useState(1);
const [itemsPerPage, setItemsPerPage] = useState(10);

🛠️ Development Scripts
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  }
}

🌐 Deployment

Vercel
npm install -g vercel
vercel

GitHub Pages
Install gh-pages: npm install --save-dev gh-pages

Add scripts to package.json

Run: npm run deploy


📄 API Response Structure
The application expects data in this format:

{
  "_id": "string",
  "id": number,
  "name": "string",
  "current_status": "Online/Offline",
  "health": {
    "cloud": "A/B/C/D",
    "device": "A/B/C/D"
  },
  "location": "string",
  "recorder": "string",
  "tasks": "string",
  "status": "Active/Inactive",
  "hasWarning": boolean
}

🔒 Environment Variables
Create .env file:

REACT_APP_API_BASE_URL=https://api-app-staging.wobot.ai/app/v1
REACT_APP_AUTH_TOKEN=4ApVMin5sTxeW7GQ5VWeWiy

🧪 Testing Features

Manual Test Checklist
Load cameras successfully

Search filters data in real-time

Location filter works

Status filter works

Checkbox toggles camera status

Delete shows confirmation

Pagination navigates correctly

Responsive on mobile/tablet

Loading states display

Error states handle gracefully


📱 Responsive Design
Breakpoint	Layout
> 1200px	Full table with all columns
768px-1200px	Compact table layout
< 768px	Stacked mobile layout

🚀 Performance Optimizations
Efficient Filtering: Memoized filter calculations

Optimistic Updates: Immediate UI feedback

Conditional Rendering: Only render visible items

CSS Optimization: Minimal reflows and repaints



📄 License
MIT License - see LICENSE file for details.

👤 Author
Mohammad Saif

GitHub: Saif-herry

Email: saifsami321md@gmail.com


🙏 Acknowledgments
Wobot Intelligence for the assignment opportunity

React team for the excellent framework

Create React App for the development setup




Assignment Requirements Checklist

Data Integration with API ✅

Status Update Functionality ✅

Search & Filter Features ✅

Pagination Implementation ✅

Delete Action ✅

Design Matching ✅

Clean, Modular Code ✅

Responsive Design ✅

Error Handling ✅

Loading States ✅

Built with React for Wobot Intelligence Frontend Developer Assignment




## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
