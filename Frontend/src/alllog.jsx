import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AllLogs.css";

export default function AllLogs({ onLogout }) {
  const [allLogs, setAllLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchAllLogs = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/alllogs", {
        withCredentials: true,
      });
      setAllLogs(response.data.mappedAllLogs || []);
    } catch (err) {
      console.log("error fetching all logs", err);
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

  return (
    <div className="all-logs-container">
      <div className="all-logs-header">
        <button onClick={() => navigate("/")} className="back-button">
          ← Back to Home
        </button>
        <h2>All Your Logs</h2>
      </div>

      {loading ? (
        <div className="loading-state">Loading...</div>
      ) : allLogs.length === 0 ? (
        <div className="empty-state">
          <p>📭 No logs found</p>
          <p>Send some files to see them here!</p>
        </div>
      ) : (
        <div className="logs-grid">
          {allLogs.map((logItem, idx) => {
            const statusClass = logItem.status
              ?.toLowerCase()
              .includes("success")
              ? "status-success"
              : "status-fail";

            return (
              <div key={idx} className="all-log-card">
                <div className="log-header-row">
                  <span className={`status-badge ${statusClass}`}>
                    {logItem.status}
                  </span>
                  <span className="log-date">{logItem.createdAt}</span>
                </div>
                <div className="log-details">
                  <div className="log-detail-item">
                    <span className="label">To:</span>
                    <span className="value">{logItem.email}</span>
                  </div>
                  <div className="log-detail-item">
                    <span className="label">File:</span>
                    <span className="value">{logItem.filename}</span>
                  </div>
                  <div className="log-detail-item">
                    <span className="label">Size:</span>
                    <span className="value">{logItem.filesize}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
