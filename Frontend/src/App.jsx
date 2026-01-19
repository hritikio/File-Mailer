import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import LogsDB from "./logs.jsx";
import { Routes, Route, Link } from "react-router-dom";
import AllLogs from "./alllog.jsx";

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

  const fetchLogs = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/5logs");
      setLogs(response.data.mapped_log);
    } catch (err) {
      console.log("error fetching logs", err);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSending) return;

    setIsSending(true);
    setDialog({ open: false, type: "success", message: "" });

    const formData = new FormData();

    formData.append("email", email);

    file.forEach((file) => formData.append("files", file)); //form data store in key value pair
    //files should be same as name in multer ,upload.array("files",5)

    console.log(formData);

    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/send",
        formData
      );

      console.log(response);
      console.log(response.data);
      console.log("Succesfull");

      setDialog({
        open: true,
        type: "success",
        message: "Files sent successfully.",
      });
    } catch (err) {
      if (err.message) console.log("error", err);
      if (err.response?.data) console.log("error1", err.response.data);
      setDialog({
        open: true,
        type: "fail",
        message: "Failed to send files. Please try again.",
      });
    } finally {
      await fetchLogs();
      setIsSending(false);
    }
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div>
            <h1>File Mailer</h1>

            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email">Email :</label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <br />

              <div>
                <label htmlFor="file">Select Files: </label>
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
                          {f.type || "Unknown type"}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <br />

              <button type="Submit" disabled={isSending}>
                {isSending ? "Sending..." : "Send"}
              </button>
            </form>
            <LogsDB logs={logs} />
            <Link to="/alllogs">
              <button>All Logs</button>
            </Link>
            {dialog.open && (
              <div className="dialog-overlay">
                <div
                  className={`dialog-card ${
                    dialog.type === "success" ? "dialog-success" : "dialog-fail"
                  }`}
                >
                  <div className="dialog-title">
                    {dialog.type === "success" ? "Success" : "Failed"}
                  </div>
                  <div className="dialog-message">{dialog.message}</div>
                  <div className="dialog-actions">
                    <button
                      onClick={() =>
                        setDialog({ open: false, type: "success", message: "" })
                      }
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        }
      />

      <Route path="/alllogs" element={<AllLogs />} />
    </Routes>
  );
}

export default App;
