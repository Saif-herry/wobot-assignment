import React, { useState, useEffect, useCallback } from "react";
import { apiService } from "../services/api";
import "./Table.css";

function TableComponent() {
  const [cameras, setCameras] = useState([]);
  console.log(" cameras----", cameras);
  const [filteredCameras, setFilteredCameras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");

  // Unique locations for filter dropdown
  const [uniqueLocations, setUniqueLocations] = useState([]);

  // Fetch cameras on component mount
  useEffect(() => {
    fetchCameras();
  }, []);

  const fetchCameras = async () => {
    try {
      setLoading(true);
      const cameraData = await apiService.getCameras();
      setCameras(cameraData);
      setFilteredCameras(cameraData);

      // Extract unique locations
      const locations = [
        ...new Set(cameraData.map((camera) => camera.location)),
      ];
      setUniqueLocations(locations);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters and search
  useEffect(() => {
    let result = cameras;

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (camera) =>
          camera.name.toLowerCase().includes(term) ||
          camera.location.toLowerCase().includes(term) ||
          (camera.recorder && camera.recorder.toLowerCase().includes(term))
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((camera) => camera.status === statusFilter);
    }

    // Apply location filter
    if (locationFilter !== "all") {
      result = result.filter((camera) => camera.location === locationFilter);
    }

    setFilteredCameras(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [cameras, searchTerm, statusFilter, locationFilter]);

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCameras.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCameras.length / itemsPerPage);

  // Handle status update
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await apiService.updateCameraStatus(id, newStatus);

      // Update local state
      setCameras((prevCameras) =>
        prevCameras.map((camera) =>
          camera.id === id ? { ...camera, status: newStatus } : camera
        )
      );
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update camera status");
    }
  };

  // Handle delete
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this camera?")) {
      setCameras((prevCameras) =>
        prevCameras.filter((camera) => camera.id !== id)
      );
      setFilteredCameras((prev) => prev.filter((camera) => camera.id !== id));
    }
  };

  // Handle pagination
  const goToPage = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setLocationFilter("all");
  };

  const headers = [
    "NAME",
    "HEALTH",
    "LOCATION",
    "RECORDER",
    "TASKS",
    "STATUS",
    "ACTIONS",
  ];

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading cameras...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">Error: {error}</p>
        <button onClick={fetchCameras} className="retry-button">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px 40px", height: "100%" }}>
      <div
        style={{
          height: "50px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "30px",
        }}
      >
        <img
          src="/wobot_logo.png"
          alt="camera icon"
          style={{ objectFit: "cover", height: "30px" }}
        />
      </div>

      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <p style={{ fontWeight: "bold", fontSize: "20px" }}>Cameras</p>
          <span style={{ fontSize: "11px" }}>Manage your cameras here.</span>
        </div>

        {/* Search Box */}
        <div className="search-box">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <img
            src="/search.png"
            alt="camera icon"
            className="search-icon"
            style={{ objectFit: "cover", height: "15px" }}
          />
        </div>
      </div>
      {/* Filter Controls */}
      <div className="controls-container">
        <div className="filter-controls">
          <div className="select-wrapper">
            <img
              src="/location.png"
              className="select-icon"
              alt="location icon"
            />

            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">Locations</option>
              {uniqueLocations.map((location, index) => (
                <option key={index} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>

          <div className="select-wrapper">
            <img
              src="/status.png" // ← put your status icon here
              className="select-icon"
              alt="status icon"
            />

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

          {/* <button onClick={resetFilters} className="reset-button">
            Reset Filters
          </button> */}
        </div>
      </div>
      <div className="table-container">
        {/* Table */}
        <div className="table-wrapper">
          <div style={{ position: "relative" }}>
            <div
              style={{
                width: "2%",
                border: "1px solid red",
                height: "100%",
                position: "absolute",
                left: 8,
                top: "0",
              }}
            >
              ff
            </div>

            <div className="table-header" style={{ marginLeft: "25px" }}>
              {headers.map((title) => (
                <div key={title} className="header-item">
                  {title}
                </div>
              ))}
            </div>
          </div>

          <div className="table-body">
            {currentItems.length === 0 ? (
              <div className="no-data">
                No cameras found matching your criteria.
              </div>
            ) : (
              currentItems.map((camera) => {
                console.log("camera--vkdk--", camera?.status);
                return (
                  <div key={camera.id} className="table-row">
                    <div
                      style={{
                        position: "relative",
                      }}
                    >
                      <div
                        style={{
                          width: "15%",
                          height: "100%", // parent must have height
                          position: "absolute",
                          left: 1,
                          top: 0,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <img
                          src="/checkbox.png"
                          alt="checkbox icon"
                          style={{
                            width: "18px",
                            height: "18px",
                            objectFit: "contain",
                          }}
                        />
                      </div>

                      <div
                        className="row-item name-item"
                        style={{ marginLeft: "30px" }}
                      >
                        {camera.name}
                      </div>
                    </div>

                    <div className="row-item">
                      <div
                        className={`health-indicator ${
                          camera.health || "good"
                        }`}
                      ></div>
                    </div>
                    <div className="row-item name-item">{camera.location}</div>
                    <div className="row-item name-item">
                      {camera.recorder || "N/A"}
                    </div>
                    <div className="row-item name-item">
                      {camera.tasks || "N/A"}
                    </div>
                    <div className="row-item">
                      <p className={`status-select ${camera.status}`}>
                        {camera.status}
                      </p>
                    </div>

                    <div
                      className="row-item actions"
                      onClick={() => handleDelete(camera.id)}
                    >
                      <img
                        src="/delete.png"
                        style={{ width: "20px", height: "20px" }}
                        alt="delete icon"
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Pagination */}
        <div className="table-footer">
          <div className="footer-left">
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="page-selector"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span className="page-info">
              {indexOfFirstItem + 1} -{" "}
              {Math.min(indexOfLastItem, filteredCameras.length)} of{" "}
              {filteredCameras.length}
            </span>
          </div>

          <div className="footer-right">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="pagination-button"
            >
              ◀
            </button>

            {/* <div className="page-numbers">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => goToPage(pageNum)}
                    className={`page-number ${
                      currentPage === pageNum ? "active" : ""
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div> */}

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="pagination-button"
            >
              ▶
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TableComponent;
