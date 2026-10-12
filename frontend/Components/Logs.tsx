"use client";

const Logs = () => {
  return (
    <div>
      <div>
        <h1>Log History</h1>
        <p>This is the log history page.</p>
      </div>

      <table className="w-full border-collapse mt-5 border-r">
        <thead>
          <tr>
            <th>Timestamp (when)</th>
            <th>User (who)</th>
            <th>Action (what)</th>
            <th>Affected Person (whom)</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {/* Render log entries here */}
        </tbody>
      </table>
    </div>
  );
};

export default Logs;