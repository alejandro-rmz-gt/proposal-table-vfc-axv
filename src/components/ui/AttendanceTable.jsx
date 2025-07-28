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
  // Obtener la plaza (asumiendo que todos los empleados son de la misma plaza)
  const plaza = empleados.length > 0 ? empleados[0].plaza : "Sin Plaza";
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    employeeId: null,
    dayIndex: null,
    type: null,
    currentStatus: null,
  });

  // Ya no necesitamos agrupar por plaza

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
      {/* Header de Plaza */}
      <div style={stylePlazaHeader}>
        <Business sx={{ fontSize: 18, marginRight: "8px", color: "#1976d2" }} />
        <span style={stylePlazaTitle}>Plaza: {plaza}</span>
      </div>

      <div style={styleScrollContainer}>
        <table style={styleTable}>
          <thead style={styleThead}>
            <tr>
              <th style={styleThEmpleado}>
                <div style={styleThLabel}>
                  <Person sx={{ fontSize: 14 }} />
                  Empleado
                </div>
              </th>
              {dias.map((dia, index) => (
                <React.Fragment key={index}>
                  <th style={styleThDia}>
                    <div style={styleDiaTitulo}>{dia.dia}</div>
                    <div style={styleDiaFecha}>{dia.fecha}</div>
                    <div style={styleDiaTipo}>E</div>
                  </th>
                  <th style={styleThDia}>
                    <div style={styleDiaTitulo}>{dia.dia}</div>
                    <div style={styleDiaFecha}>{dia.fecha}</div>
                    <div style={styleDiaTipo}>S</div>
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
                  <td style={styleTdEmpleado}>
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
  fontSize: "12px",
};

const styleThead = {
  backgroundColor: "#f8f9fa",
  position: "sticky",
  top: 0,
  zIndex: 1,
};

const styleThEmpleado = {
  minWidth: "160px",
  padding: "10px 8px",
  border: "1px solid #e0e0e0",
  fontWeight: "bold",
  textAlign: "left",
  backgroundColor: "#f8f9fa",
  fontSize: "12px",
};

const styleThDia = {
  minWidth: "50px",
  padding: "6px 3px",
  border: "1px solid #e0e0e0",
  fontWeight: "bold",
  textAlign: "center",
  fontSize: "10px",
  backgroundColor: "#f8f9fa",
};

const styleThLabel = {
  display: "flex",
  alignItems: "center",
  gap: "4px",
};

const styleDiaTitulo = {
  fontWeight: "bold",
  fontSize: "10px",
};

const styleDiaFecha = {
  fontSize: "9px",
  marginTop: "1px",
  color: "#666",
};

const styleDiaTipo = {
  fontSize: "9px",
  color: "#888",
  marginTop: "1px",
  fontWeight: "600",
};

const styleTdEmpleado = {
  padding: "8px",
  border: "1px solid #e0e0e0",
  verticalAlign: "middle",
};

const styleNombre = {
  fontWeight: "500",
  fontSize: "12px",
  lineHeight: "1.2",
};

// Estilos para el header de plaza
const stylePlazaHeader = {
  backgroundColor: "#1976d2",
  color: "white",
  padding: "12px 16px",
  display: "flex",
  alignItems: "center",
};

const stylePlazaTitle = {
  fontSize: "16px",
  fontWeight: "600",
};
