// utils/formatHorario.jsx
import React from "react";

export const formatHorario = (valor) => {
  if (valor.includes("/")) {
    const [entrada, salida] = valor.split("/");
    return (
      <div>
        <div style={{ fontWeight: "bold", color: "#1976d2", fontSize: "11px" }}>
          {entrada}
        </div>
        <div style={{ color: "#666", fontSize: "11px" }}>{salida}</div>
        <div style={{ color: "#4caf50", fontSize: "10px" }}>8.2h</div>
      </div>
    );
  }
  return valor;
};
