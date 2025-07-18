// components/StatsCard.jsx
import React from "react";

export const StatsCard = ({ icon: Icon, value, label, color }) => {
  return (
    <div
      style={{
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        textAlign: "center",
      }}
    >
      <Icon sx={{ fontSize: 32, color: color, mb: 1 }} />
      <div style={{ fontSize: "32px", fontWeight: "bold", color: color }}>
        {value}
      </div>
      <div style={{ fontSize: "14px", color: "#666" }}>{label}</div>
    </div>
  );
};
