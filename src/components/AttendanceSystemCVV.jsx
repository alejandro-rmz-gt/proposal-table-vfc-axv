import React, { useState, useMemo } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Chip,
  Grid,
  Card,
  CardContent,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip,
  useTheme,
  alpha,
  Container,
  AppBar,
  Toolbar,
  Badge,
  Stack,
  Divider,
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRight,
  ExpandMore,
  AccessTime,
  Person,
  Assessment,
  Edit,
  Schedule,
  TrendingUp,
  CalendarToday,
} from "@mui/icons-material";

export const AttendanceSystemCVV = () => {
  const theme = useTheme();

  // Estados
  const [currentPeriod, setCurrentPeriod] = useState("2024-08-16_2024-08-31");
  const [editingCell, setEditingCell] = useState(null);
  const [expandedEmployee, setExpandedEmployee] = useState(false);

  // Colores oficiales del Excel
  const incidenceColors = {
    retardo: "#FFC000",
    baja: "#C55A11",
    permiso: "#FF99CC",
    tiempoRecuperar: "#92D050",
    vacaciones: "#FFFF00",
    normal: theme.palette.success.light,
  };

  // Datos de ejemplo basados en el Excel real
  const attendanceData = {
    titulo: "CVV-20 NOMINA DEL 16 AL 31 DE AGOSTO 2024",
    fechaInicio: "2024-08-16",
    fechaFin: "2024-08-31",
    empleados: [
      {
        id: 1,
        plaza: "CVV-20",
        nombre: "MIGUEL ANGEL ROMERO GUEVARA",
        horarios: {
          "2024-08-16": { entrada: "07:43", salida: "15:55", tipo: "normal" },
          "2024-08-17": { entrada: null, salida: null, tipo: "libre" },
          "2024-08-19": { entrada: "07:43", salida: "15:57", tipo: "normal" },
          "2024-08-20": { entrada: "07:44", salida: "15:56", tipo: "normal" },
          "2024-08-21": { entrada: "07:40", salida: "15:58", tipo: "normal" },
          "2024-08-22": { entrada: "07:42", salida: "15:54", tipo: "normal" },
          "2024-08-23": { entrada: "07:45", salida: "15:59", tipo: "normal" },
          "2024-08-26": { entrada: "07:41", salida: "15:53", tipo: "normal" },
          "2024-08-27": { entrada: "07:46", salida: "15:57", tipo: "normal" },
          "2024-08-28": { entrada: "07:44", salida: "15:55", tipo: "normal" },
          "2024-08-29": { entrada: "07:47", salida: "15:58", tipo: "normal" },
          "2024-08-30": { entrada: "07:43", salida: "15:56", tipo: "normal" },
        },
      },
      {
        id: 2,
        plaza: "CVV-20",
        nombre: "MARIA GABRIELA NUCHE SANTACRUZ",
        horarios: {
          "2024-08-16": { entrada: "12:00", salida: "20:24", tipo: "normal" },
          "2024-08-17": { entrada: "07:47", salida: "14:25", tipo: "permiso" },
          "2024-08-19": { entrada: "07:47", salida: "16:42", tipo: "normal" },
          "2024-08-20": { entrada: "08:15", salida: "15:56", tipo: "retardo" },
          "2024-08-21": { entrada: "07:53", salida: "15:48", tipo: "normal" },
          "2024-08-22": { entrada: "07:49", salida: "15:52", tipo: "normal" },
          "2024-08-23": { entrada: "07:51", salida: "15:55", tipo: "normal" },
          "2024-08-26": { entrada: "07:48", salida: "15:50", tipo: "normal" },
          "2024-08-27": { entrada: "08:10", salida: "15:45", tipo: "retardo" },
          "2024-08-28": { entrada: "07:52", salida: "15:48", tipo: "normal" },
          "2024-08-29": { entrada: "07:55", salida: "15:50", tipo: "normal" },
          "2024-08-30": { entrada: "08:05", salida: "15:42", tipo: "retardo" },
        },
      },
      {
        id: 3,
        plaza: "CVV-20",
        nombre: "JOCELINE SALDAÑA PEREZ",
        horarios: {
          "2024-08-16": { entrada: "08:39", salida: "15:52", tipo: "retardo" },
          "2024-08-17": { entrada: "08:39", salida: "13:33", tipo: "permiso" },
          "2024-08-19": { entrada: "08:54", salida: "15:52", tipo: "retardo" },
          "2024-08-20": { entrada: "08:50", salida: "15:52", tipo: "retardo" },
          "2024-08-21": { entrada: "08:48", salida: "14:52", tipo: "permiso" },
          "2024-08-22": { entrada: "08:48", salida: "16:01", tipo: "normal" },
          "2024-08-23": { entrada: "08:41", salida: "15:52", tipo: "retardo" },
          "2024-08-26": { entrada: "08:45", salida: "15:48", tipo: "retardo" },
          "2024-08-27": { entrada: "08:38", salida: "15:55", tipo: "retardo" },
          "2024-08-28": { entrada: "08:42", salida: "15:50", tipo: "retardo" },
          "2024-08-29": { entrada: "08:35", salida: "15:45", tipo: "retardo" },
          "2024-08-30": { entrada: "08:40", salida: "15:48", tipo: "retardo" },
        },
      },
      {
        id: 4,
        plaza: "CVV-20",
        nombre: "OSORIO MENDIETA GABRIELA",
        horarios: {
          "2024-08-16": { entrada: "06:56", salida: "15:33", tipo: "normal" },
          "2024-08-17": { entrada: null, salida: null, tipo: "vacaciones" },
          "2024-08-19": { entrada: "07:33", salida: "15:56", tipo: "normal" },
          "2024-08-20": { entrada: "07:30", salida: "15:45", tipo: "normal" },
          "2024-08-21": { entrada: "07:35", salida: "15:50", tipo: "normal" },
          "2024-08-22": { entrada: "07:32", salida: "15:48", tipo: "normal" },
          "2024-08-23": { entrada: "07:38", salida: "15:52", tipo: "normal" },
          "2024-08-26": { entrada: null, salida: null, tipo: "baja" },
          "2024-08-27": { entrada: "07:45", salida: "15:50", tipo: "normal" },
          "2024-08-28": { entrada: "07:40", salida: "15:45", tipo: "normal" },
          "2024-08-29": { entrada: "07:42", salida: "15:48", tipo: "normal" },
          "2024-08-30": { entrada: "07:38", salida: "15:52", tipo: "normal" },
        },
      },
      {
        id: 5,
        plaza: "CVV-20",
        nombre: "JENNIFER JESSICA CRUZ HERNANDEZ",
        horarios: {
          "2024-08-16": { entrada: "07:05", salida: "15:37", tipo: "normal" },
          "2024-08-17": { entrada: "07:13", salida: "15:37", tipo: "normal" },
          "2024-08-19": { entrada: "07:13", salida: "15:37", tipo: "normal" },
          "2024-08-20": { entrada: "07:10", salida: "15:35", tipo: "normal" },
          "2024-08-21": { entrada: "07:08", salida: "15:40", tipo: "normal" },
          "2024-08-22": { entrada: "07:15", salida: "15:33", tipo: "normal" },
          "2024-08-23": { entrada: "07:12", salida: "15:38", tipo: "normal" },
          "2024-08-26": { entrada: "08:20", salida: "15:30", tipo: "retardo" },
          "2024-08-27": { entrada: "07:06", salida: "15:42", tipo: "normal" },
          "2024-08-28": { entrada: "07:08", salida: "15:35", tipo: "normal" },
          "2024-08-29": { entrada: "07:12", salida: "15:40", tipo: "normal" },
          "2024-08-30": { entrada: "07:05", salida: "15:38", tipo: "normal" },
        },
      },
    ],
  };

  // Generar días laborables del período
  const workingDays = useMemo(() => {
    const days = [];
    const start = new Date("2024-08-16");
    const end = new Date("2024-08-31");

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dayOfWeek = d.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        // Excluir domingos y sábados
        days.push({
          date: d.toISOString().split("T")[0],
          dayName: d.toLocaleDateString("es-ES", { weekday: "short" }),
          dayNumber: d.getDate(),
        });
      }
    }
    return days;
  }, []);

  // Función para obtener color de celda según tipo
  const getCellColor = (tipo) => {
    return incidenceColors[tipo] || "transparent";
  };

  // Función para calcular estadísticas por empleado
  const getEmployeeStats = (empleado) => {
    const horarios = Object.values(empleado.horarios);
    const diasTrabajados = horarios.filter((h) => h.entrada && h.salida).length;
    const retardos = horarios.filter((h) => h.tipo === "retardo").length;
    const faltas = horarios.filter((h) => h.tipo === "baja").length;
    const permisos = horarios.filter((h) => h.tipo === "permiso").length;
    const vacaciones = horarios.filter((h) => h.tipo === "vacaciones").length;

    return {
      diasTrabajados,
      incidencias: { retardos, faltas, permisos, vacaciones },
    };
  };

  // Función para calcular horas trabajadas
  const calculateWorkedHours = (entrada, salida) => {
    if (!entrada || !salida) return 0;
    const [entradaH, entradaM] = entrada.split(":").map(Number);
    const [salidaH, salidaM] = salida.split(":").map(Number);
    const entradaMinutes = entradaH * 60 + entradaM;
    const salidaMinutes = salidaH * 60 + salidaM;
    return ((salidaMinutes - entradaMinutes) / 60).toFixed(1);
  };

  // Componente para celda de tiempo editable
  const TimeCell = ({ empleado, fecha }) => {
    const horario = empleado.horarios[fecha];
    const backgroundColor = horario
      ? getCellColor(horario.tipo)
      : "transparent";
    const isEditing = editingCell === `${empleado.id}-${fecha}`;

    const handleCellClick = () => {
      setEditingCell(`${empleado.id}-${fecha}`);
    };

    const handleCellBlur = () => {
      setEditingCell(null);
    };

    const getTooltipText = () => {
      if (!horario || (!horario.entrada && !horario.salida)) {
        return horario?.tipo === "vacaciones"
          ? "Día de vacaciones"
          : horario?.tipo === "baja"
          ? "Falta injustificada"
          : "Día libre";
      }
      const horas = calculateWorkedHours(horario.entrada, horario.salida);
      return `${horas} horas trabajadas - ${horario.tipo}`;
    };

    if (!horario || (!horario.entrada && !horario.salida)) {
      return (
        <Tooltip title={getTooltipText()}>
          <TableCell
            sx={{
              minWidth: 90,
              height: 70,
              backgroundColor: horario?.tipo
                ? alpha(getCellColor(horario.tipo), 0.2)
                : "transparent",
              border: 1,
              borderColor: "divider",
              textAlign: "center",
              cursor: "pointer",
              "&:hover": {
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
              },
            }}
            onClick={handleCellClick}
          >
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
            >
              {horario?.tipo === "vacaciones" && (
                <Typography
                  variant="caption"
                  color="warning.main"
                  fontWeight="bold"
                >
                  VAC
                </Typography>
              )}
              {horario?.tipo === "baja" && (
                <Typography
                  variant="caption"
                  color="error.main"
                  fontWeight="bold"
                >
                  FALTA
                </Typography>
              )}
              {!horario && (
                <Typography variant="caption" color="textSecondary">
                  --
                </Typography>
              )}
            </Box>
          </TableCell>
        </Tooltip>
      );
    }

    return (
      <Tooltip title={getTooltipText()}>
        <TableCell
          sx={{
            minWidth: 90,
            height: 70,
            backgroundColor:
              horario.tipo !== "normal"
                ? alpha(backgroundColor, 0.2)
                : "transparent",
            border: 1,
            borderColor: "divider",
            cursor: "pointer",
            position: "relative",
            "&:hover": {
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              "& .edit-icon": {
                opacity: 1,
              },
            },
          }}
          onClick={handleCellClick}
        >
          {isEditing ? (
            <Stack spacing={0.5} sx={{ p: 0.5 }}>
              <TextField
                size="small"
                type="time"
                defaultValue={horario.entrada}
                onBlur={handleCellBlur}
                sx={{
                  "& .MuiInputBase-input": {
                    fontSize: "0.75rem",
                    padding: "4px 8px",
                  },
                }}
              />
              <TextField
                size="small"
                type="time"
                defaultValue={horario.salida}
                onBlur={handleCellBlur}
                sx={{
                  "& .MuiInputBase-input": {
                    fontSize: "0.75rem",
                    padding: "4px 8px",
                  },
                }}
              />
            </Stack>
          ) : (
            <Box textAlign="center" position="relative">
              <Typography variant="body2" fontWeight="bold" color="primary">
                {horario.entrada}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {horario.salida}
              </Typography>
              <Typography variant="caption" color="success.main">
                {calculateWorkedHours(horario.entrada, horario.salida)}h
              </Typography>
              <Edit
                className="edit-icon"
                sx={{
                  position: "absolute",
                  top: 2,
                  right: 2,
                  fontSize: 12,
                  opacity: 0,
                  transition: "opacity 0.2s",
                }}
              />
            </Box>
          )}
        </TableCell>
      </Tooltip>
    );
  };

  // Calcular estadísticas generales
  const generalStats = useMemo(() => {
    const allStats = attendanceData.empleados.map(getEmployeeStats);
    return {
      totalEmpleados: attendanceData.empleados.length,
      totalRetardos: allStats.reduce(
        (sum, stat) => sum + stat.incidencias.retardos,
        0
      ),
      totalPermisos: allStats.reduce(
        (sum, stat) => sum + stat.incidencias.permisos,
        0
      ),
      totalFaltas: allStats.reduce(
        (sum, stat) => sum + stat.incidencias.faltas,
        0
      ),
      promedioDiasTrabajados: (
        allStats.reduce((sum, stat) => sum + stat.diasTrabajados, 0) /
        allStats.length
      ).toFixed(1),
    };
  }, []);

  return (
    <Box sx={{ backgroundColor: "grey.50", minHeight: "100vh" }}>
      {/* AppBar */}
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <Schedule sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Sistema de Asistencia CVV-20
          </Typography>
          <Box display="flex" alignItems="center" gap={1}>
            <IconButton color="inherit">
              <ChevronLeft />
            </IconButton>
            <Typography variant="body2">16 - 31 Agosto 2024</Typography>
            <IconButton color="inherit">
              <ChevronRight />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* Estadísticas generales */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: "center" }}>
                <Person color="primary" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4" color="primary" fontWeight="bold">
                  {generalStats.totalEmpleados}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Empleados
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: "center" }}>
                <AccessTime color="warning" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4" color="warning.main" fontWeight="bold">
                  {generalStats.totalRetardos}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Retardos
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: "center" }}>
                <CalendarToday color="info" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4" color="info.main" fontWeight="bold">
                  {generalStats.totalPermisos}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Permisos
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: "center" }}>
                <TrendingUp color="success" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4" color="success.main" fontWeight="bold">
                  {generalStats.promedioDiasTrabajados}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Promedio días
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Leyenda de colores */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <Assessment />
            Leyenda de Incidencias
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Chip
              label="Normal"
              sx={{
                backgroundColor: alpha(incidenceColors.normal, 0.2),
                color: "success.main",
              }}
              size="small"
            />
            <Chip
              label="Retardo"
              sx={{ backgroundColor: alpha(incidenceColors.retardo, 0.2) }}
              size="small"
            />
            <Chip
              label="Baja/Falta"
              sx={{ backgroundColor: alpha(incidenceColors.baja, 0.2) }}
              size="small"
            />
            <Chip
              label="Permiso/Lactancia"
              sx={{ backgroundColor: alpha(incidenceColors.permiso, 0.2) }}
              size="small"
            />
            <Chip
              label="Tiempo por Recuperar"
              sx={{
                backgroundColor: alpha(incidenceColors.tiempoRecuperar, 0.2),
              }}
              size="small"
            />
            <Chip
              label="Vacaciones"
              sx={{ backgroundColor: alpha(incidenceColors.vacaciones, 0.2) }}
              size="small"
            />
          </Stack>
        </Paper>

        <Grid container spacing={3}>
          {/* Tabla principal de asistencia */}
          <Grid item xs={12} lg={8}>
            <Paper>
              <TableContainer sx={{ maxHeight: 600 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold", minWidth: 100 }}>
                        Plaza
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold", minWidth: 200 }}>
                        Empleado
                      </TableCell>
                      {workingDays.map((day) => (
                        <TableCell
                          key={day.date}
                          align="center"
                          sx={{ fontWeight: "bold", minWidth: 90 }}
                        >
                          <Box>
                            <Typography
                              variant="caption"
                              display="block"
                              fontWeight="bold"
                            >
                              {day.dayName}
                            </Typography>
                            <Typography variant="body2" fontWeight="bold">
                              {day.dayNumber}
                            </Typography>
                          </Box>
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {attendanceData.empleados.map((empleado) => (
                      <TableRow key={empleado.id} hover>
                        <TableCell>
                          <Chip
                            label={empleado.plaza}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" fontWeight="medium">
                              {empleado.nombre}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {getEmployeeStats(empleado).diasTrabajados} días
                              trabajados
                            </Typography>
                          </Box>
                        </TableCell>
                        {workingDays.map((day) => (
                          <TimeCell
                            key={`${empleado.id}-${day.date}`}
                            empleado={empleado}
                            fecha={day.date}
                          />
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>

          {/* Panel de resumen */}
          <Grid item xs={12} lg={4}>
            <Paper sx={{ p: 2 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <Person />
                Resumen por Empleado
              </Typography>

              {attendanceData.empleados.map((empleado) => {
                const stats = getEmployeeStats(empleado);
                return (
                  <Accordion key={empleado.id} sx={{ mb: 1 }}>
                    <AccordionSummary
                      expandIcon={<ExpandMore />}
                      sx={{
                        "& .MuiAccordionSummary-content": {
                          alignItems: "center",
                        },
                      }}
                    >
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="body2" fontWeight="medium">
                          {empleado.nombre.split(" ").slice(0, 2).join(" ")}
                        </Typography>
                        <Stack
                          direction="row"
                          spacing={1}
                          alignItems="center"
                          sx={{ mt: 0.5 }}
                        >
                          <Badge
                            badgeContent={stats.diasTrabajados}
                            color="primary"
                            sx={{ "& .MuiBadge-badge": { fontSize: "0.6rem" } }}
                          >
                            <CalendarToday sx={{ fontSize: 16 }} />
                          </Badge>
                          {stats.incidencias.retardos > 0 && (
                            <Badge
                              badgeContent={stats.incidencias.retardos}
                              color="warning"
                              sx={{
                                "& .MuiBadge-badge": { fontSize: "0.6rem" },
                              }}
                            >
                              <AccessTime sx={{ fontSize: 16 }} />
                            </Badge>
                          )}
                        </Stack>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Divider sx={{ mb: 2 }} />
                      <Typography variant="subtitle2" gutterBottom>
                        Incidencias del período:
                      </Typography>
                      <Stack spacing={1}>
                        {stats.incidencias.retardos > 0 && (
                          <Chip
                            label={`Retardos: ${stats.incidencias.retardos}`}
                            size="small"
                            sx={{
                              backgroundColor: alpha(
                                incidenceColors.retardo,
                                0.2
                              ),
                            }}
                          />
                        )}
                        {stats.incidencias.permisos > 0 && (
                          <Chip
                            label={`Permisos: ${stats.incidencias.permisos}`}
                            size="small"
                            sx={{
                              backgroundColor: alpha(
                                incidenceColors.permiso,
                                0.2
                              ),
                            }}
                          />
                        )}
                        {stats.incidencias.vacaciones > 0 && (
                          <Chip
                            label={`Vacaciones: ${stats.incidencias.vacaciones}`}
                            size="small"
                            sx={{
                              backgroundColor: alpha(
                                incidenceColors.vacaciones,
                                0.2
                              ),
                            }}
                          />
                        )}
                        {stats.incidencias.faltas > 0 && (
                          <Chip
                            label={`Faltas: ${stats.incidencias.faltas}`}
                            size="small"
                            sx={{
                              backgroundColor: alpha(incidenceColors.baja, 0.2),
                            }}
                          />
                        )}
                        {Object.values(stats.incidencias).every(
                          (val) => val === 0
                        ) && (
                          <Chip
                            label="✓ Sin incidencias"
                            size="small"
                            color="success"
                            variant="outlined"
                          />
                        )}
                      </Stack>
                    </AccordionDetails>
                  </Accordion>
                );
              })}
            </Paper>
          </Grid>
        </Grid>

        {/* Instrucciones de uso */}
        <Paper
          sx={{
            mt: 3,
            p: 2,
            backgroundColor: alpha(theme.palette.info.main, 0.1),
          }}
        >
          <Typography
            variant="body2"
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <AccessTime sx={{ fontSize: 16 }} />
            <strong>Instrucciones:</strong> Haz clic en cualquier celda de
            horario para editarla. Los colores se aplican automáticamente según
            el tipo de incidencia. Pasa el cursor sobre las celdas para ver
            detalles adicionales.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};
