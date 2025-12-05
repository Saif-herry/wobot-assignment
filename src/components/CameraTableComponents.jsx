import "./Table.css";
import { apiService } from "../services/api";
import { MdCheckBoxOutlineBlank, MdCheckBox } from "react-icons/md";

/* --------------------------- Table Header Section --------------------------- */
export const TableHeaderSection = ({ checked, setChecked }) => {
  const tableHeaders = [
    "NAME",
    "HEALTH",
    "LOCATION",
    "RECORDER",
    "TASKS",
    "STATUS",
    "ACTIONS",
  ];

  return (
    <div className="table-header-section">
      {/* Select All Checkbox */}
      <div
        style={{ position: "relative", cursor: "pointer" }}
        onClick={() => setChecked((prev) => !prev)}
      >
        <div style={{ position: "absolute", top: "12px", left: "12px" }}>
          {checked ? (
            <MdCheckBox size={22} color="#4caf50" />
          ) : (
            <MdCheckBoxOutlineBlank size={22} color="#999" />
          )}
        </div>
      </div>

      {/* Table Headers */}
      <div className="table-header header-margin">
        {tableHeaders.map((title) => (
          <div key={title} className="header-item">
            {title}
          </div>
        ))}
      </div>
    </div>
  );
};

export const toggleCameraStatus = async (
  camera,
  setUpdatingStatus,
  setCameras
) => {
  const newStatus = camera.status === "Active" ? "Inactive" : "Active";
  setUpdatingStatus((prev) => ({ ...prev, [camera.id]: true }));

  try {
    await apiService.updateCameraStatus(camera.id, newStatus);

    // Update local state
    setCameras((prev) =>
      prev.map((c) =>
        c.id === camera.id
          ? {
              ...c,
              status: newStatus,
              ...(c.current_status && {
                current_status: newStatus === "Active" ? "Online" : "Offline",
              }),
            }
          : c
      )
    );
  } catch (err) {
    alert(`Failed to update ${camera.name} status`);
  } finally {
    setUpdatingStatus((prev) => ({ ...prev, [camera.id]: false }));
  }
};

// Dropdown to select how many items to show per page
export function PageSizeSelector({
  itemsPerPage,
  setItemsPerPage,
  setCurrentPage,
}) {
  const handleChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page
  };

  return (
    <select
      value={itemsPerPage}
      onChange={handleChange}
      className="page-selector"
    >
      <option value={10}>10</option>
      <option value={20}>20</option>
      <option value={50}>50</option>
    </select>
  );
}

// Controls for pagination (next and previous)
export function PaginationControls({ currentPage, totalPages, goToPage }) {
  return (
    <div className="footer-right">
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="pagination-button"
      >
        ◀
      </button>

      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="pagination-button"
      >
        ▶
      </button>
    </div>
  );
}

// Footer section that combines both the page size selector and pagination buttons
export function TableFooter({
  itemsPerPage,
  setItemsPerPage,
  setCurrentPage,
  currentPage,
  totalPages,
  goToPage,
  indexOfFirstItem,
  indexOfLastItem,
  filteredCameras,
}) {
  return (
    <div className="table-footer">
      <div className="footer-left">
        <PageSizeSelector
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
          setCurrentPage={setCurrentPage}
        />
        <span className="page-info">
          {indexOfFirstItem + 1} -{" "}
          {Math.min(indexOfLastItem, filteredCameras.length)} of{" "}
          {filteredCameras.length}
        </span>
      </div>

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        goToPage={goToPage}
      />
    </div>
  );
}

// Header Section
const Header = () => (
  <div className="header-container">
    <img src="/wobot_logo.png" alt="logo" className="header-logo" />
  </div>
);

// Title + Search Section
const TitleAndSearch = ({ searchTerm, setSearchTerm }) => (
  <div className="title-search-container">
    <div className="title-text">
      <p className="title-heading">Cameras</p>
      <span className="title-subtext">Manage your cameras here.</span>
    </div>

    <div className="search-box">
      <input
        type="text"
        placeholder="Search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
      <img src="/search.png" alt="search" className="search-icon" />
    </div>
  </div>
);

// Filter Section
const FilterControls = ({
  uniqueLocations,
  locationFilter,
  setLocationFilter,
  statusFilter,
  setStatusFilter,
}) => (
  <div className="controls-container">
    <div className="filter-controls">
      {/* Location Filter */}
      <div className="select-wrapper">
        <img src="/location.png" className="select-icon" alt="location" />
        <select
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className="filter-select"
        >
          <option value="all">Locations</option>
          {uniqueLocations.map((loc, idx) => (
            <option key={idx} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>

      {/* Status Filter */}
      <div className="select-wrapper">
        <img src="/status.png" className="select-icon" alt="status" />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="filter-select"
        >
          <option value="all">Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>
    </div>
  </div>
);

export { Header, TitleAndSearch, FilterControls };
