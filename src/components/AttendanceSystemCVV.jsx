import React, { useState } from "react";

// Datos centralizados desde testData
import { testData } from "../data/testData";

// Hook personalizado
import { useWeekAttendance } from "../hooks/useWeekAttendance";

// Componentes de UI
import { AttendanceTable } from "./ui/AttendanceTable";
import { CountersTable } from "./ui/CountersTable";
import { TabsContainer } from "./ui/TabsContainer";
import { WeekPickerCalendar } from "./ui/utils-table/WeekPickerCalendar";

export const AttendanceSystemCVV = () => {
  // Estado para determinar si el usuario es gerente
  const [esGerente, setEsGerente] = useState(false); // Cambiar a true para probar modo gerente

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

    // Funciones del selector de fechas
    handleRangeSelect,
    handleCloseWeekPicker,
    showWeekPicker,
    weekPickerPosition,
    currentRangeStart,
    currentRangeEnd,

    // Funciones de manejo de status y tiempo
    handleStatusChange,
    handleTimeChange,
    getCellStatus,

    // Debug info
    debugInfo,
  } = useWeekAttendance(testData.attendanceData.employees);

  // Función para generar nombre de archivo dinámico para exportación
  const getExportFilename = () => {
    const startDate = currentRangeStart
      ? currentRangeStart.toLocaleDateString("es-ES").replace(/\//g, "-")
      : "";
    const endDate = currentRangeEnd
      ? currentRangeEnd.toLocaleDateString("es-ES").replace(/\//g, "-")
      : "";

    return `Asistencias_CVV20_${startDate}_${endDate}`;
  };

  // Log de debug (opcional)
  console.log("AttendanceSystemCVV - Debug:", debugInfo);
  console.log("Es Gerente:", esGerente);
  console.log("Rango actual:", {
    inicio: currentRangeStart?.toLocaleDateString("es-ES"),
    fin: currentRangeEnd?.toLocaleDateString("es-ES"),
    totalDias: currentDays.length,
    totalEmpleados: empleadosNormalizados.length,
  });

  return (
    <div style={styleMainContainer}>
      {/* Botón temporal para cambiar modo gerente */}
      <div style={styleDebugContainer}>
        <button
          onClick={() => setEsGerente(!esGerente)}
          style={styleDebugButton}
        >
          {esGerente ? "Modo Gerente (ON)" : "Modo Usuario (OFF)"}
        </button>
        <span style={styleDebugLabel}>
          {esGerente ? "Puedes editar horas" : "Solo puedes cambiar status"}
        </span>

        {/* Info adicional para debug de exportación */}
        <div style={styleDebugInfo}>
          <span style={styleDebugInfoText}>
            📊 {empleadosNormalizados.length} empleados • 📅{" "}
            {currentDays.length} días • 📋 {Object.keys(cellStatuses).length}{" "}
            estados
          </span>
        </div>
      </div>

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
          esGerente={esGerente}
          // 🆕 Nuevas props para exportación
          currentRangeStart={currentRangeStart}
          currentRangeEnd={currentRangeEnd}
          exportFilename={getExportFilename()}
        />

        {/* TAB 2 - Contadores */}
        <CountersTable
          empleados={empleadosNormalizados}
          cellStatuses={cellStatuses}
          dias={currentDays}
          // 🆕 Props para exportación también en contadores (opcional)
          currentRangeStart={currentRangeStart}
          currentRangeEnd={currentRangeEnd}
        />
      </TabsContainer>

      {/* Mini calendario para seleccionar rango de fechas */}
      <WeekPickerCalendar
        isVisible={showWeekPicker}
        onClose={handleCloseWeekPicker}
        onRangeSelect={handleRangeSelect}
        currentStartDate={currentRangeStart}
        currentEndDate={currentRangeEnd}
        x={weekPickerPosition.x}
        y={weekPickerPosition.y}
      />
    </div>
  );
};

const styleMainContainer = {
  backgroundColor: "#f5f5f5",
  minHeight: "100vh",
  padding: "24px",
  fontFamily: "system-ui, -apple-system, sans-serif",
};

const styleDebugContainer = {
  backgroundColor: "white",
  padding: "12px 16px",
  borderRadius: "8px",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  marginBottom: "16px",
  display: "flex",
  alignItems: "center",
  gap: "12px",
  flexWrap: "wrap", // Para que se adapte en pantallas pequeñas
};

const styleDebugButton = {
  backgroundColor: "#1976d2",
  color: "white",
  border: "none",
  borderRadius: "6px",
  padding: "8px 16px",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "500",
  transition: "all 0.2s ease",
};

const styleDebugLabel = {
  fontSize: "14px",
  color: "#666",
  fontStyle: "italic",
};

// 🆕 Nuevos estilos para info de debug
const styleDebugInfo = {
  marginLeft: "auto",
  padding: "4px 8px",
  backgroundColor: "#f8f9fa",
  borderRadius: "4px",
  border: "1px solid #e0e0e0",
};

const styleDebugInfoText = {
  fontSize: "12px",
  color: "#666",
  fontWeight: "500",
};
