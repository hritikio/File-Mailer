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
      await fetchLogs();

      alert("Files sent successfully ✅");
    } catch (err) {
      if (err.message) console.log("error", err);
      console.log("error1", err.response.data);
      alert("Failed to send files ❌");
    }
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div>
            <h1>Hmailer</h1>

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

              <br />

              <button type="Submit">Send</button>
            </form>
            <LogsDB logs={logs} />
            <Link to="/alllogs">
              <button>All Logs</button>
            </Link>
            
          </div>
        }
      />

      <Route path="/alllogs" element={<AllLogs />} />
      
    </Routes>
  );
}

export default App;
