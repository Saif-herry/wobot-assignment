import React, { useState, useEffect } from "react";
import { MdCheckBoxOutlineBlank, MdCheckBox } from "react-icons/md";
import { apiService } from "../services/api";
import "./Table.css";

import {
  FilterControls,
  Header,
  TableFooter,
  TableHeaderSection,
  TitleAndSearch,
} from "./CameraTableComponents";

function CameraTable() {
  const [cameras, setCameras] = useState([]);
  const [filteredCameras, setFilteredCameras] = useState([]);
  const [uniqueLocations, setUniqueLocations] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState({});

  const [checked, setChecked] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  /* --------------------------- Fetch Cameras --------------------------- */
  useEffect(() => {
    const fetchCameras = async () => {
      try {
        setLoading(true);
        const cameraData = await apiService.getCameras();
        setCameras(cameraData);
        setFilteredCameras(cameraData);
        setUniqueLocations([...new Set(cameraData.map((cam) => cam.location))]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCameras();
  }, []);

  /* --------------------------- Filters & Search --------------------------- */
  useEffect(() => {
    if (!cameras.length) return;

    let result = [...cameras];
    const term = searchTerm.trim().toLowerCase();

    if (term) {
      result = result.filter(({ name = "", location = "", recorder = "" }) =>
        [name, location, recorder].some((field) =>
          field.toLowerCase().includes(term)
        )
      );
    }

    if (statusFilter !== "all")
      result = result.filter((cam) => cam.status === statusFilter);

    if (locationFilter !== "all")
      result = result.filter((cam) => cam.location === locationFilter);

    setFilteredCameras(result);
    setCurrentPage(1);
  }, [cameras, searchTerm, statusFilter, locationFilter]);

  /* --------------------------- Pagination --------------------------- */
  const indexOfLastItem = currentPage * itemsPerPage;
  const currentItems = filteredCameras.slice(
    indexOfLastItem - itemsPerPage,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredCameras.length / itemsPerPage);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  /* --------------------------- Toggle Status (FIXED) --------------------------- */
  const toggleCameraStatus = async (camera) => {
    const newStatus = camera.status === "Active" ? "Inactive" : "Active";
    setUpdatingStatus((prev) => ({ ...prev, [camera.id]: true }));

    try {
      // Optional: call backend if API supports update
      await apiService.updateCameraStatus(camera.id, newStatus);

      // Update local state
      setCameras((prev) =>
        prev.map((cam) =>
          cam.id === camera.id ? { ...cam, status: newStatus } : cam
        )
      );
      setFilteredCameras((prev) =>
        prev.map((cam) =>
          cam.id === camera.id ? { ...cam, status: newStatus } : cam
        )
      );
    } catch (err) {
      console.error("Error updating camera status:", err);
      alert("Failed to update camera status. Please try again.");
    } finally {
      setUpdatingStatus((prev) => ({ ...prev, [camera.id]: false }));
    }
  };

  /* --------------------------- Delete Camera --------------------------- */
  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this camera?")) return;
    setCameras((prev) => prev.filter((c) => c.id !== id));
    setFilteredCameras((prev) => prev.filter((c) => c.id !== id));
  };

  /* --------------------------- Conditional Renders --------------------------- */
  if (loading)
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading cameras...</p>
      </div>
    );

  if (error)
    return (
      <div className="error-container">
        <p className="error-message">Error: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="retry-button"
        >
          Retry
        </button>
      </div>
    );

  /* --------------------------- Render Helpers --------------------------- */
  const renderHealth = (type, value) => (
    <div className="health-section">
      <img src={`/${type}.png`} alt={type} width="14" height="14" />
      <div className={`health-indicator ${value}`}>
        <div style={{ fontSize: "8px" }}>{value}</div>
      </div>
    </div>
  );

  const renderCameraRow = (camera) => (
    <div key={camera.id} className="table-row">
      {/* Checkbox + Name */}
      <div style={{ position: "relative" }}>
        <div
          className="checkbox-container"
          onClick={() => toggleCameraStatus(camera)}
          title={`Toggle status: ${
            camera.status === "Active" ? "Deactivate" : "Activate"
          }`}
        >
          {updatingStatus[camera.id] ? (
            <div className="loading-spinner" />
          ) : camera.status === "Active" ? (
            <MdCheckBox size={22} color="#4caf50" />
          ) : (
            <MdCheckBoxOutlineBlank size={22} color="#b0b0b0" />
          )}
        </div>

        <div className="camera-name-container">
          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor:
                camera.current_status === "Online" ? "green" : "red",
            }}
          />
          <div className="row-item name-item">{camera.name}</div>
          {camera.hasWarning && (
            <img src="/warning.png" alt="warning" width="14" height="14" />
          )}
        </div>
      </div>

      {/* Health */}
      <div className="row-item health-section">
        {renderHealth("Cloud", camera.health.cloud)}
        {renderHealth("Edge", camera.health.device)}
      </div>

      {/* Details */}
      <div className="row-item name-item">{camera.location}</div>
      <div className="row-item name-item">{camera.recorder || "N/A"}</div>
      <div className="row-item name-item">{camera.tasks || "N/A"}</div>
      <div className="row-item">
        <p className={`status-select ${camera.status}`}>{camera.status}</p>
      </div>

      {/* Actions */}
      <div className="row-item actions" onClick={() => handleDelete(camera.id)}>
        <img src="/delete.png" alt="delete" width="20" height="20" />
      </div>
    </div>
  );

  /* --------------------------- Main Render --------------------------- */
  return (
    <div className="camera-table-container">
      <Header />

      <TitleAndSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <FilterControls
        uniqueLocations={uniqueLocations}
        locationFilter={locationFilter}
        setLocationFilter={setLocationFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      <div className="table-container">
        <div className="table-wrapper">
          <TableHeaderSection checked={checked} setChecked={setChecked} />

          <div className="table-body">
            {currentItems.length === 0 ? (
              <div className="no-data">
                No cameras found matching your criteria.
              </div>
            ) : (
              currentItems.map(renderCameraRow)
            )}
          </div>
        </div>

        <TableFooter
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          totalPages={totalPages}
          goToPage={goToPage}
          indexOfFirstItem={indexOfLastItem - itemsPerPage}
          indexOfLastItem={indexOfLastItem}
          filteredCameras={filteredCameras}
        />
      </div>
    </div>
  );
}

export default CameraTable;
