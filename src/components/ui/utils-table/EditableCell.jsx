import React, { useState } from "react";
import { getCellStyle } from "../../../utils/getCellStyle.js";
import { getCellIcon } from "../../../utils/getCellIcon.jsx";
import { TimeEditor } from "./TimeEditor.jsx";

export const EditableCell = ({
  horario,
  employeeId,
  dayIndex,
  type,
  onStatusChange,
  onTimeChange, // Nueva prop para cambios de hora
  onContextMenuOpen,
}) => {
  const [isEditingTime, setIsEditingTime] = useState(false);
  const [hovering, setHovering] = useState(false);
  const currentStatus = horario.status || "normal";
  const currentTime = horario.hora || "--";

  // Manejar clic izquierdo para editar hora
  const handleLeftClick = (e) => {
    e.preventDefault();
    setIsEditingTime(true);
  };

  // Manejar clic derecho para cambiar status
  const handleRightClick = (e) => {
    e.preventDefault();
    if (onContextMenuOpen) {
      onContextMenuOpen({
        visible: true,
        x: e.clientX,
        y: e.clientY,
        employeeId,
        dayIndex,
        type,
        currentStatus,
      });
    }
  };

  // Manejar doble clic para editar hora (alternativo)
  const handleDoubleClick = (e) => {
    e.preventDefault();
    setIsEditingTime(true);
  };

  // Guardar nueva hora
  const handleTimeSave = (newTime) => {
    setIsEditingTime(false);
    if (onTimeChange && newTime !== currentTime) {
      onTimeChange(employeeId, dayIndex, type, newTime);
    }
  };

  // Cancelar edición de hora
  const handleTimeCancel = () => {
    setIsEditingTime(false);
  };

  const cellStyle = getCellStyle(currentStatus);
  const icon = getCellIcon(currentStatus);

  // Obtener el display de la hora basado en el status
  const getTimeDisplay = () => {
    // Siempre mostrar la hora, independientemente del status
    return currentTime;
  };

  // Obtener el display del status cuando no es normal
  const getStatusDisplay = () => {
    if (currentStatus !== "normal") {
      return currentStatus.toUpperCase();
    }
    return null;
  };

  const getTooltip = () => {
    if (hovering) {
      const parts = [];
      if (currentTime !== "--") {
        parts.push(`Hora: ${currentTime}`);
      }
      if (currentStatus !== "normal") {
        parts.push(`Status: ${currentStatus}`);
      }
      parts.push("Clic izq: editar hora, Clic der: cambiar status");
      return parts.join(" | ");
    }
    return "";
  };

  return (
    <td
      onClick={handleLeftClick}
      onContextMenu={handleRightClick}
      onDoubleClick={handleDoubleClick}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      style={{ ...styleCell, ...cellStyle }}
      title={getTooltip()}
    >
      <div style={styleInner}>
        {/* Ícono del status */}
        {icon && <div style={styleIconContainer}>{icon}</div>}

        {/* Editor de hora o display de hora */}
        <div style={styleTimeContainer}>
          {isEditingTime ? (
            <TimeEditor
              initialTime={currentTime}
              onSave={handleTimeSave}
              onCancel={handleTimeCancel}
              isVisible={isEditingTime}
            />
          ) : (
            <div style={styleTimeDisplay}>{getTimeDisplay()}</div>
          )}
        </div>

        {/* Display del status cuando no es normal */}
        {getStatusDisplay() && (
          <div style={styleStatusDisplay}>{getStatusDisplay()}</div>
        )}

        {/* Etiqueta de entrada/salida */}
        <div style={styleSubLabel}>{type === "entrada" ? "E" : "S"}</div>
      </div>
    </td>
  );
};

const styleCell = {
  minWidth: "70px",
  height: "70px",
  textAlign: "center",
  padding: "4px",
  verticalAlign: "middle",
  fontSize: "11px",
  cursor: "pointer",
  position: "relative",
  transition: "all 0.2s ease",
};

const styleInner = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  gap: "2px",
};

const styleIconContainer = {
  display: "flex",
  alignItems: "center",
  gap: "2px",
};

const styleTimeContainer = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "20px",
};

const styleTimeDisplay = {
  fontSize: "10px",
  fontWeight: "bold",
  textAlign: "center",
  minWidth: "45px",
  padding: "2px",
  borderRadius: "3px",
  backgroundColor: "rgba(255, 255, 255, 0.7)",
  border: "1px solid transparent",
};

const styleStatusDisplay = {
  fontSize: "8px",
  fontWeight: "bold",
  color: "rgba(0, 0, 0, 0.7)",
  textAlign: "center",
  backgroundColor: "rgba(255, 255, 255, 0.8)",
  padding: "1px 4px",
  borderRadius: "2px",
  border: "1px solid rgba(0, 0, 0, 0.1)",
};

const styleSubLabel = {
  fontSize: "8px",
  color: "#666",
  opacity: 0.7,
  fontWeight: "bold",
};
