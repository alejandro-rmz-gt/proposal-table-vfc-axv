import React, { useState } from "react";
import { Business, Person } from "@mui/icons-material";
import { EditableCell } from "./utils-table/EditableCell";
import { StatusMenu } from "./utils-table/StatusMenu";
import { ExportButton } from "./utils-table/ExportButton";

export const AttendanceTable = ({
  empleados,
  dias,
  horarios,
  cellStatuses,
  onStatusChange,
  onTimeChange,
  getCellStatus,
  esGerente = false,
  // Nuevas props para exportación
  currentRangeStart,
  currentRangeEnd,
  exportFilename = "Asistencias",
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

  // Función para preparar datos para exportación
  const prepareDataForExport = () => {
    const exportData = [];

    empleados.forEach((empleado) => {
      const row = {
        Empleado: empleado.nombre,
        Plaza: empleado.plaza,
      };

      // Agregar columnas para cada día con formato más claro
      dias.forEach((dia, diaIndex) => {
        const horarioString = horarios[empleado.id][diaIndex];
        const horarioData = parseHorario(horarioString);

        // Obtener status actual de las celdas
        const entradaStatus = getCellStatus(empleado.id, diaIndex, "entrada");
        const salidaStatus = getCellStatus(empleado.id, diaIndex, "salida");

        // Formatear la fecha de manera más legible
        const fechaLegible = `${dia.dia} ${dia.fecha}`;

        // Si ambos tienen el mismo status especial, mostrar solo el status
        if (entradaStatus === salidaStatus && entradaStatus !== "normal") {
          row[`${fechaLegible} - Entrada`] = entradaStatus.toUpperCase();
          row[`${fechaLegible} - Salida`] = entradaStatus.toUpperCase();
        } else {
          // Mostrar horarios normales o con status
          const entradaText =
            entradaStatus === "normal"
              ? horarioData.entrada.hora
              : horarioData.entrada.hora === "--"
              ? entradaStatus.toUpperCase()
              : `${horarioData.entrada.hora} (${entradaStatus.toUpperCase()})`;

          const salidaText =
            salidaStatus === "normal"
              ? horarioData.salida.hora
              : horarioData.salida.hora === "--"
              ? salidaStatus.toUpperCase()
              : `${horarioData.salida.hora} (${salidaStatus.toUpperCase()})`;

          row[`${fechaLegible} - Entrada`] = entradaText;
          row[`${fechaLegible} - Salida`] = salidaText;
        }
      });

      exportData.push(row);
    });

    return exportData;
  };

  // Preparar metadatos para la exportación
  const getExportMetadata = () => {
    const startDate = currentRangeStart
      ? currentRangeStart.toLocaleDateString("es-ES")
      : "";
    const endDate = currentRangeEnd
      ? currentRangeEnd.toLocaleDateString("es-ES")
      : "";

    return {
      title: `Reporte de Asistencias - Plaza ${plaza}`,
      subject: `Asistencias del ${startDate} al ${endDate}`,
      author: "Sistema de Asistencias CVV",
      description: `Reporte generado para ${empleados.length} empleados`,
    };
  };

  // Generar nombre de archivo dinámico (sin timestamp automático)
  const getExportFilename = () => {
    const startDate = currentRangeStart
      ? currentRangeStart.toLocaleDateString("es-ES").replace(/\//g, "-")
      : "";
    const endDate = currentRangeEnd
      ? currentRangeEnd.toLocaleDateString("es-ES").replace(/\//g, "-")
      : "";

    const timestamp = new Date()
      .toLocaleString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
      .replace(/[/:]/g, "-")
      .replace(", ", "_");

    return `${exportFilename}_${startDate}_al_${endDate}_${timestamp}`;
  };

  // Callbacks para exportación
  const handleExportSuccess = (result, format) => {
    console.log(
      `✅ Exportación exitosa en formato ${format.toUpperCase()}:`,
      result
    );
  };

  const handleExportError = (error, format) => {
    console.error(
      `❌ Error exportando en formato ${format.toUpperCase()}:`,
      error
    );
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
      {/* Header de Plaza con botón de exportación */}
      <div style={stylePlazaHeader}>
        <div style={stylePlazaInfo}>
          <Business sx={{ fontSize: 18, marginRight: "8px", color: "white" }} />
          <span style={stylePlazaTitle}>Plaza: {plaza}</span>
          <span style={stylePlazaSubtitle}>
            {empleados.length} empleado{empleados.length !== 1 ? "s" : ""} •
            {dias.length} día{dias.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Botón de exportación */}
        <div style={styleExportContainer}>
          <ExportButton
            data={prepareDataForExport()}
            filename={getExportFilename()}
            formats={["xlsx", "csv", "pdf"]}
            metadata={getExportMetadata()}
            title="Exportar"
            size="medium"
            variant="contained"
            customStyles={{
              button: {
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                color: "white",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                backdropFilter: "blur(10px)",
              },
              container: {
                zIndex: 10,
              },
            }}
            onSuccess={handleExportSuccess}
            onError={handleExportError}
            onExportStart={(format) => {
              console.log(
                `🚀 Iniciando exportación en formato ${format.toUpperCase()}...`
              );
            }}
          />
        </div>
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

// Estilos existentes
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

// Estilos modificados para el header de plaza
const stylePlazaHeader = {
  backgroundColor: "#1976d2",
  color: "white",
  padding: "12px 16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between", // Cambio para distribuir espacio
};

// Nuevos estilos
const stylePlazaInfo = {
  display: "flex",
  alignItems: "center",
  flex: 1,
};

const stylePlazaTitle = {
  fontSize: "16px",
  fontWeight: "600",
  marginRight: "12px",
};

const stylePlazaSubtitle = {
  fontSize: "12px",
  opacity: 0.8,
  fontWeight: "normal",
};

const styleExportContainer = {
  display: "flex",
  alignItems: "center",
};
