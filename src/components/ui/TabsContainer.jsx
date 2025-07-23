// components/ui/TabsContainer.jsx
import React, { useState } from "react";
import { TableChart, Assessment } from "@mui/icons-material";

export const TabsContainer = ({ children }) => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      id: 0,
      label: "Tabla de Asistencias",
      icon: TableChart,
      description: "Editar horarios y estatus",
    },
    {
      id: 1,
      label: "Tabla de Contadores",
      icon: Assessment,
      description: "Ver resumen por empleado",
    },
  ];

  return (
    <div>
      {/* Navegación de tabs */}
      <div style={styleHeader}>
        <div style={styleBorder}>
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  flex: 1,
                  padding: "16px 24px",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "14px",
                  fontWeight: isActive ? "600" : "400",
                  color: isActive ? "#1976d2" : "#666",
                  borderBottom: isActive
                    ? "3px solid #1976d2"
                    : "3px solid transparent",
                  transition: "all 0.2s ease",
                  borderRadius: "8px 8px 0 0",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.target.style.backgroundColor = "#f9f9f9";
                    e.target.style.color = "#333";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.target.style.backgroundColor = "transparent";
                    e.target.style.color = "#666";
                  }
                }}
              >
                <IconComponent sx={{ fontSize: 20 }} />
                <div style={{ textAlign: "left" }}>
                  <div>{tab.label}</div>
                  <div
                    style={{
                      fontSize: "12px",
                      opacity: 0.7,
                      fontWeight: "normal",
                      marginTop: "2px",
                    }}
                  >
                    {tab.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Contenido de la tab activa */}
      <div style={styleTab}>{children[activeTab]}</div>
    </div>
  );
};

const styleHeader = {
  backgroundColor: "white",
  borderRadius: "8px 8px 0 0",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  marginBottom: "0",
};

const styleBorder = {
  display: "flex",
  borderBottom: "1px solid #e0e0e0",
};

const styleTab = {
  backgroundColor: "white",
  borderRadius: "0 0 8px 8px",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  minHeight: "400px",
};
