import React from "react";

export default function STTrainPanel({ trains }) {
  return (
    <div className="st-train-panel">
      <h2 className="st-panel-title">Train Movements</h2>
      <div className="st-train-table-wrap">
        <table className="st-train-table">
          <thead>
            <tr>
              <th>Train No.</th>
              <th>Name</th>
              <th>Direction</th>
              <th>Section</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {trains.map((t) => (
              <tr key={t.id}>
                <td>{t.id}</td>
                <td>{t.name}</td>
                <td>{t.direction}</td>
                <td>{t.section}</td>
                <td>
                  <span
                    className={`st-status-chip ${
                      t.status.startsWith("DELAYED") ? "st-status-chip--delayed" : "st-status-chip--ontime"
                    }`}
                  >
                    {t.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}