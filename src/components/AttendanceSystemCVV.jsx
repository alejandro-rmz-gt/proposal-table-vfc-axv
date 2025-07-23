import React, { useState, useEffect } from "react";

// ✅ Datos centralizados desde testData
import { testData } from "../data/testData";

// 🧩 Componentes de UI
import { AttendanceTable } from "./ui/AttendanceTable";
import { CountersTable } from "./ui/CountersTable";
import { TabsContainer } from "./ui/TabsContainer";

// 🛠 Función para transformar datos de asistencia a formato de horarios esperados
export const generateHorarios = (attendanceEmployees) => {
  const horarios = {};

  attendanceEmployees.forEach((empleado) => {
    const horarioPorDia = empleado.records.map((record) => {
      const entrada = record.entrada?.time ?? "--";
      const salida = record.salida?.time ?? "--";

      const entradaStatus = record.entrada?.status;
      const salidaStatus = record.salida?.status;

      // Si no hay hora, usamos el status como referencia
      if (entrada === "--" && salida === "--") {
        // Si entrada y salida tienen el mismo status, lo usamos como "permiso", "vacaciones", etc.
        if (entradaStatus === salidaStatus && entradaStatus !== "normal") {
          return entradaStatus;
        } else {
          return "--/--";
        }
      }

      return `${entrada}/${salida}`;
    });

    // ✅ Usar 'id' para ser consistente
    horarios[empleado.id] = horarioPorDia;
  });

  return horarios;
};

// 🔄 Helper para normalizar la estructura de empleados
const normalizeEmployeesData = (attendanceEmployees) => {
  return attendanceEmployees.map((emp) => ({
    id: emp.id,
    nombre: emp.name, // ✅ Cambiar 'name' a 'nombre' para que coincida con AttendanceTable
    plaza: emp.plaza,
  }));
};

// 🎯 Función para inicializar los status de las celdas desde testData
const initializeCellStatuses = (attendanceEmployees) => {
  const statuses = {};

  attendanceEmployees.forEach((empleado) => {
    empleado.records.forEach((record, dayIndex) => {
      // Status de entrada
      const entradaKey = `${empleado.id}-${dayIndex}-entrada`;
      statuses[entradaKey] = record.entrada?.status || "normal";

      // Status de salida
      const salidaKey = `${empleado.id}-${dayIndex}-salida`;
      statuses[salidaKey] = record.salida?.status || "normal";
    });
  });

  return statuses;
};

export const AttendanceSystemCVV = () => {
  const [cellStatuses, setCellStatuses] = useState({});

  // ✅ Inicializar los status al cargar el componente
  useEffect(() => {
    const initialStatuses = initializeCellStatuses(
      testData.attendanceData.employees
    );
    setCellStatuses(initialStatuses);
    console.log("🎯 Status iniciales:", initialStatuses);
  }, []);

  const handleStatusChange = (employeeId, dayIndex, type, newStatus) => {
    const key = `${employeeId}-${dayIndex}-${type}`;
    setCellStatuses((prev) => ({
      ...prev,
      [key]: newStatus,
    }));

    console.log(
      `✅ Cambio: Empleado ${employeeId}, Día ${dayIndex}, Tipo ${type}, Nuevo estatus: ${newStatus}`
    );
  };

  const getCellStatus = (employeeId, dayIndex, type) => {
    const key = `${employeeId}-${dayIndex}-${type}`;
    return cellStatuses[key] || "normal";
  };

  // 📦 Datos procesados
  const empleadosNormalizados = normalizeEmployeesData(
    testData.attendanceData.employees
  );
  const dias = testData.days;
  const horarios = generateHorarios(testData.attendanceData.employees);

  // 🐛 Debug - verificar la estructura
  console.log("🔍 Debug datos:");
  console.log("Empleados normalizados:", empleadosNormalizados);
  console.log("Horarios keys:", Object.keys(horarios));
  console.log("Días:", dias);
  console.log("Cell statuses:", cellStatuses);

  return (
    <div style={styleMainContainer}>
      {/* Container de tabs */}
      <TabsContainer>
        {/* TAB 1 - Asistencia */}
        <AttendanceTable
          empleados={empleadosNormalizados}
          dias={dias}
          horarios={horarios}
          cellStatuses={cellStatuses}
          onStatusChange={handleStatusChange}
          getCellStatus={getCellStatus}
        />

        {/* TAB 2 - Contadores */}
        <CountersTable
          empleados={empleadosNormalizados} // ✅ Usar la misma estructura normalizada
          cellStatuses={cellStatuses}
          dias={dias}
        />
      </TabsContainer>
    </div>
  );
};

// 🎨 Estilos del contenedor principal
const styleMainContainer = {
  backgroundColor: "#f5f5f5",
  minHeight: "100vh",
  padding: "24px",
  fontFamily: "system-ui, -apple-system, sans-serif",
};

const styleHeader = {
  backgroundColor: "white",
  padding: "24px",
  borderRadius: "8px",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  marginBottom: "24px",
  textAlign: "center",
};

const styleTitle = {
  margin: "0 0 8px 0",
  fontSize: "24px",
  color: "#1976d2",
  fontWeight: "600",
};

const stylePeriod = {
  fontSize: "14px",
  color: "#666",
  margin: 0,
};

const styleFooter = {
  marginTop: "24px",
  backgroundColor: "#e3f2fd",
  padding: "16px",
  borderRadius: "8px",
  border: "1px solid #bbdefb",
};

const styleFooterContent = {
  fontSize: "14px",
  color: "#1565c0",
  textAlign: "center",
};
