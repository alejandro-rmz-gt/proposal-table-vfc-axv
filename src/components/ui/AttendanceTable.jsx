import React, { useState } from "react";
import { Business, Person } from "@mui/icons-material";
import { EditableCell } from "./utils-table/EditableCell";
import { StatusMenu } from "./utils-table/StatusMenu";

export const AttendanceTable = ({
  empleados,
  dias,
  horarios,
  cellStatuses,
  onStatusChange,
  onTimeChange,
  getCellStatus,
  esGerente = false,
}) => {
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    employeeId: null,
    dayIndex: null,
    type: null,
    currentStatus: null,
  });

  const parseHorario = (horarioString) => {
    if (horarioString.includes("/")) {
      const [entrada, salida] = horarioString.split("/");
      return {
        entrada: { hora: entrada, status: "normal" },
        salida: { hora: salida, status: "normal" },
      };
    } else {
      return {
        entrada: { hora: "--", status: horarioString.toLowerCase() },
        salida: { hora: "--", status: horarioString.toLowerCase() },
      };
    }
  };

  const handleContextMenuOpen = (menuData) => {
    setContextMenu(menuData);
  };

  const handleContextMenuClose = () => {
    setContextMenu({
      visible: false,
      x: 0,
      y: 0,
      employeeId: null,
      dayIndex: null,
      type: null,
      currentStatus: null,
    });
  };

  const handleStatusSelect = (newStatus) => {
    if (
      contextMenu.employeeId &&
      contextMenu.dayIndex !== null &&
      contextMenu.type
    ) {
      onStatusChange(
        contextMenu.employeeId,
        contextMenu.dayIndex,
        contextMenu.type,
        newStatus
      );
    }
    handleContextMenuClose();
  };

  return (
    <div style={styleWrapper}>
      <div style={styleScrollContainer}>
        <table style={styleTable}>
          <thead style={styleThead}>
            <tr>
              <th style={styleThPlaza}>
                <div style={styleThLabel}>
                  <Business sx={{ fontSize: 16 }} />
                  Plaza
                </div>
              </th>
              <th style={styleThEmpleado}>
                <div style={styleThLabel}>
                  <Person sx={{ fontSize: 16 }} />
                  Empleado
                </div>
              </th>
              {dias.map((dia, index) => (
                <React.Fragment key={index}>
                  <th style={styleThDia}>
                    <div style={styleDiaTitulo}>{dia.dia}</div>
                    <div style={styleDiaFecha}>{dia.fecha}</div>
                    <div style={styleDiaTipo}>Entrada</div>
                  </th>
                  <th style={styleThDia}>
                    <div style={styleDiaTitulo}>{dia.dia}</div>
                    <div style={styleDiaFecha}>{dia.fecha}</div>
                    <div style={styleDiaTipo}>Salida</div>
                  </th>
                </React.Fragment>
              ))}
            </tr>
          </thead>
          <tbody>
            {empleados.map((empleado, index) => {
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
                  {horarios[empleado.id].map((horarioString, diaIndex) => {
                    const horarioData = parseHorario(horarioString);

                    return (
                      <React.Fragment key={diaIndex}>
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
                          onTimeChange={onTimeChange}
                          onContextMenuOpen={handleContextMenuOpen}
                          esGerente={esGerente}
                        />
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
                          onTimeChange={onTimeChange}
                          onContextMenuOpen={handleContextMenuOpen}
                          esGerente={esGerente}
                        />
                      </React.Fragment>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* StatusMenu renderizado fuera de la tabla */}
      {contextMenu.visible && (
        <StatusMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onStatusSelect={handleStatusSelect}
          onClose={handleContextMenuClose}
          currentStatus={contextMenu.currentStatus}
        />
      )}
    </div>
  );
};

const styleWrapper = {
  backgroundColor: "white",
  borderRadius: "8px",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  overflow: "hidden",
};

const styleScrollContainer = {
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

const styleThPlaza = {
  minWidth: "80px",
  padding: "16px 12px",
  border: "1px solid #e0e0e0",
  fontWeight: "bold",
  textAlign: "left",
  backgroundColor: "#f8f9fa",
};

const styleThEmpleado = {
  minWidth: "200px",
  padding: "16px 12px",
  border: "1px solid #e0e0e0",
  fontWeight: "bold",
  textAlign: "left",
  backgroundColor: "#f8f9fa",
};

const styleThDia = {
  minWidth: "70px",
  padding: "8px 4px",
  border: "1px solid #e0e0e0",
  fontWeight: "bold",
  textAlign: "center",
  fontSize: "11px",
  backgroundColor: "#f8f9fa",
};

const styleThLabel = {
  display: "flex",
  alignItems: "center",
  gap: "6px",
};

const styleDiaTitulo = {
  fontWeight: "bold",
};

const styleDiaFecha = {
  fontSize: "10px",
  marginTop: "2px",
};

const styleDiaTipo = {
  fontSize: "10px",
  color: "#666",
  marginTop: "1px",
};

const styleTd = {
  padding: "12px",
  border: "1px solid #e0e0e0",
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
