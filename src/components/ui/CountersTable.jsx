// components/ui/CountersTable.jsx
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
  // Definir los tipos de estatus y sus configuraciones
  const statusTypes = [
    { id: "normal", label: "Normal", icon: CheckCircle, color: "#4CAF50" },
    { id: "retardo", label: "Retardos", icon: Warning, color: "#FFC000" },
    { id: "falta", label: "Faltas", icon: Error, color: "#C55A11" },
    { id: "permiso", label: "Permisos", icon: Assignment, color: "#FF99CC" },
    { id: "vacaciones", label: "Vacaciones", icon: Event, color: "#FFFF00" },
  ];

  // Calcular contadores para un empleado específico
  const calculateCountersForEmployee = (employeeId) => {
    const counters = {
      normal: 0,
      retardo: 0,
      falta: 0,
      permiso: 0,
      vacaciones: 0,
    };

    // Contar por cada día y tipo (entrada/salida)
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

  // Obtener color de fondo para el contador
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

  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        overflow: "hidden",
        margin: "0",
      }}
    >
      <div style={{ maxHeight: "600px", overflow: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "13px",
          }}
        >
          <thead
            style={{
              backgroundColor: "#f8f9fa",
              position: "sticky",
              top: 0,
              zIndex: 1,
            }}
          >
            <tr>
              <th
                style={{
                  minWidth: "80px",
                  padding: "16px 12px",
                  border: "1px solid #e0e0e0",
                  fontWeight: "bold",
                  textAlign: "left",
                  backgroundColor: "#f8f9fa",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <Business sx={{ fontSize: 16 }} />
                  Plaza
                </div>
              </th>
              <th
                style={{
                  minWidth: "200px",
                  padding: "16px 12px",
                  border: "1px solid #e0e0e0",
                  fontWeight: "bold",
                  textAlign: "left",
                  backgroundColor: "#f8f9fa",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <Person sx={{ fontSize: 16 }} />
                  Empleado
                </div>
              </th>
              {statusTypes.map((status) => {
                const IconComponent = status.icon;
                return (
                  <th
                    key={status.id}
                    style={{
                      minWidth: "100px",
                      padding: "12px 8px",
                      border: "1px solid #e0e0e0",
                      fontWeight: "bold",
                      textAlign: "center",
                      fontSize: "12px",
                      backgroundColor: "#f8f9fa",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <IconComponent
                        sx={{ fontSize: 18, color: status.color }}
                      />
                      <div style={{ fontWeight: "bold", fontSize: "11px" }}>
                        {status.label}
                      </div>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {empleados.map((empleado, index) => {
              const counters = calculateCountersForEmployee(empleado.id);

              return (
                <tr
                  key={empleado.id}
                  style={{
                    backgroundColor: index % 2 === 0 ? "#ffffff" : "#f9f9f9",
                  }}
                >
                  <td
                    style={{
                      padding: "12px",
                      border: "1px solid #e0e0e0",
                    }}
                  >
                    <span
                      style={{
                        backgroundColor: "#1976d2",
                        color: "white",
                        padding: "4px 8px",
                        borderRadius: "12px",
                        fontSize: "11px",
                        fontWeight: "500",
                      }}
                    >
                      {empleado.plaza}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      border: "1px solid #e0e0e0",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: "500",
                        fontSize: "13px",
                      }}
                    >
                      {empleado.nombre}
                    </div>
                  </td>
                  {statusTypes.map((status) => {
                    const count = counters[status.id];
                    const badgeStyle = getCounterBadgeStyle(
                      count,
                      status.color
                    );

                    return (
                      <td
                        key={status.id}
                        style={{
                          padding: "12px",
                          border: "1px solid #e0e0e0",
                          textAlign: "center",
                        }}
                      >
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            minWidth: "40px",
                            height: "32px",
                            borderRadius: "16px",
                            fontSize: "14px",
                            fontWeight: "500",
                            padding: "0 12px",
                            ...badgeStyle,
                          }}
                        >
                          {count}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Información adicional */}
      <div
        style={{
          padding: "16px",
          backgroundColor: "#f8f9fa",
          borderTop: "1px solid #e0e0e0",
          fontSize: "12px",
          color: "#666",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ fontWeight: "500" }}>💡 Información:</span>
          Los contadores se actualizan automáticamente cuando modificas la tabla
          de asistencias. Total de registros por empleado: {dias.length *
            2}{" "}
          (entrada + salida por día).
        </div>
      </div>
    </div>
  );
};
