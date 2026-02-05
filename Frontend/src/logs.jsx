export default function Logs({ logs }) {
  return (
    <div>
      <h2 style={{ color: "#333", marginBottom: "20px", fontSize: "20px" }}>
        Recent Logs
      </h2>

      {logs && logs.length > 0 ? (
        logs.map((logItem) => {
          const statusText = logItem.status || "";
          const lowered = statusText.toLowerCase();
          const statusClass = lowered.includes("success")
            ? "status-success"
            : lowered.includes("fail")
              ? "status-fail"
              : "status-neutral";

          return (
            <div key={logItem._id} className="log-card">
              <p>
                <strong>Email:</strong> {logItem.email}
              </p>
              <p>
                <strong>Filename:</strong> {logItem.filename}
              </p>
              <p>
                <strong>Filesize:</strong> {logItem.filesize}
              </p>
              <p>
                <strong>Status:</strong>
                <span className={`status-chip ${statusClass}`}>
                  {logItem.status}
                </span>
              </p>
              <p>
                <strong>Created At:</strong> {logItem.createdAt}
              </p>
            </div>
          );
        })
      ) : (
        <p style={{ color: "#6b7280", textAlign: "center", padding: "20px" }}>
          No logs yet. Send some files to see them here!
        </p>
      )}
    </div>
  );
}

export function allLogs() {}
