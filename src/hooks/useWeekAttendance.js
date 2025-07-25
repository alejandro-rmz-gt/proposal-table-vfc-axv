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

// Generar días basándose en un rango de fechas
const generateRangeDays = (startDate, endDate) => {
  const days = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    days.push({
      fecha: currentDate.getDate().toString(),
      dia: getDayName(currentDate),
      fullDate: formatDate(currentDate),
      month: formatDateDisplay(currentDate).split(" ")[1],
      isWeekend: currentDate.getDay() === 0 || currentDate.getDay() === 6,
    });

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return days;
};

// Generar datos de empleados para un rango de fechas específico
const generateRangeData = (startDate, endDate, allEmployees) => {
  const rangeDays = generateRangeDays(startDate, endDate);
  const rangeDates = rangeDays.map((day) => day.fullDate);

  return allEmployees.map((employee) => ({
    ...employee,
    records: rangeDates.map((date) => {
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
 * Hook personalizado para manejar la funcionalidad de asistencia por rangos de fechas
 */
export const useWeekAttendance = (
  initialEmployees,
  initialWeekStart = null
) => {
  // Calcular fechas iniciales
  const getInitialDates = () => {
    if (initialWeekStart) {
      const start = new Date(initialWeekStart);
      const end = addDays(start, 6);
      return { start, end };
    }

    // Inicializar con el lunes de la semana de los datos de prueba
    const testDate = new Date("2024-08-16");
    const monday = new Date(testDate);
    monday.setDate(testDate.getDate() - ((testDate.getDay() + 6) % 7));
    const sunday = addDays(monday, 6);

    return { start: monday, end: sunday };
  };

  const initialDates = getInitialDates();

  // Estados del hook
  const [currentRangeStart, setCurrentRangeStart] = useState(
    initialDates.start
  );
  const [currentRangeEnd, setCurrentRangeEnd] = useState(initialDates.end);
  const [cellStatuses, setCellStatuses] = useState({});
  const [currentRangeData, setCurrentRangeData] = useState([]);
  const [currentDays, setCurrentDays] = useState([]);
  const [showWeekPicker, setShowWeekPicker] = useState(false);
  const [weekPickerPosition, setWeekPickerPosition] = useState({ x: 0, y: 0 });

  // Generar los datos del rango actual
  useEffect(() => {
    const rangeData = generateRangeData(
      currentRangeStart,
      currentRangeEnd,
      initialEmployees
    );
    const rangeDays = generateRangeDays(currentRangeStart, currentRangeEnd);

    setCurrentRangeData(rangeData);
    setCurrentDays(rangeDays);

    // Inicializar los status de las celdas
    const initialStatuses = initializeCellStatuses(rangeData);
    setCellStatuses(initialStatuses);

    console.log("Rango generado:", {
      start: formatDate(currentRangeStart),
      end: formatDate(currentRangeEnd),
      totalDays: rangeDays.length,
      days: rangeDays,
      employees: rangeData,
    });
  }, [currentRangeStart, currentRangeEnd, initialEmployees]);

  // Formatear el período actual para mostrar
  const getCurrentWeekDisplay = () => {
    const startStr = formatDateDisplay(currentRangeStart);
    const endStr = formatDateDisplay(currentRangeEnd);
    const year = currentRangeStart.getFullYear();
    return `${startStr} - ${endStr} ${year}`;
  };

  // Manejar cambios de rango
  const handleWeekChange = (action, position = null) => {
    if (action === "previousWeek") {
      // Mover el rango completo hacia atrás
      const daysDiff = Math.ceil(
        (currentRangeEnd - currentRangeStart) / (1000 * 60 * 60 * 24)
      );
      setCurrentRangeStart(addDays(currentRangeStart, -(daysDiff + 1)));
      setCurrentRangeEnd(addDays(currentRangeEnd, -(daysDiff + 1)));
    } else if (action === "nextWeek") {
      // Mover el rango completo hacia adelante
      const daysDiff = Math.ceil(
        (currentRangeEnd - currentRangeStart) / (1000 * 60 * 60 * 24)
      );
      setCurrentRangeStart(addDays(currentRangeStart, daysDiff + 1));
      setCurrentRangeEnd(addDays(currentRangeEnd, daysDiff + 1));
    } else if (action === "customWeek") {
      // Abrir el selector de rango
      setWeekPickerPosition(
        position || { x: window.innerWidth / 2, y: window.innerHeight / 2 }
      );
      setShowWeekPicker(true);
    }
  };

  // Ir a un rango específico
  const goToRange = (startDate, endDate) => {
    setCurrentRangeStart(new Date(startDate));
    setCurrentRangeEnd(new Date(endDate));
  };

  // Manejar selección de rango de fechas desde el calendario
  const handleRangeSelect = (startDate, endDate) => {
    setCurrentRangeStart(new Date(startDate));
    setCurrentRangeEnd(new Date(endDate));
    setShowWeekPicker(false);

    const daysDiff =
      Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
    console.log(
      `Rango seleccionado: ${formatDate(startDate)} a ${formatDate(
        endDate
      )} (${daysDiff} días)`
    );
  };

  // Cerrar el selector de fechas
  const handleCloseWeekPicker = () => {
    setShowWeekPicker(false);
  };

  // Manejar cambios de hora en las celdas
  const handleTimeChange = (employeeId, dayIndex, type, newTime) => {
    setCurrentRangeData((prevData) => {
      return prevData.map((employee) => {
        if (employee.id === employeeId) {
          const updatedRecords = [...employee.records];
          if (updatedRecords[dayIndex]) {
            updatedRecords[dayIndex] = {
              ...updatedRecords[dayIndex],
              [type]: {
                ...updatedRecords[dayIndex][type],
                time: newTime,
                originalTime: newTime === "--" ? null : newTime,
              },
            };
          }
          return {
            ...employee,
            records: updatedRecords,
          };
        }
        return employee;
      });
    });

    console.log(
      `Cambio de hora: Empleado ${employeeId}, Día ${dayIndex}, Tipo ${type}, Nueva hora: ${newTime}`
    );
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

  // Datos procesados para el rango actual
  const empleadosNormalizados = normalizeEmployeesData(currentRangeData);
  const horarios = generateHorarios(currentRangeData);

  // Información de debug
  const debugInfo = {
    rangeStart: formatDate(currentRangeStart),
    rangeEnd: formatDate(currentRangeEnd),
    totalDays: currentDays.length,
    totalEmployees: empleadosNormalizados.length,
    totalCellStatuses: Object.keys(cellStatuses).length,
  };

  // Retornar todo lo que el componente necesita
  return {
    // Estado del rango
    currentRangeStart,
    currentRangeEnd,
    currentRangeData,
    currentDays,

    // Datos procesados
    empleadosNormalizados,
    horarios,

    // Estado de las celdas
    cellStatuses,
    setCellStatuses,

    // Funciones de navegación
    handleWeekChange,
    goToRange,
    getCurrentWeekDisplay,

    // Funciones del selector de fechas
    handleRangeSelect,
    handleCloseWeekPicker,
    showWeekPicker,
    weekPickerPosition,

    // Funciones de manejo de status y tiempo
    handleStatusChange,
    handleTimeChange,
    getCellStatus,

    // Debug y utilidades
    debugInfo,

    // Funciones auxiliares exportadas
    utils: {
      addDays,
      formatDate,
      formatDateDisplay,
      getDayName,
      generateRangeDays,
    },
  };
};
