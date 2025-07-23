import { useState, useEffect } from "react";

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

      // Si no existe, crear un registro vacío
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

// Función para transformar datos de asistencia a formato de horarios
const generateHorarios = (attendanceEmployees) => {
  const horarios = {};

  attendanceEmployees.forEach((empleado) => {
    const horarioPorDia = empleado.records.map((record) => {
      const entrada = record.entrada?.time ?? "--";
      const salida = record.salida?.time ?? "--";
      const entradaStatus = record.entrada?.status;
      const salidaStatus = record.salida?.status;

      if (entrada === "--" && salida === "--") {
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

// Función para inicializar los status de las celdas
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

/**
 * Hook personalizado para manejar la funcionalidad de asistencia por semanas
 * @param {Array} initialEmployees - Array de empleados con sus datos de asistencia
 * @param {Date} initialWeekStart - Fecha de inicio de la semana inicial (opcional)
 * @returns {Object} Estado y funciones para manejar la asistencia semanal
 */
export const useWeekAttendance = (
  initialEmployees,
  initialWeekStart = null
) => {
  // Estado para la semana actual
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    if (initialWeekStart) {
      return initialWeekStart;
    }

    // Inicializar con el lunes de la semana de los datos de prueba
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
    const weekData = generateWeekData(currentWeekStart, initialEmployees);
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
  }, [currentWeekStart, initialEmployees]);

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
      console.log("Abrir selector de semana personalizada");
      // TODO: Implementar modal de selección de fecha
    }
  };

  // Ir a una semana específica
  const goToWeek = (date) => {
    const monday = new Date(date);
    monday.setDate(date.getDate() - ((date.getDay() + 6) % 7));
    setCurrentWeekStart(monday);
  };

  // Manejar cambios de status en las celdas
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

  // Obtener el status de una celda específica
  const getCellStatus = (employeeId, dayIndex, type) => {
    const key = `${employeeId}-${dayIndex}-${type}`;
    return cellStatuses[key] || "normal";
  };

  // Datos procesados para la semana actual
  const empleadosNormalizados = normalizeEmployeesData(currentWeekData);
  const horarios = generateHorarios(currentWeekData);

  // Información de debug
  const debugInfo = {
    weekStart: formatDate(currentWeekStart),
    weekEnd: formatDate(addDays(currentWeekStart, 6)),
    totalDays: currentDays.length,
    totalEmployees: empleadosNormalizados.length,
    totalCellStatuses: Object.keys(cellStatuses).length,
  };

  // Retornar todo lo que el componente necesita
  return {
    // Estado de la semana
    currentWeekStart,
    currentWeekData,
    currentDays,

    // Datos procesados
    empleadosNormalizados,
    horarios,

    // Estado de las celdas
    cellStatuses,
    setCellStatuses,

    // Funciones de navegación
    handleWeekChange,
    goToWeek,
    getCurrentWeekDisplay,

    // Funciones de manejo de status
    handleStatusChange,
    getCellStatus,

    // Debug y utilidades
    debugInfo,

    // Funciones auxiliares exportadas (por si se necesitan)
    utils: {
      addDays,
      formatDate,
      formatDateDisplay,
      getDayName,
      generateWeekDays,
    },
  };
};
