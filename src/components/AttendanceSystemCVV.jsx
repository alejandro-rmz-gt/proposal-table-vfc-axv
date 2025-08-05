import React, { useState } from "react";

// Datos centralizados desde testData
import { testData } from "../data/testData";

// Hook personalizado
import { useWeekAttendance } from "../hooks/useWeekAttendance";
import { useExportAttendance } from "../hooks/useExportAttendance";

// Componentes de UI
import { AttendanceTable } from "./ui/AttendanceTable";
import { CountersTable } from "./ui/CountersTable";
import { TabsContainer } from "./ui/TabsContainer";
import { WeekPickerCalendar } from "./ui/utils-table/WeekPickerCalendar";

export const AttendanceSystemCVV = () => {
  // Estado para determinar si el usuario es gerente
  const [esGerente, setEsGerente] = useState(false);
  
  // Estado para controlar la tab activa
  const [activeTab, setActiveTab] = useState(0);

  // Hook para exportación
  const { exportToExcel, exportBothTabs } = useExportAttendance();

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

  // Funciones de exportación
  const handleExportCurrent = (tabIndex = activeTab) => {
    const result = exportToExcel(
      empleadosNormalizados,
      currentDays,
      horarios,
      cellStatuses,
      getCellStatus,
      tabIndex
    );
    
    if (result.success) {
      // Mostrar notificación de éxito (puedes reemplazar con tu sistema de notificaciones)
      console.log(`✅ Exportación exitosa: ${result.fileName}`);
      // Aquí puedes agregar una notificación visual si tienes un sistema de toast/alerts
    } else {
      console.error(`❌ Error en exportación: ${result.error}`);
      // Aquí puedes mostrar un mensaje de error al usuario
    }
  };

  const handleExportAll = () => {
    const result = exportBothTabs(
      empleadosNormalizados,
      currentDays,
      horarios,
      cellStatuses,
      getCellStatus
    );
    
    if (result.success) {
      console.log(`✅ Exportación completa exitosa: ${result.fileName}`);
    } else {
      console.error(`❌ Error en exportación completa: ${result.error}`);
    }
  };

  // Log de debug (opcional)
  console.log("AttendanceSystemCVV - Debug:", debugInfo);
  console.log("Es Gerente:", esGerente);

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
      </div>

      {/* Container de tabs con selector de semana y exportación */}
      <TabsContainer
        currentWeek={getCurrentWeekDisplay()}
        onWeekChange={handleWeekChange}
        onExportCurrent={handleExportCurrent}
        onExportAll={handleExportAll}
        activeTab={activeTab}
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
        />

        {/* TAB 2 - Contadores */}
        <CountersTable
          empleados={empleadosNormalizados}
          cellStatuses={cellStatuses}
          dias={currentDays}
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