// components/ui/table/StatusMenu.jsx
import React, { useEffect, useRef } from "react";
import {
  CheckCircle,
  Warning,
  Error,
  Assignment,
  Event,
} from "@mui/icons-material";

export const StatusMenu = ({
  x,
  y,
  onStatusSelect,
  onClose,
  currentStatus,
}) => {
  const menuRef = useRef(null);

  const statusOptions = [
    {
      id: "normal",
      label: "Normal",
      icon: CheckCircle,
      color: "#4CAF50",
    },
    {
      id: "retardo",
      label: "Retardo",
      icon: Warning,
      color: "#FFC000",
    },
    {
      id: "falta",
      label: "Falta",
      icon: Error,
      color: "#C55A11",
    },
    {
      id: "permiso",
      label: "Permiso",
      icon: Assignment,
      color: "#FF99CC",
    },
    {
      id: "vacaciones",
      label: "Vacaciones",
      icon: Event,
      color: "#FFFF00",
    },
  ];

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  // Ajustar posición si se sale de la pantalla
  const adjustedX = Math.min(x, window.innerWidth - 200);
  const adjustedY = Math.min(y, window.innerHeight - 250);

  return (
    <div
      ref={menuRef}
      style={{
        position: "fixed",
        top: adjustedY,
        left: adjustedX,
        backgroundColor: "white",
        border: "1px solid #e0e0e0",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        zIndex: 1000,
        minWidth: "180px",
        padding: "8px 0",
        animation: "fadeIn 0.15s ease-out",
      }}
    >
      {statusOptions.map((option) => {
        const IconComponent = option.icon;
        const isSelected = currentStatus === option.id;

        return (
          <div
            key={option.id}
            onClick={() => onStatusSelect(option.id)}
            style={{
              padding: "10px 16px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              cursor: "pointer",
              backgroundColor: isSelected ? "#f5f5f5" : "transparent",
              borderLeft: isSelected
                ? `3px solid ${option.color}`
                : "3px solid transparent",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#f9f9f9";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = isSelected
                ? "#f5f5f5"
                : "transparent";
            }}
          >
            <IconComponent
              sx={{
                fontSize: 18,
                color: option.color,
              }}
            />
            <span
              style={{
                fontSize: "14px",
                fontWeight: isSelected ? "500" : "normal",
                color: "#333",
                flex: 1,
              }}
            >
              {option.label}
            </span>
            {isSelected && (
              <span
                style={{
                  fontSize: "12px",
                  color: option.color,
                  fontWeight: "bold",
                }}
              >
                ✓
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};
