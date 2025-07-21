import React, { useState } from "react";

// data
import { empleados } from "../data/empleados";
import { dias } from "../data/dias";
import { horarios } from "../data/horarios";

// Components
import { Header } from "./ui/Header";
import { StatsDashboard } from "./ui/StatsDashboard";
import { Legend } from "./ui/Legend";
import { AttendanceTable } from "./ui/AttendanceTable";
import { CountersTable } from "./ui/CountersTable";
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
  // Estado compartido para los cambios de estatus de las celdas
  const [cellStatuses, setCellStatuses] = useState({});

  // Función para manejar cambios de estatus desde AttendanceTable
  const handleStatusChange = (employeeId, dayIndex, type, newStatus) => {
    const key = `${employeeId}-${dayIndex}-${type}`;
    setCellStatuses((prev) => ({
      ...prev,
      [key]: newStatus,
    }));

    console.log(
      `Cambio: Empleado ${employeeId}, Día ${dayIndex}, Tipo ${type}, Nuevo estatus: ${newStatus}`
    );
  };

  // Función para obtener estatus de una celda
  const getCellStatus = (employeeId, dayIndex, type) => {
    const key = `${employeeId}-${dayIndex}-${type}`;
    return cellStatuses[key] || "normal";
  };

  return (
    <div style={container}>
      <Header />

      <div style={stylesSubContainer}>
        <StatsDashboard />
        <Legend />

        {/* Sistema de tabs con ambas tablas */}
        <TabsContainer>
          {/* Tab 1: Tabla de Asistencias */}
          <div style={{ padding: "0" }}>
            <AttendanceTable
              empleados={empleados}
              dias={dias}
              horarios={horarios}
              cellStatuses={cellStatuses}
              onStatusChange={handleStatusChange}
              getCellStatus={getCellStatus}
            />
          </div>

          {/* Tab 2: Tabla de Contadores */}
          <div style={{ padding: "0" }}>
            <CountersTable
              empleados={empleados}
              cellStatuses={cellStatuses}
              dias={dias}
            />
          </div>
        </TabsContainer>
      </div>
    </div>
  );
};
