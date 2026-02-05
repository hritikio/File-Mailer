import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./AdminLogs.css";

export default function AdminLogs({ onLogout }) {
  const [allLogs, setAllLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  const fetchAllLogs = async () => {
    try {
      setLoading(true);
      console.log("Fetching all logs with credentials...");
      const response = await axios.get("http://localhost:5000/api/alllogs", {
        withCredentials: true,
      });
      console.log("Response received:", response.data);
      console.log("Mapped logs:", response.data.mappedAllLogs);
      setAllLogs(response.data.mappedAllLogs || []);
    } catch (err) {
      console.log("error fetching all logs", err);
      console.log("Error response:", err.response);
      if (err.response?.status === 401) {
        onLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllLogs();
  }, []);

  useEffect(() => {
    console.log("allLogs state updated:", allLogs);
    console.log("allLogs length:", allLogs.length);
  }, [allLogs]);

  const filteredLogs = filter
    ? allLogs.filter(
        (log) =>
          log.email?.toLowerCase().includes(filter.toLowerCase()) ||
          log.filename?.toLowerCase().includes(filter.toLowerCase()),
      )
    : allLogs;

  console.log("filteredLogs length:", filteredLogs.length);
  console.log("Current filter:", filter);

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>📊 Admin Dashboard - All User Logs</h1>
        <div className="admin-actions">
          <button onClick={fetchAllLogs} className="refresh-btn">
            Refresh
          </button>
          <button onClick={onLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>

      <div className="search-section">
        <input
          type="text"
          placeholder="Search by email or filename..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="search-input"
        />
        <p className="logs-count">Total Logs: {filteredLogs.length}</p>
      </div>

      {loading ? (
        <div className="loading">Loading logs...</div>
      ) : filteredLogs.length === 0 ? (
        <div className="no-logs">No logs found</div>
      ) : (
        <div className="logs-grid">
          {filteredLogs.map((logItem, idx) => {
            const statusClass = logItem.status
              ?.toLowerCase()
              .includes("success")
              ? "status-success"
              : "status-fail";

            return (
              <div key={idx} className="log-card">
                <div className="log-header">
                  <span className={`status-badge ${statusClass}`}>
                    {logItem.status}
                  </span>
                  <span className="log-time">{logItem.createdAt}</span>
                </div>
                <div className="log-body">
                  <div className="log-field">
                    <label>From:</label>
                    <p>{logItem.email}</p>
                  </div>
                  <div className="log-field">
                    <label>File:</label>
                    <p>{logItem.filename}</p>
                  </div>
                  <div className="log-field">
                    <label>Size:</label>
                    <p>{logItem.filesize}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="admin-footer">
        <Link to="/" className="back-link">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
