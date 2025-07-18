import {
  Person,
  AccessTime,
  Assignment,
  TrendingUp,
} from "@mui/icons-material";

const data = {
  employees: 5,
  lateArrivals: 12,
  absences: 4,
  averageHours: 8.2,
};

export const statsData = [
  {
    icon: Person,
    value: data.employees,
    label: "Empleados",
    color: "#1976d2",
  },
  {
    icon: AccessTime,
    value: data.lateArrivals,
    label: "Retardos",
    color: "#f57c00",
  },
  {
    icon: Assignment,
    value: data.absences,
    label: "Permisos",
    color: "#e91e63",
  },
  {
    icon: TrendingUp,
    value: data.averageHours,
    label: "Promedio días",
    color: "#4caf50",
  },
];
