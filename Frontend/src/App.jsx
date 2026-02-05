import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import LogsDB from "./logs.jsx";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import AllLogs from "./alllog.jsx";
import Auth from "./Auth.jsx";
import AdminAuth from "./AdminAuth.jsx";
import AdminLogs from "./AdminLogs.jsx";

function App() {
  const [email, setEmail] = useState("");
  const [file, setFile] = useState([]);
  const [logs, setLogs] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [dialog, setDialog] = useState({
    open: false,
    type: "success",
    message: "",
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const userToken = localStorage.getItem("userToken");
    const adminToken = localStorage.getItem("adminToken");
    const storedUserType = localStorage.getItem("userType");

    if (userToken && storedUserType === "user") {
      setIsLoggedIn(true);
      setUserType("user");
    } else if (adminToken && storedUserType === "admin") {
      setIsLoggedIn(true);
      setUserType("admin");
    }
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/5logs", {
        withCredentials: true,
      });
      setLogs(response.data.mapped_log);
    } catch (err) {
      console.log("error fetching logs", err);
      if (err.response?.status === 401) {
        handleLogout();
      }
    }
  };

  useEffect(() => {
    if (isLoggedIn && userType === "user") {
      fetchLogs();
    }
  }, [isLoggedIn, userType]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSending) return;

    setIsSending(true);
    setDialog({ open: false, type: "success", message: "" });

    const formData = new FormData();
    formData.append("email", email);
    file.forEach((f) => formData.append("files", f));

    try {
      const response = await axios.post(
        "http://localhost:5000/api/send",
        formData,
        {
          withCredentials: true,
        },
      );

      console.log(response);
      setDialog({
        open: true,
        type: "success",
        message: "Files sent successfully.",
      });
      setEmail("");
      setFile([]);
      await fetchLogs();
    } catch (err) {
      console.log("error", err);
      setDialog({
        open: true,
        type: "fail",
        message:
          err.response?.data?.message ||
          "Failed to send files. Please try again.",
      });
      if (err.response?.status === 401) {
        handleLogout();
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("userType");
    setIsLoggedIn(false);
    setUserType(null);
    setEmail("");
    setFile([]);
    setLogs([]);
    navigate("/login");
  };

  // Redirect to login if not logged in
  if (!isLoggedIn) {
    return (
      <Routes>
        <Route
          path="/login"
          element={
            <Auth setIsLoggedIn={setIsLoggedIn} setUserType={setUserType} />
          }
        />
        <Route
          path="/admin/login"
          element={
            <AdminAuth
              setIsLoggedIn={setIsLoggedIn}
              setUserType={setUserType}
            />
          }
        />
        <Route
          path="*"
          element={
            <Auth setIsLoggedIn={setIsLoggedIn} setUserType={setUserType} />
          }
        />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          userType === "user" ? (
            <div className="container">
              <div className="header">
                <h1>📧 File Mailer</h1>
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </div>

              <div className="main-content">
                <div className="form-section">
                  <form onSubmit={handleSubmit} className="email-form">
                    <div className="form-group">
                      <label htmlFor="email">Send To:</label>
                      <input
                        id="email"
                        type="email"
                        placeholder="recipient@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="file">Select Files (Max 5):</label>
                      <input
                        id="file"
                        required
                        type="file"
                        multiple
                        onChange={(e) => setFile(Array.from(e.target.files))}
                      />
                    </div>

                    {file.length > 0 && (
                      <div className="file-list">
                        <div className="file-list-header">
                          Selected Files ({file.length})
                        </div>
                        <ul>
                          {file.map((f, idx) => (
                            <li
                              className="file-pill"
                              key={`${f.name}-${f.size}-${idx}`}
                            >
                              <div className="file-name">{f.name}</div>
                              <div className="file-meta">
                                {(f.size / 1024).toFixed(1)} KB •{" "}
                                {f.type || "Unknown"}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSending}
                      className="send-btn"
                    >
                      {isSending ? "Sending..." : "Send Files"}
                    </button>
                  </form>
                </div>

                <div className="logs-section">
                  <LogsDB logs={logs} />
                  <Link to="/alllogs" className="view-all-link">
                    <button className="view-all-btn">View All Logs</button>
                  </Link>
                </div>
              </div>

              {dialog.open && (
                <div className="dialog-overlay">
                  <div
                    className={`dialog-card ${
                      dialog.type === "success"
                        ? "dialog-success"
                        : "dialog-fail"
                    }`}
                  >
                    <div className="dialog-title">
                      {dialog.type === "success" ? "✓ Success" : "✗ Failed"}
                    </div>
                    <div className="dialog-message">{dialog.message}</div>
                    <div className="dialog-actions">
                      <button
                        onClick={() =>
                          setDialog({
                            open: false,
                            type: "success",
                            message: "",
                          })
                        }
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <AdminLogs onLogout={handleLogout} />
          )
        }
      />

      <Route
        path="/login"
        element={
          <Auth setIsLoggedIn={setIsLoggedIn} setUserType={setUserType} />
        }
      />
      <Route
        path="/admin/login"
        element={
          <AdminAuth setIsLoggedIn={setIsLoggedIn} setUserType={setUserType} />
        }
      />
      <Route path="/alllogs" element={<AllLogs onLogout={handleLogout} />} />
    </Routes>
  );
}

export default App;
