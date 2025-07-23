import React from "react";
import {
  Business,
  Person,
  CheckCircle,
  Warning,
  Error,
  Assignment,
  Event,
} from "@mui/icons-material";

export const CountersTable = ({ empleados, cellStatuses, dias }) => {
  const statusTypes = [
    { id: "normal", label: "Normal", icon: CheckCircle, color: "#4CAF50" },
    { id: "retardo", label: "Retardos", icon: Warning, color: "#FFC000" },
    { id: "falta", label: "Faltas", icon: Error, color: "#C55A11" },
    { id: "permiso", label: "Permisos", icon: Assignment, color: "#FF99CC" },
    { id: "vacaciones", label: "Vacaciones", icon: Event, color: "#FFFF00" },
  ];

  const calculateCountersForEmployee = (employeeId) => {
    const counters = {
      normal: 0,
      retardo: 0,
      falta: 0,
      permiso: 0,
      vacaciones: 0,
    };

    dias.forEach((_, dayIndex) => {
      ["entrada", "salida"].forEach((type) => {
        const key = `${employeeId}-${dayIndex}-${type}`;
        const status = cellStatuses[key] || "normal";
        if (counters.hasOwnProperty(status)) {
          counters[status]++;
        }
      });
    });

    return counters;
  };

  const getCounterBadgeStyle = (count, color) => {
    if (count === 0) {
      return {
        backgroundColor: "#f5f5f5",
        color: "#999",
        border: "1px solid #e0e0e0",
      };
    }
    return {
      backgroundColor: color + "20",
      color: color,
      border: `1px solid ${color}`,
      fontWeight: "bold",
    };
  };

  // Calcular totales
  const calculateTotals = () => {
    const totals = {
      normal: 0,
      retardo: 0,
      falta: 0,
      permiso: 0,
      vacaciones: 0,
    };

    empleados.forEach((empleado) => {
      const employeeCounters = calculateCountersForEmployee(empleado.id);
      Object.keys(totals).forEach((key) => {
        totals[key] += employeeCounters[key];
      });
    });

    return totals;
  };

  const totals = calculateTotals();

  return (
    <div style={styleWrapper}>
      <div style={styleTableWrapper}>
        <table style={styleTable}>
          <thead style={styleThead}>
            <tr>
              <th style={styleTh}>
                <div style={styleThLabel}>
                  <Business sx={{ fontSize: 16 }} />
                  Plaza
                </div>
              </th>
              <th style={styleTh}>
                <div style={styleThLabel}>
                  <Person sx={{ fontSize: 16 }} />
                  Empleado
                </div>
              </th>
              {statusTypes.map((status) => {
                const IconComponent = status.icon;
                return (
                  <th key={status.id} style={styleThStatus}>
                    <div style={styleThStatusInner}>
                      <IconComponent
                        sx={{ fontSize: 18, color: status.color }}
                      />
                      <div style={styleThStatusLabel}>{status.label}</div>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {empleados.map((empleado, index) => {
              const counters = calculateCountersForEmployee(empleado.id);
              const rowStyle = {
                backgroundColor: index % 2 === 0 ? "#ffffff" : "#f9f9f9",
              };

              return (
                <tr key={empleado.id} style={rowStyle}>
                  <td style={styleTd}>
                    <span style={stylePlazaBadge}>{empleado.plaza}</span>
                  </td>
                  <td style={styleTd}>
                    <div style={styleNombre}>{empleado.nombre}</div>
                  </td>
                  {statusTypes.map((status) => {
                    const count = counters[status.id];
                    const badgeStyle = getCounterBadgeStyle(
                      count,
                      status.color
                    );
                    return (
                      <td key={status.id} style={styleTdCenter}>
                        <div style={{ ...styleCounterBadge, ...badgeStyle }}>
                          {count}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
            {/* Fila de totales */}
            <tr style={styleTotalRow}>
              <td style={styleTdTotal} colSpan={2}>
                <div style={styleTotalLabel}>
                  <strong>TOTALES ({empleados.length} empleados)</strong>
                </div>
              </td>
              {statusTypes.map((status) => {
                const total = totals[status.id];
                const badgeStyle = getCounterBadgeStyle(total, status.color);
                return (
                  <td key={status.id} style={styleTdCenter}>
                    <div style={{ ...styleCounterBadge, ...badgeStyle }}>
                      <strong>{total}</strong>
                    </div>
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Estilos (mantengo los originales con algunas mejoras)
const styleWrapper = {
  backgroundColor: "white",
  borderRadius: "8px",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  overflow: "hidden",
  margin: "0",
};

const styleTableWrapper = {
  maxHeight: "600px",
  overflow: "auto",
};

const styleTable = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: "13px",
};

const styleThead = {
  backgroundColor: "#f8f9fa",
  position: "sticky",
  top: 0,
  zIndex: 1,
};

const styleTh = {
  minWidth: "80px",
  padding: "16px 12px",
  border: "1px solid #e0e0e0",
  fontWeight: "bold",
  textAlign: "left",
  backgroundColor: "#f8f9fa",
};

const styleThLabel = {
  display: "flex",
  alignItems: "center",
  gap: "6px",
};

const styleThStatus = {
  minWidth: "100px",
  padding: "12px 8px",
  border: "1px solid #e0e0e0",
  fontWeight: "bold",
  textAlign: "center",
  fontSize: "12px",
  backgroundColor: "#f8f9fa",
};

const styleThStatusInner = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "4px",
};

const styleThStatusLabel = {
  fontWeight: "bold",
  fontSize: "11px",
};

const styleTd = {
  padding: "12px",
  border: "1px solid #e0e0e0",
};

const styleTdCenter = {
  padding: "12px",
  border: "1px solid #e0e0e0",
  textAlign: "center",
};

const styleTdTotal = {
  padding: "12px",
  border: "1px solid #e0e0e0",
  backgroundColor: "#f8f9fa",
  fontWeight: "bold",
};

const styleTotalRow = {
  backgroundColor: "#f8f9fa",
  borderTop: "2px solid #1976d2",
};

const styleTotalLabel = {
  fontSize: "13px",
  color: "#1976d2",
};

const stylePlazaBadge = {
  backgroundColor: "#1976d2",
  color: "white",
  padding: "4px 8px",
  borderRadius: "12px",
  fontSize: "11px",
  fontWeight: "500",
};

const styleNombre = {
  fontWeight: "500",
  fontSize: "13px",
};

const styleCounterBadge = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minWidth: "40px",
  height: "32px",
  borderRadius: "16px",
  fontSize: "14px",
  fontWeight: "500",
  padding: "0 12px",
};

const styleInfo = {
  padding: "16px",
  backgroundColor: "#f8f9fa",
  borderTop: "1px solid #e0e0e0",
  fontSize: "12px",
  color: "#666",
};

const styleInfoRow = {
  display: "flex",
  alignItems: "center",
  gap: "6px",
  justifyContent: "center",
};

const styleInfoStrong = {
  fontWeight: "500",
  color: "#333",
};
