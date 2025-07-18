// components/AttendanceTable.jsx
import React from "react";
import { Business, Person } from "@mui/icons-material";
import { getCellStyle } from "../../utils/getCellStyle.js";
import { getCellIcon } from "../../utils/getCellIcon.jsx";
import { formatHorario } from "../../utils/formatHorario.jsx";

export const AttendanceTable = ({ empleados, dias, horarios }) => {
  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        overflow: "hidden",
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
              {dias.map((dia, index) => (
                <th
                  key={index}
                  style={{
                    minWidth: "90px",
                    padding: "12px 8px",
                    border: "1px solid #e0e0e0",
                    fontWeight: "bold",
                    textAlign: "center",
                    fontSize: "12px",
                    backgroundColor: "#f8f9fa",
                  }}
                >
                  <div style={{ fontWeight: "bold" }}>{dia.dia}</div>
                  <div style={{ fontSize: "14px", marginTop: "2px" }}>
                    {dia.fecha}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {empleados.map((empleado, index) => (
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
                {horarios[empleado.id].map((horario, diaIndex) => {
                  const cellStyle = getCellStyle(horario);
                  const icon = getCellIcon(horario);

                  return (
                    <td
                      key={diaIndex}
                      style={{
                        minWidth: "90px",
                        height: "70px",
                        border: "1px solid #e0e0e0",
                        textAlign: "center",
                        padding: "8px",
                        verticalAlign: "middle",
                        fontSize: "11px",
                        ...cellStyle,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          height: "100%",
                          gap: "2px",
                        }}
                      >
                        {icon && (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "2px",
                            }}
                          >
                            {icon}
                          </div>
                        )}
                        <div>
                          {horario.includes("/")
                            ? formatHorario(horario)
                            : horario}
                        </div>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
