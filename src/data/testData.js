// testData.js - Objeto completo para pruebas

export const testData = {
  user: {
    id: 1,
    name: "Ana García Martínez",
    email: "ana.garcia@empresa.com",
    plaza: "CVV-20",
    role: "administradora",
  },

  employees: [
    { id: 1, name: "MIGUEL ANGEL ROMERO GUEVARA", plaza: "CVV-20" },
    { id: 2, name: "MARIA GABRIELA NUCHE SANTACRUZ", plaza: "CVV-20" },
    { id: 3, name: "JOCELINE SALDAÑA PEREZ", plaza: "CVV-20" },
    { id: 4, name: "OSORIO MENDIETA GABRIELA", plaza: "CVV-20" },
    { id: 5, name: "JENNIFER JESSICA CRUZ HERNANDEZ", plaza: "CVV-20" },
  ],

  dashboardStats: {
    employees: 5,
    lateArrivals: 8,
    absences: 3,
    averageHours: 8.2,
  },

  attendanceData: {
    period: {
      startDate: "2024-08-16",
      endDate: "2024-08-20",
      totalDays: 5,
    },
    employees: [
      {
        id: 1,
        name: "MIGUEL ANGEL ROMERO GUEVARA",
        plaza: "CVV-20",
        records: [
          {
            date: "2024-08-16",
            dayOfWeek: "Vie",
            entrada: { time: "07:43", status: "normal", originalTime: "07:43" },
            salida: { time: "15:55", status: "normal", originalTime: "15:55" },
          },
          {
            date: "2024-08-17",
            dayOfWeek: "Sáb",
            entrada: { time: "--", status: "normal", originalTime: null },
            salida: { time: "--", status: "normal", originalTime: null },
          },
          {
            date: "2024-08-18",
            dayOfWeek: "Dom",
            entrada: { time: "--", status: "normal", originalTime: null },
            salida: { time: "--", status: "normal", originalTime: null },
          },
          {
            date: "2024-08-19",
            dayOfWeek: "Lun",
            entrada: {
              time: "08:15",
              status: "retardo",
              originalTime: "08:15",
            },
            salida: { time: "16:05", status: "normal", originalTime: "16:05" },
          },
          {
            date: "2024-08-20",
            dayOfWeek: "Mar",
            entrada: { time: "07:45", status: "normal", originalTime: "07:45" },
            salida: { time: "15:50", status: "normal", originalTime: "15:50" },
          },
        ],
      },
      {
        id: 2,
        name: "MARIA GABRIELA NUCHE SANTACRUZ",
        plaza: "CVV-20",
        records: [
          {
            date: "2024-08-16",
            dayOfWeek: "Vie",
            entrada: { time: "12:00", status: "normal", originalTime: "12:00" },
            salida: { time: "20:24", status: "normal", originalTime: "20:24" },
          },
          {
            date: "2024-08-17",
            dayOfWeek: "Sáb",
            entrada: { time: "--", status: "normal", originalTime: null },
            salida: { time: "--", status: "normal", originalTime: null },
          },
          {
            date: "2024-08-18",
            dayOfWeek: "Dom",
            entrada: { time: "--", status: "normal", originalTime: null },
            salida: { time: "--", status: "normal", originalTime: null },
          },
          {
            date: "2024-08-19",
            dayOfWeek: "Lun",
            entrada: { time: "--", status: "permiso", originalTime: null },
            salida: { time: "--", status: "permiso", originalTime: null },
          },
          {
            date: "2024-08-20",
            dayOfWeek: "Mar",
            entrada: { time: "07:47", status: "normal", originalTime: "07:47" },
            salida: { time: "16:42", status: "normal", originalTime: "16:42" },
          },
        ],
      },
      {
        id: 3,
        name: "JOCELINE SALDAÑA PEREZ",
        plaza: "CVV-20",
        records: [
          {
            date: "2024-08-16",
            dayOfWeek: "Vie",
            entrada: {
              time: "08:30",
              status: "retardo",
              originalTime: "08:30",
            },
            salida: { time: "16:30", status: "normal", originalTime: "16:30" },
          },
          {
            date: "2024-08-17",
            dayOfWeek: "Sáb",
            entrada: { time: "--", status: "normal", originalTime: null },
            salida: { time: "--", status: "normal", originalTime: null },
          },
          {
            date: "2024-08-18",
            dayOfWeek: "Dom",
            entrada: { time: "--", status: "normal", originalTime: null },
            salida: { time: "--", status: "normal", originalTime: null },
          },
          {
            date: "2024-08-19",
            dayOfWeek: "Lun",
            entrada: { time: "--", status: "falta", originalTime: null },
            salida: { time: "--", status: "falta", originalTime: null },
          },
          {
            date: "2024-08-20",
            dayOfWeek: "Mar",
            entrada: {
              time: "08:15",
              status: "retardo",
              originalTime: "08:15",
            },
            salida: { time: "16:20", status: "normal", originalTime: "16:20" },
          },
        ],
      },
    ],
  },

  countersData: {
    data: [
      {
        id: 1,
        name: "MIGUEL ANGEL ROMERO GUEVARA",
        plaza: "CVV-20",
        counters: {
          normal: 8,
          retardo: 1,
          falta: 0,
          permiso: 0,
          vacaciones: 0,
        },
        totalRecords: 10,
        attendanceRate: 0.95,
      },
      {
        id: 2,
        name: "MARIA GABRIELA NUCHE SANTACRUZ",
        plaza: "CVV-20",
        counters: {
          normal: 6,
          retardo: 0,
          falta: 0,
          permiso: 2,
          vacaciones: 0,
        },
        totalRecords: 10,
        attendanceRate: 0.85,
      },
      {
        id: 3,
        name: "JOCELINE SALDAÑA PEREZ",
        plaza: "CVV-20",
        counters: {
          normal: 4,
          retardo: 2,
          falta: 2,
          permiso: 0,
          vacaciones: 0,
        },
        totalRecords: 10,
        attendanceRate: 0.75,
      },
    ],
    summary: {
      totalEmployees: 3,
      avgAttendanceRate: 0.85,
      totalCounters: {
        normal: 18,
        retardo: 3,
        falta: 2,
        permiso: 2,
        vacaciones: 0,
      },
    },
  },

  days: [
    {
      fecha: "16",
      dia: "Vie",
      fullDate: "2024-08-16",
      month: "Ago",
      isWeekend: false,
    },
    {
      fecha: "17",
      dia: "Sáb",
      fullDate: "2024-08-17",
      month: "Ago",
      isWeekend: true,
    },
    {
      fecha: "18",
      dia: "Dom",
      fullDate: "2024-08-18",
      month: "Ago",
      isWeekend: true,
    },
    {
      fecha: "19",
      dia: "Lun",
      fullDate: "2024-08-19",
      month: "Ago",
      isWeekend: false,
    },
    {
      fecha: "20",
      dia: "Mar",
      fullDate: "2024-08-20",
      month: "Ago",
      isWeekend: false,
    },
  ],
};

// Helper
export const getTestData = () => testData;

// Actualiza una celda en los datos de asistencia
export const updateCellInTestData = (employeeId, date, type, newStatus) => {
  const employee = testData.attendanceData.employees.find(
    (emp) => emp.id === employeeId
  );
  if (employee) {
    const record = employee.records.find((rec) => rec.date === date);
    if (record && record[type]) {
      record[type].status = newStatus;
      console.log(
        `✅ Test data updated: Employee ${employeeId}, ${date}, ${type} -> ${newStatus}`
      );
    }
  }
};
