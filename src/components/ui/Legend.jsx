// components/ui/Legend.jsx
import React from "react";
import {
  Assessment,
  CheckCircle,
  Warning,
  Error,
  Assignment,
  Event,
} from "@mui/icons-material";
import { LegendItem } from "./LegendItem";

export const Legend = () => {
  return (
    <div
      style={{
        backgroundColor: "white",
        marginBottom: "24px",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      <h3
        style={{
          margin: "0 0 16px 0",
          fontSize: "18px",
          color: "#333",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <Assessment sx={{ fontSize: 20 }} />
        Leyenda de Incidencias
      </h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
        <LegendItem
          icon={CheckCircle}
          label="Normal"
          backgroundColor="#4CAF5040"
          borderColor="#4CAF50"
          iconColor="#4CAF50"
        />
        <LegendItem
          icon={Warning}
          label="Retardo"
          backgroundColor="#FFC00040"
          borderColor="#FFC000"
          iconColor="#FFC000"
        />
        <LegendItem
          icon={Error}
          label="Baja/Falta"
          backgroundColor="#C55A1140"
          borderColor="#C55A11"
          iconColor="#C55A11"
        />
        <LegendItem
          icon={Assignment}
          label="Permiso/Lactancia"
          backgroundColor="#FF99CC40"
          borderColor="#FF99CC"
          iconColor="#FF99CC"
        />
        <LegendItem
          icon={Event}
          label="Vacaciones"
          backgroundColor="#FFFF0040"
          borderColor="#FFFF00"
          iconColor="#FFFF00"
        />
      </div>
    </div>
  );
};
