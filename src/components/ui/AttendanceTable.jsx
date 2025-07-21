// components/ui/AttendanceTable.jsx
import React from "react";
import { Business, Person } from "@mui/icons-material";
import { EditableCell } from "./table/EditableCell";

export const AttendanceTable = ({
  empleados,
  dias,
  horarios,
  cellStatuses,
  onStatusChange,
  getCellStatus,
}) => {
  // Función para convertir horario string a objeto
  const parseHorario = (horarioString) => {
    if (horarioString.includes("/")) {
      const [entrada, salida] = horarioString.split("/");
      return {
        entrada: { hora: entrada, status: "normal" },
        salida: { hora: salida, status: "normal" },
      };
    } else {
      // Para casos como "RETARDO", "FALTA", etc.
      return {
        entrada: { hora: "--", status: horarioString.toLowerCase() },
        salida: { hora: "--", status: horarioString.toLowerCase() },
      };
    }
  };

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
              {/* Generar columnas para cada día (Entrada y Salida) */}
              {dias.map((dia, index) => (
                <React.Fragment key={index}>
                  <th
                    style={{
                      minWidth: "70px",
                      padding: "8px 4px",
                      border: "1px solid #e0e0e0",
                      fontWeight: "bold",
                      textAlign: "center",
                      fontSize: "11px",
                      backgroundColor: "#f8f9fa",
                    }}
                  >
                    <div style={{ fontWeight: "bold" }}>{dia.dia}</div>
                    <div style={{ fontSize: "10px", marginTop: "2px" }}>
                      {dia.fecha}
                    </div>
                    <div
                      style={{
                        fontSize: "10px",
                        color: "#666",
                        marginTop: "1px",
                      }}
                    >
                      Entrada
                    </div>
                  </th>
                  <th
                    style={{
                      minWidth: "70px",
                      padding: "8px 4px",
                      border: "1px solid #e0e0e0",
                      fontWeight: "bold",
                      textAlign: "center",
                      fontSize: "11px",
                      backgroundColor: "#f8f9fa",
                    }}
                  >
                    <div style={{ fontWeight: "bold" }}>{dia.dia}</div>
                    <div style={{ fontSize: "10px", marginTop: "2px" }}>
                      {dia.fecha}
                    </div>
                    <div
                      style={{
                        fontSize: "10px",
                        color: "#666",
                        marginTop: "1px",
                      }}
                    >
                      Salida
                    </div>
                  </th>
                </React.Fragment>
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

                {/* Generar celdas para cada día */}
                {horarios[empleado.id].map((horarioString, diaIndex) => {
                  const horarioData = parseHorario(horarioString);

                  return (
                    <React.Fragment key={diaIndex}>
                      {/* Celda de Entrada */}
                      <EditableCell
                        horario={{
                          ...horarioData.entrada,
                          status: getCellStatus(
                            empleado.id,
                            diaIndex,
                            "entrada"
                          ),
                        }}
                        employeeId={empleado.id}
                        dayIndex={diaIndex}
                        type="entrada"
                        onStatusChange={onStatusChange}
                      />

                      {/* Celda de Salida */}
                      <EditableCell
                        horario={{
                          ...horarioData.salida,
                          status: getCellStatus(
                            empleado.id,
                            diaIndex,
                            "salida"
                          ),
                        }}
                        employeeId={empleado.id}
                        dayIndex={diaIndex}
                        type="salida"
                        onStatusChange={onStatusChange}
                      />
                    </React.Fragment>
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
