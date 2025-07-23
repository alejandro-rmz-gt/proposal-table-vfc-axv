import React, { useState } from "react";

// data
import { empleados } from "../data/empleados";
import { dias } from "../data/dias";
import { horarios } from "../data/horarios";

// Components
import { AttendanceTable } from "./ui/AttendanceTable";
import { CountersTable } from "./ui/CountersTable";
import { TabsContainer } from "./ui/TabsContainer";

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
    <TabsContainer>
      {/* Tab 1: Tabla de Asistencias */}
      <AttendanceTable
        empleados={empleados}
        dias={dias}
        horarios={horarios}
        cellStatuses={cellStatuses}
        onStatusChange={handleStatusChange}
        getCellStatus={getCellStatus}
      />

      {/* Tab 2: Tabla de Contadores */}
      <CountersTable
        empleados={empleados}
        cellStatuses={cellStatuses}
        dias={dias}
      />
    </TabsContainer>
  );
};
