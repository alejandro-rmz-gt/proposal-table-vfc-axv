// components/ui/table/EditableCell.jsx
import React, { useState } from "react";
import { getCellStyle } from "../../../utils/getCellStyle.js";
import { getCellIcon } from "../../../utils/getCellIcon.jsx";
import { StatusMenu } from "./StatusMenu";

export const EditableCell = ({
  horario,
  employeeId,
  dayIndex,
  type, // 'entrada' o 'salida'
  onStatusChange,
}) => {
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
  });

  const [hovering, setHovering] = useState(false);

  // Usar el status del prop horario
  const currentStatus = horario.status || "normal";

  // Manejar clic derecho
  const handleContextMenu = (e) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
    });
  };

  // Manejar doble clic
  const handleDoubleClick = (e) => {
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
    });
  };

  // Cerrar menú contextual
  const handleCloseMenu = () => {
    setContextMenu({ ...contextMenu, visible: false });
  };

  // Cambiar estatus
  const handleStatusSelect = (newStatus) => {
    handleCloseMenu();

    // Callback para notificar al componente padre
    if (onStatusChange) {
      onStatusChange(employeeId, dayIndex, type, newStatus);
    }
  };

  // Obtener estilos y icono basado en el status actual
  const cellStyle = getCellStyle(currentStatus);
  const icon = getCellIcon(currentStatus);

  // Determinar qué mostrar en la celda
  const getDisplayContent = () => {
    if (currentStatus === "normal") {
      return horario.hora;
    } else {
      return currentStatus.toUpperCase();
    }
  };

  // Tooltip solo si no es normal y tiene hora
  const getTooltip = () => {
    if (hovering && currentStatus !== "normal" && horario.hora !== "--") {
      return `Hora original: ${horario.hora}`;
    }
    return "";
  };

  return (
    <>
      <td
        onContextMenu={handleContextMenu}
        onDoubleClick={handleDoubleClick}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        style={{
          minWidth: "70px",
          height: "70px",
          textAlign: "center",
          padding: "4px",
          verticalAlign: "middle",
          fontSize: "11px",
          cursor: "pointer",
          position: "relative",
          transition: "all 0.2s ease",
          ...cellStyle,
        }}
        title={getTooltip()}
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
            <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
              {icon}
            </div>
          )}
          <div
            style={{
              fontSize: "10px",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            {getDisplayContent()}
          </div>
          <div
            style={{
              fontSize: "8px",
              color: "#666",
              opacity: 0.7,
            }}
          >
            {type === "entrada" ? "E" : "S"}
          </div>
        </div>
      </td>

      {/* Menú contextual */}
      {contextMenu.visible && (
        <StatusMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onStatusSelect={handleStatusSelect}
          onClose={handleCloseMenu}
          currentStatus={currentStatus}
        />
      )}
    </>
  );
};
