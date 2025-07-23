import React, { useState } from "react";
import {
  TableChart,
  Assessment,
  CalendarToday,
  ChevronLeft,
  ChevronRight,
} from "@mui/icons-material";

export const TabsContainer = ({ children, currentWeek, onWeekChange }) => {
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

  const handlePreviousWeek = () => {
    if (onWeekChange) {
      onWeekChange("previousWeek");
    }
  };

  const handleNextWeek = () => {
    if (onWeekChange) {
      onWeekChange("nextWeek");
    }
  };

  const handleCustomWeek = () => {
    if (onWeekChange) {
      onWeekChange("customWeek");
    }
  };

  return (
    <div>
      {/* Navegación de tabs con selector de fechas */}
      <div style={styleHeader}>
        <div style={styleBorder}>
          {/* Tabs del lado izquierdo */}
          <div style={styleTabsContainer}>
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    ...styleTabButton,
                    fontWeight: isActive ? "600" : "400",
                    color: isActive ? "#1976d2" : "#666",
                    borderBottom: isActive
                      ? "3px solid #1976d2"
                      : "3px solid transparent",
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
                  <div style={styleTabTextContainer}>
                    <div>{tab.label}</div>
                    <div style={styleTabDescription}>{tab.description}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selector de semanas del lado derecho */}
          <div style={styleDateSelectorContainer}>
            <div style={styleDateSelector}>
              <button
                style={styleDateNavButton}
                onClick={handlePreviousWeek}
                title="Semana anterior"
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "rgba(25, 118, 210, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
                }}
              >
                <ChevronLeft sx={{ fontSize: 18 }} />
              </button>

              <button
                style={styleDateDisplay}
                onClick={handleCustomWeek}
                title="Seleccionar semana personalizada"
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "rgba(25, 118, 210, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "transparent";
                }}
              >
                <CalendarToday sx={{ fontSize: 16, marginRight: "6px" }} />
                <div style={styleDateText}>
                  <div style={styleDateRange}>
                    {currentWeek || "16 - 22 Agosto 2024"}
                  </div>
                  <div style={styleDateSubtext}>Semana completa (7 días)</div>
                </div>
              </button>

              <button
                style={styleDateNavButton}
                onClick={handleNextWeek}
                title="Semana siguiente"
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "rgba(25, 118, 210, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
                }}
              >
                <ChevronRight sx={{ fontSize: 18 }} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido de la tab activa */}
      <div style={styleTabContent}>{children[activeTab]}</div>
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
  justifyContent: "space-between",
  alignItems: "center",
  borderBottom: "1px solid #e0e0e0",
  paddingRight: "16px",
};

const styleTabsContainer = {
  display: "flex",
  flex: 1,
};

const styleTabButton = {
  flex: 1,
  padding: "16px 24px",
  border: "none",
  background: "transparent",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  fontSize: "14px",
  transition: "all 0.2s ease",
  borderRadius: "8px 8px 0 0",
  maxWidth: "250px",
};

const styleTabTextContainer = {
  textAlign: "left",
};

const styleTabDescription = {
  fontSize: "12px",
  opacity: 0.7,
  fontWeight: "normal",
  marginTop: "2px",
};

const styleDateSelectorContainer = {
  display: "flex",
  alignItems: "center",
  minWidth: "300px",
  justifyContent: "flex-end",
};

const styleDateSelector = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  backgroundColor: "rgba(25, 118, 210, 0.05)",
  borderRadius: "8px",
  padding: "4px",
  border: "1px solid rgba(25, 118, 210, 0.2)",
};

const styleDateNavButton = {
  background: "rgba(255, 255, 255, 0.2)",
  border: "none",
  borderRadius: "6px",
  padding: "8px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#1976d2",
  transition: "all 0.2s ease",
  minWidth: "36px",
  height: "36px",
};

const styleDateDisplay = {
  background: "transparent",
  border: "none",
  borderRadius: "6px",
  padding: "8px 12px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  color: "#1976d2",
  transition: "all 0.2s ease",
  minWidth: "180px",
};

const styleDateText = {
  textAlign: "left",
};

const styleDateRange = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#1976d2",
  lineHeight: "1.2",
};

const styleDateSubtext = {
  fontSize: "11px",
  color: "#666",
  opacity: 0.8,
  marginTop: "1px",
};

const styleTabContent = {
  backgroundColor: "white",
  borderRadius: "0 0 8px 8px",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  minHeight: "400px",
};
