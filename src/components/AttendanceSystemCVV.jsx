import React, { useState, useEffect } from "react";

// Datos centralizados desde testData
import { testData } from "../data/testData";

// Componentes de UI
import { AttendanceTable } from "./ui/AttendanceTable";
import { CountersTable } from "./ui/CountersTable";
import { TabsContainer } from "./ui/TabsContainer";

// Utilidades para manejo de fechas
const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const formatDate = (date) => {
  return date.toISOString().split("T")[0];
};

const formatDateDisplay = (date) => {
  const months = [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ];
  return `${date.getDate()} ${months[date.getMonth()]}`;
};

const getDayName = (date) => {
  const days = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  return days[date.getDay()];
};

// Generar una semana completa a partir de una fecha
const generateWeekDays = (startDate) => {
  const days = [];
  for (let i = 0; i < 7; i++) {
    const currentDate = addDays(startDate, i);
    days.push({
      fecha: currentDate.getDate().toString(),
      dia: getDayName(currentDate),
      fullDate: formatDate(currentDate),
      month: formatDateDisplay(currentDate).split(" ")[1],
      isWeekend: currentDate.getDay() === 0 || currentDate.getDay() === 6,
    });
  }
  return days;
};

// Generar datos de empleados para una semana específica
const generateWeekData = (startDate, allEmployees) => {
  const weekDays = generateWeekDays(startDate);
  const weekDates = weekDays.map((day) => day.fullDate);

  return allEmployees.map((employee) => ({
    ...employee,
    records: weekDates.map((date) => {
      // Buscar si existe un registro para esta fecha
      const existingRecord = employee.records?.find(
        (record) => record.date === date
      );

      if (existingRecord) {
        return existingRecord;
      }

      // Si no existe, crear un registro vacío para fines de semana o días normales
      const dayOfWeek = getDayName(new Date(date));
      const isWeekend =
        new Date(date).getDay() === 0 || new Date(date).getDay() === 6;

      return {
        date: date,
        dayOfWeek: dayOfWeek,
        entrada: {
          time: isWeekend ? "--" : "--",
          status: "normal",
          originalTime: null,
        },
        salida: {
          time: isWeekend ? "--" : "--",
          status: "normal",
          originalTime: null,
        },
      };
    }),
  }));
};

// Función para transformar datos de asistencia a formato de horarios esperados
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

    horarios[empleado.id] = horarioPorDia;
  });

  return horarios;
};

// Helper para normalizar la estructura de empleados
const normalizeEmployeesData = (attendanceEmployees) => {
  return attendanceEmployees.map((emp) => ({
    id: emp.id,
    nombre: emp.name,
    plaza: emp.plaza,
  }));
};

// Función para inicializar los status de las celdas desde datos de la semana
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
  // Estado para la semana actual
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    // Inicializar con la fecha de los datos de prueba (2024-08-16 es viernes)
    // Vamos al lunes de esa semana (2024-08-12)
    const testDate = new Date("2024-08-16");
    const monday = new Date(testDate);
    monday.setDate(testDate.getDate() - ((testDate.getDay() + 6) % 7));
    return monday;
  });

  const [cellStatuses, setCellStatuses] = useState({});
  const [currentWeekData, setCurrentWeekData] = useState([]);
  const [currentDays, setCurrentDays] = useState([]);

  // Generar los datos de la semana actual
  useEffect(() => {
    const weekData = generateWeekData(
      currentWeekStart,
      testData.attendanceData.employees
    );
    const weekDays = generateWeekDays(currentWeekStart);

    setCurrentWeekData(weekData);
    setCurrentDays(weekDays);

    // Inicializar los status de las celdas
    const initialStatuses = initializeCellStatuses(weekData);
    setCellStatuses(initialStatuses);

    console.log("Semana generada:", {
      start: formatDate(currentWeekStart),
      end: formatDate(addDays(currentWeekStart, 6)),
      days: weekDays,
      employees: weekData,
    });
  }, [currentWeekStart]);

  // Formatear el período actual para mostrar
  const getCurrentWeekDisplay = () => {
    const endDate = addDays(currentWeekStart, 6);
    const startStr = formatDateDisplay(currentWeekStart);
    const endStr = formatDateDisplay(endDate);
    const year = currentWeekStart.getFullYear();

    return `${startStr} - ${endStr} ${year}`;
  };

  // Manejar cambios de semana
  const handleWeekChange = (action) => {
    if (action === "previousWeek") {
      setCurrentWeekStart(addDays(currentWeekStart, -7));
    } else if (action === "nextWeek") {
      setCurrentWeekStart(addDays(currentWeekStart, 7));
    } else if (action === "customWeek") {
      // Por ahora solo log, después implementaremos el modal
      console.log("Abrir selector de semana personalizada");
      // TODO: Implementar modal de selección de fecha
    }
  };

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

  const getCellStatus = (employeeId, dayIndex, type) => {
    const key = `${employeeId}-${dayIndex}-${type}`;
    return cellStatuses[key] || "normal";
  };

  // Datos procesados para la semana actual
  const empleadosNormalizados = normalizeEmployeesData(currentWeekData);
  const horarios = generateHorarios(currentWeekData);

  console.log("Debug datos actuales:", {
    weekStart: formatDate(currentWeekStart),
    days: currentDays,
    employees: empleadosNormalizados.length,
    cellStatuses: Object.keys(cellStatuses).length,
  });

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
