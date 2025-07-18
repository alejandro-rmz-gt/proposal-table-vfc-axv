import React from "react";
import {
  Person,
  AccessTime,
  Assignment,
  TrendingUp,
  CalendarToday,
  ChevronLeft,
  ChevronRight,
  Assessment,
  CheckCircle,
  Warning,
  Error,
  Event,
  Business,
  Info,
} from "@mui/icons-material";

export const AttendanceSystemCVV = () => {
  // Datos estáticos para la maquetación
  const empleados = [
    { id: 1, nombre: "MIGUEL ANGEL ROMERO GUEVARA", plaza: "CVV-20" },
    { id: 2, nombre: "MARIA GABRIELA NUCHE SANTACRUZ", plaza: "CVV-20" },
    { id: 3, nombre: "JOCELINE SALDAÑA PEREZ", plaza: "CVV-20" },
    { id: 4, nombre: "OSORIO MENDIETA GABRIELA", plaza: "CVV-20" },
    { id: 5, nombre: "JENNIFER JESSICA CRUZ HERNANDEZ", plaza: "CVV-20" },
  ];

  const dias = [
    { fecha: "16", dia: "Lun" },
    { fecha: "17", dia: "Mar" },
    { fecha: "19", dia: "Jue" },
    { fecha: "20", dia: "Vie" },
    { fecha: "21", dia: "Lun" },
    { fecha: "22", dia: "Mar" },
    { fecha: "23", dia: "Mié" },
    { fecha: "26", dia: "Lun" },
    { fecha: "27", dia: "Mar" },
    { fecha: "28", dia: "Mié" },
    { fecha: "29", dia: "Jue" },
    { fecha: "30", dia: "Vie" },
  ];

  // Datos de ejemplo para mostrar diferentes tipos de celdas
  const horarios = {
    1: [
      "07:43/15:55",
      "--",
      "07:43/15:57",
      "07:44/15:56",
      "07:40/15:58",
      "07:42/15:54",
      "07:45/15:59",
      "07:41/15:53",
      "07:46/15:57",
      "07:44/15:55",
      "07:47/15:58",
      "07:43/15:56",
    ],
    2: [
      "12:00/20:24",
      "PERMISO",
      "07:47/16:42",
      "RETARDO",
      "07:53/15:48",
      "07:49/15:52",
      "07:51/15:55",
      "07:48/15:50",
      "RETARDO",
      "07:52/15:48",
      "07:55/15:50",
      "RETARDO",
    ],
    3: [
      "RETARDO",
      "PERMISO",
      "RETARDO",
      "RETARDO",
      "PERMISO",
      "08:48/16:01",
      "RETARDO",
      "RETARDO",
      "RETARDO",
      "RETARDO",
      "RETARDO",
      "RETARDO",
    ],
    4: [
      "06:56/15:33",
      "VACACIONES",
      "07:33/15:56",
      "07:30/15:45",
      "07:35/15:50",
      "07:32/15:48",
      "07:38/15:52",
      "FALTA",
      "07:45/15:50",
      "07:40/15:45",
      "07:42/15:48",
      "07:38/15:52",
    ],
    5: [
      "07:05/15:37",
      "07:13/15:37",
      "07:13/15:37",
      "07:10/15:35",
      "07:08/15:40",
      "07:15/15:33",
      "07:12/15:38",
      "RETARDO",
      "07:06/15:42",
      "07:08/15:35",
      "07:12/15:40",
      "07:05/15:38",
    ],
  };

  const getCellStyle = (valor) => {
    if (valor === "RETARDO")
      return { backgroundColor: "#FFC00040", color: "#f57c00" };
    if (valor === "FALTA")
      return { backgroundColor: "#C55A1140", color: "#d32f2f" };
    if (valor === "PERMISO")
      return { backgroundColor: "#FF99CC40", color: "#e91e63" };
    if (valor === "VACACIONES")
      return { backgroundColor: "#FFFF0040", color: "#f57c00" };
    if (valor === "--")
      return { backgroundColor: "transparent", color: "#999" };
    return { backgroundColor: "transparent", color: "#333" };
  };

  const getCellIcon = (valor) => {
    if (valor === "RETARDO")
      return <Warning sx={{ fontSize: 12, color: "#f57c00" }} />;
    if (valor === "FALTA")
      return <Error sx={{ fontSize: 12, color: "#d32f2f" }} />;
    if (valor === "PERMISO")
      return <Assignment sx={{ fontSize: 12, color: "#e91e63" }} />;
    if (valor === "VACACIONES")
      return <Event sx={{ fontSize: 12, color: "#f57c00" }} />;
    return null;
  };

  const formatHorario = (valor) => {
    if (valor.includes("/")) {
      const [entrada, salida] = valor.split("/");
      return (
        <div>
          <div
            style={{ fontWeight: "bold", color: "#1976d2", fontSize: "11px" }}
          >
            {entrada}
          </div>
          <div style={{ color: "#666", fontSize: "11px" }}>{salida}</div>
          <div style={{ color: "#4caf50", fontSize: "10px" }}>8.2h</div>
        </div>
      );
    }
    return valor;
  };

  return (
    <div
      style={{
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: "#1976d2",
          color: "white",
          padding: "16px 24px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            maxWidth: "1400px",
            margin: "0 auto",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <CalendarToday sx={{ fontSize: 24 }} />
            <h1 style={{ margin: 0, fontSize: "20px", fontWeight: "500" }}>
              Sistema de Asistencia CVV-20
            </h1>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button
              style={{
                background: "rgba(255,255,255,0.2)",
                border: "none",
                borderRadius: "4px",
                padding: "8px 12px",
                cursor: "pointer",
                color: "white",
                display: "flex",
                alignItems: "center",
              }}
            >
              <ChevronLeft sx={{ fontSize: 16 }} />
            </button>
            <span style={{ fontSize: "14px", fontWeight: "500" }}>
              16 - 31 Agosto 2024
            </span>
            <button
              style={{
                background: "rgba(255,255,255,0.2)",
                border: "none",
                borderRadius: "4px",
                padding: "8px 12px",
                cursor: "pointer",
                color: "white",
                display: "flex",
                alignItems: "center",
              }}
            >
              <ChevronRight sx={{ fontSize: 16 }} />
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "24px" }}>
        {/* Estadísticas */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              textAlign: "center",
            }}
          >
            <Person sx={{ fontSize: 32, color: "#1976d2", mb: 1 }} />
            <div
              style={{ fontSize: "32px", fontWeight: "bold", color: "#1976d2" }}
            >
              5
            </div>
            <div style={{ fontSize: "14px", color: "#666" }}>Empleados</div>
          </div>
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              textAlign: "center",
            }}
          >
            <AccessTime sx={{ fontSize: 32, color: "#f57c00", mb: 1 }} />
            <div
              style={{ fontSize: "32px", fontWeight: "bold", color: "#f57c00" }}
            >
              12
            </div>
            <div style={{ fontSize: "14px", color: "#666" }}>Retardos</div>
          </div>
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              textAlign: "center",
            }}
          >
            <Assignment sx={{ fontSize: 32, color: "#e91e63", mb: 1 }} />
            <div
              style={{ fontSize: "32px", fontWeight: "bold", color: "#e91e63" }}
            >
              4
            </div>
            <div style={{ fontSize: "14px", color: "#666" }}>Permisos</div>
          </div>
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              textAlign: "center",
            }}
          >
            <TrendingUp sx={{ fontSize: 32, color: "#4caf50", mb: 1 }} />
            <div
              style={{ fontSize: "32px", fontWeight: "bold", color: "#4caf50" }}
            >
              10.4
            </div>
            <div style={{ fontSize: "14px", color: "#666" }}>Promedio días</div>
          </div>
        </div>

        {/* Leyenda */}
        <div
          style={{
            backgroundColor: "white",
            marginBottom: "24px",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <h3
            style={{
              margin: "0 0 16px 0",
              fontSize: "18px",
              color: "#333",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Assessment sx={{ fontSize: 20 }} />
            Leyenda de Incidencias
          </h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
            <span
              style={{
                backgroundColor: "#4CAF5040",
                padding: "6px 12px",
                borderRadius: "16px",
                fontSize: "12px",
                border: "1px solid #4CAF50",
                fontWeight: "500",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <CheckCircle sx={{ fontSize: 14, color: "#4CAF50" }} />
              Normal
            </span>
            <span
              style={{
                backgroundColor: "#FFC00040",
                padding: "6px 12px",
                borderRadius: "16px",
                fontSize: "12px",
                border: "1px solid #FFC000",
                fontWeight: "500",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <Warning sx={{ fontSize: 14, color: "#FFC000" }} />
              Retardo
            </span>
            <span
              style={{
                backgroundColor: "#C55A1140",
                padding: "6px 12px",
                borderRadius: "16px",
                fontSize: "12px",
                border: "1px solid #C55A11",
                fontWeight: "500",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <Error sx={{ fontSize: 14, color: "#C55A11" }} />
              Baja/Falta
            </span>
            <span
              style={{
                backgroundColor: "#FF99CC40",
                padding: "6px 12px",
                borderRadius: "16px",
                fontSize: "12px",
                border: "1px solid #FF99CC",
                fontWeight: "500",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <Assignment sx={{ fontSize: 14, color: "#FF99CC" }} />
              Permiso/Lactancia
            </span>
            <span
              style={{
                backgroundColor: "#FFFF0040",
                padding: "6px 12px",
                borderRadius: "16px",
                fontSize: "12px",
                border: "1px solid #FFFF00",
                fontWeight: "500",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <Event sx={{ fontSize: 14, color: "#FFFF00" }} />
              Vacaciones
            </span>
          </div>
        </div>

        {/* Tabla Principal */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            overflow: "hidden",
          }}
        >
          <div style={{ maxHeight: "600px", overflow: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "13px",
              }}
            >
              <thead
                style={{
                  backgroundColor: "#f8f9fa",
                  position: "sticky",
                  top: 0,
                  zIndex: 1,
                }}
              >
                <tr>
                  <th
                    style={{
                      minWidth: "80px",
                      padding: "16px 12px",
                      border: "1px solid #e0e0e0",
                      fontWeight: "bold",
                      textAlign: "left",
                      backgroundColor: "#f8f9fa",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <Business sx={{ fontSize: 16 }} />
                      Plaza
                    </div>
                  </th>
                  <th
                    style={{
                      minWidth: "200px",
                      padding: "16px 12px",
                      border: "1px solid #e0e0e0",
                      fontWeight: "bold",
                      textAlign: "left",
                      backgroundColor: "#f8f9fa",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <Person sx={{ fontSize: 16 }} />
                      Empleado
                    </div>
                  </th>
                  {dias.map((dia, index) => (
                    <th
                      key={index}
                      style={{
                        minWidth: "90px",
                        padding: "12px 8px",
                        border: "1px solid #e0e0e0",
                        fontWeight: "bold",
                        textAlign: "center",
                        fontSize: "12px",
                        backgroundColor: "#f8f9fa",
                      }}
                    >
                      <div style={{ fontWeight: "bold" }}>{dia.dia}</div>
                      <div style={{ fontSize: "14px", marginTop: "2px" }}>
                        {dia.fecha}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {empleados.map((empleado, index) => (
                  <tr
                    key={empleado.id}
                    style={{
                      backgroundColor: index % 2 === 0 ? "#ffffff" : "#f9f9f9",
                    }}
                  >
                    <td
                      style={{
                        padding: "12px",
                        border: "1px solid #e0e0e0",
                      }}
                    >
                      <span
                        style={{
                          backgroundColor: "#1976d2",
                          color: "white",
                          padding: "4px 8px",
                          borderRadius: "12px",
                          fontSize: "11px",
                          fontWeight: "500",
                        }}
                      >
                        {empleado.plaza}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        border: "1px solid #e0e0e0",
                      }}
                    >
                      <div
                        style={{
                          fontWeight: "500",
                          fontSize: "13px",
                        }}
                      >
                        {empleado.nombre}
                      </div>
                    </td>
                    {horarios[empleado.id].map((horario, diaIndex) => {
                      const cellStyle = getCellStyle(horario);
                      const icon = getCellIcon(horario);

                      return (
                        <td
                          key={diaIndex}
                          style={{
                            minWidth: "90px",
                            height: "70px",
                            border: "1px solid #e0e0e0",
                            textAlign: "center",
                            padding: "8px",
                            verticalAlign: "middle",
                            fontSize: "11px",
                            ...cellStyle,
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                              height: "100%",
                              gap: "2px",
                            }}
                          >
                            {icon && (
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "2px",
                                }}
                              >
                                {icon}
                              </div>
                            )}
                            <div>
                              {horario.includes("/")
                                ? formatHorario(horario)
                                : horario}
                            </div>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Instrucciones */}
        <div
          style={{
            marginTop: "24px",
            backgroundColor: "#e3f2fd",
            padding: "16px",
            borderRadius: "8px",
            border: "1px solid #bbdefb",
          }}
        >
          <div
            style={{
              fontSize: "14px",
              color: "#1565c0",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Info sx={{ fontSize: 16 }} />
            <strong>Vista de Maquetación:</strong> Esta es una representación
            visual del sistema de asistencia. Los datos mostrados son ejemplos
            para demostrar el diseño y los colores del sistema.
          </div>
        </div>
      </div>
    </div>
  );
};
