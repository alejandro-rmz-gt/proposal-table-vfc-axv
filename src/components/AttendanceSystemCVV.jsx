import React from "react";

// data
import { empleados } from "../data/empleados";
import { dias } from "../data/dias";
import { horarios } from "../data/horarios";

// Components
import { Header } from "./ui/Header";
import { StatsDashboard } from "./ui/StatsDashboard";
import { Legend } from "./ui/Legend";
import { AttendanceTable } from "./ui/AttendanceTable";

const container = {
  backgroundColor: "#f5f5f5",
  minHeight: "100vh",
  fontFamily: "system-ui, -apple-system, sans-serif",
};

const stylesSubContainer = {
  maxWidth: "1400px",
  margin: "0 auto",
  padding: "24px",
};

export const AttendanceSystemCVV = () => {
  return (
    <div style={container}>
      <Header />

      <div style={stylesSubContainer}>
        <StatsDashboard />

        <Legend />

        <AttendanceTable
          empleados={empleados}
          dias={dias}
          horarios={horarios}
        />
      </div>
    </div>
  );
};
