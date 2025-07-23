import React from "react";

// Datos centralizados desde testData
import { testData } from "../data/testData";

// Hook personalizado
import { useWeekAttendance } from "../hooks/useWeekAttendance";

// Componentes de UI
import { AttendanceTable } from "./ui/AttendanceTable";
import { CountersTable } from "./ui/CountersTable";
import { TabsContainer } from "./ui/TabsContainer";

export const AttendanceSystemCVV = () => {
  // Usar el hook personalizado para manejar toda la lógica
  const {
    // Datos de la semana actual
    currentDays,
    empleadosNormalizados,
    horarios,

    // Estado de las celdas
    cellStatuses,

    // Funciones de navegación
    handleWeekChange,
    getCurrentWeekDisplay,

    // Funciones de manejo de status y tiempo
    handleStatusChange,
    handleTimeChange,
    getCellStatus,

    // Debug info
    debugInfo,
  } = useWeekAttendance(testData.attendanceData.employees);

  // Log de debug (opcional)
  console.log("AttendanceSystemCVV - Debug:", debugInfo);

  return (
    <div style={styleMainContainer}>
      {/* Container de tabs con selector de semana */}
      <TabsContainer
        currentWeek={getCurrentWeekDisplay()}
        onWeekChange={handleWeekChange}
      >
        {/* TAB 1 - Asistencia */}
        <AttendanceTable
          empleados={empleadosNormalizados}
          dias={currentDays}
          horarios={horarios}
          cellStatuses={cellStatuses}
          onStatusChange={handleStatusChange}
          onTimeChange={handleTimeChange}
          getCellStatus={getCellStatus}
        />

        {/* TAB 2 - Contadores */}
        <CountersTable
          empleados={empleadosNormalizados}
          cellStatuses={cellStatuses}
          dias={currentDays}
        />
      </TabsContainer>
    </div>
  );
};

const styleMainContainer = {
  backgroundColor: "#f5f5f5",
  minHeight: "100vh",
  padding: "24px",
  fontFamily: "system-ui, -apple-system, sans-serif",
};
