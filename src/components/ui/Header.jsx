// components/Header.jsx
import React from "react";
import { CalendarToday, ChevronLeft, ChevronRight } from "@mui/icons-material";

export const Header = ({
  title = "Sistema de Asistencia",
  periodo = "16 - 31 Agosto 2024",
}) => {
  return (
    <div
      style={{
        backgroundColor: "#1976d2",
        color: "white",
        padding: "16px 24px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <CalendarToday sx={{ fontSize: 24 }} />
          <h1 style={{ margin: 0, fontSize: "20px", fontWeight: "500" }}>
            {title}
          </h1>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button
            style={{
              background: "rgba(255,255,255,0.2)",
              border: "none",
              borderRadius: "4px",
              padding: "8px 12px",
              cursor: "pointer",
              color: "white",
              display: "flex",
              alignItems: "center",
            }}
          >
            <ChevronLeft sx={{ fontSize: 16 }} />
          </button>
          <span style={{ fontSize: "14px", fontWeight: "500" }}>{periodo}</span>
          <button
            style={{
              background: "rgba(255,255,255,0.2)",
              border: "none",
              borderRadius: "4px",
              padding: "8px 12px",
              cursor: "pointer",
              color: "white",
              display: "flex",
              alignItems: "center",
            }}
          >
            <ChevronRight sx={{ fontSize: 16 }} />
          </button>
        </div>
      </div>
    </div>
  );
};
