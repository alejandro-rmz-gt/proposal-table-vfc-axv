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
import { TabsContainer } from "./ui/TabsContainer";

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

        {/* Sistema de tabs */}
        <TabsContainer>
          {/* Tab 1: Tabla de Asistencias */}
          <div style={{ padding: "0" }}>
            <AttendanceTable
              empleados={empleados}
              dias={dias}
              horarios={horarios}
            />
          </div>

          {/* Tab 2: Tabla de Contadores */}
          <div
            style={{
              padding: "40px",
              textAlign: "center",
              color: "#666",
              fontSize: "16px",
            }}
          >
            <h2>En construccíon</h2>
          </div>
        </TabsContainer>
      </div>
    </div>
  );
};
