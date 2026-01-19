export default function Logs({ logs }) {
  return (
    <div>
      <h2>Logs:</h2>

      {logs.map((logItem) => {
        const statusText = logItem.status || "";
        const lowered = statusText.toLowerCase();
        const statusClass = lowered.includes("success")
          ? "status-success"
          : lowered.includes("fail")
          ? "status-fail"
          : "status-neutral";

        return (
          <div
            key={logItem._id}
            style={{
              background:
                "linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
              border: "1px solid rgba(255,255,255,0.08)",
              margin: "12px 0",
              padding: "18px",
              borderRadius: "14px",
              boxShadow: "0 12px 28px rgba(0,0,0,0.35)",
              transition:
                "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 16px 36px rgba(0,0,0,0.45)";
              e.currentTarget.style.borderColor = "rgba(56,189,248,0.6)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 12px 28px rgba(0,0,0,0.35)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
            }}
          >
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
              <strong>Status:</strong>{" "}
              <span className={`status-chip ${statusClass}`}>
                {logItem.status}
              </span>
            </p>
            <p>
              <strong>Created At:</strong> {logItem.createdAt}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export function allLogs() {}
