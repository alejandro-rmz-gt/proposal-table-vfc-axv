import React, { useState } from "react";
import { getCellStyle } from "../../../utils/getCellStyle.js";
import { getCellIcon } from "../../../utils/getCellIcon.jsx";
import { StatusMenu } from "./StatusMenu.jsx";

export const EditableCell = ({
  horario,
  employeeId,
  dayIndex,
  type,
  onStatusChange,
}) => {
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
  });

  const [hovering, setHovering] = useState(false);
  const currentStatus = horario.status || "normal";

  const handleContextMenu = (e) => {
    e.preventDefault();
    setContextMenu({ visible: true, x: e.clientX, y: e.clientY });
  };

  const handleDoubleClick = (e) => {
    setContextMenu({ visible: true, x: e.clientX, y: e.clientY });
  };

  const handleCloseMenu = () => {
    setContextMenu({ ...contextMenu, visible: false });
  };

  const handleStatusSelect = (newStatus) => {
    handleCloseMenu();
    if (onStatusChange) {
      onStatusChange(employeeId, dayIndex, type, newStatus);
    }
  };

  const cellStyle = getCellStyle(currentStatus);
  const icon = getCellIcon(currentStatus);

  const getDisplayContent = () =>
    currentStatus === "normal" ? horario.hora : currentStatus.toUpperCase();

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
        style={{ ...styleCell, ...cellStyle }}
        title={getTooltip()}
      >
        <div style={styleInner}>
          {icon && <div style={styleIconContainer}>{icon}</div>}
          <div style={styleContent}>{getDisplayContent()}</div>
          <div style={styleSubLabel}>{type === "entrada" ? "E" : "S"}</div>
        </div>
      </td>

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

const styleContent = {
  fontSize: "10px",
  fontWeight: "bold",
  textAlign: "center",
};

const styleSubLabel = {
  fontSize: "8px",
  color: "#666",
  opacity: 0.7,
};
