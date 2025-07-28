import React, { useState, useEffect, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  CalendarToday,
  Close,
} from "@mui/icons-material";

export const WeekPickerCalendar = ({
  isVisible,
  onClose,
  onRangeSelect, // Cambio de nombre
  currentStartDate, // Fecha de inicio actual
  currentEndDate, // Fecha de fin actual
  x = 0,
  y = 0,
}) => {
  const calendarRef = useRef(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [hoveredDate, setHoveredDate] = useState(null);
  const [isSelectingRange, setIsSelectingRange] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // Inicializar con las fechas actuales
  useEffect(() => {
    if (currentStartDate && currentEndDate) {
      setSelectedStartDate(new Date(currentStartDate));
      setSelectedEndDate(new Date(currentEndDate));
    }
  }, [currentStartDate, currentEndDate]);

  // Cerrar el calendario al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isVisible, onClose]);

  // Funciones auxiliares
  const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };

  const formatDisplayDate = (date) => {
    return `${date.getDate()}/${date.getMonth() + 1}`;
  };

  const getMonthName = (date) => {
    const months = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];
    return months[date.getMonth()];
  };

  const isSameDate = (date1, date2) => {
    if (!date1 || !date2) return false;
    return formatDate(date1) === formatDate(date2);
  };

  const isDateInRange = (date, startDate, endDate) => {
    if (!startDate || !endDate) return false;
    const dateTime = date.getTime();
    const startTime = startDate.getTime();
    const endTime = endDate.getTime();
    return dateTime >= startTime && dateTime <= endTime;
  };

  // Función para calcular días entre fechas
  const getDaysBetween = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    const timeDiff = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1;
  };

  // Función para verificar si el rango es válido (menor o igual a 30 días)
  const isValidRange = (startDate, endDate) => {
    if (!startDate || !endDate) return false;
    return getDaysBetween(startDate, endDate) <= 30;
  };

  // Función para obtener el lunes de una semana (necesaria para el calendario)
  const getWeekStart = (date) => {
    const monday = new Date(date);
    monday.setDate(date.getDate() - ((date.getDay() + 6) % 7));
    return monday;
  };

  // Generar días del calendario
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Encontrar el lunes de la primera semana
    const startDate = getWeekStart(firstDay);

    const days = [];
    let currentDate = new Date(startDate);

    // Generar 6 semanas (42 días)
    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return days;
  };

  const handleDayClick = (date, event) => {
    if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
      // Primera selección o reiniciar selección
      setSelectedStartDate(new Date(date));
      setSelectedEndDate(null);
      setIsSelectingRange(true);
      setShowTooltip(false);
    } else if (selectedStartDate && !selectedEndDate) {
      // Segunda selección
      const startDate = selectedStartDate;
      const endDate = new Date(date);

      // Verificar si el rango es válido antes de permitir la selección
      const start =
        startDate.getTime() <= endDate.getTime() ? startDate : endDate;
      const end =
        startDate.getTime() <= endDate.getTime() ? endDate : startDate;

      if (!isValidRange(start, end)) {
        // Mostrar tooltip de error
        const rect = event.target.getBoundingClientRect();
        setTooltipPosition({
          x: rect.left + rect.width / 2,
          y: rect.top - 10,
        });
        setShowTooltip(true);

        // Ocultar tooltip después de 3 segundos
        setTimeout(() => {
          setShowTooltip(false);
        }, 3000);

        return; // No permitir la selección
      }

      // Asegurar que startDate <= endDate
      if (startDate.getTime() > endDate.getTime()) {
        setSelectedStartDate(endDate);
        setSelectedEndDate(startDate);
      } else {
        setSelectedEndDate(endDate);
      }
      setIsSelectingRange(false);
      setShowTooltip(false);
    }
  };

  const handleConfirmSelection = () => {
    if (
      selectedStartDate &&
      selectedEndDate &&
      isValidRange(selectedStartDate, selectedEndDate)
    ) {
      onRangeSelect(selectedStartDate, selectedEndDate);
      onClose();
    }
  };

  const handleClearSelection = () => {
    setSelectedStartDate(null);
    setSelectedEndDate(null);
    setIsSelectingRange(false);
    setShowTooltip(false);
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  const handleDayHover = (date) => {
    setHoveredDate(new Date(date));
  };

  const handleDayLeave = () => {
    setHoveredDate(null);
  };

  if (!isVisible) return null;

  const calendarDays = generateCalendarDays();
  const adjustedX = Math.min(x, window.innerWidth - 350);
  const adjustedY = Math.min(y, window.innerHeight - 400);

  // Verificar si el botón confirmar debe estar habilitado
  const isConfirmEnabled =
    selectedStartDate &&
    selectedEndDate &&
    isValidRange(selectedStartDate, selectedEndDate);

  return (
    <>
      <div
        ref={calendarRef}
        style={{
          ...styleCalendarContainer,
          top: adjustedY,
          left: adjustedX,
        }}
      >
        {/* Header del calendario */}
        <div style={styleCalendarHeader}>
          <button onClick={handlePreviousMonth} style={styleNavButton}>
            <ChevronLeft sx={{ fontSize: 16 }} />
          </button>

          <div style={styleMonthTitle}>
            <CalendarToday sx={{ fontSize: 16, marginRight: "6px" }} />
            {getMonthName(currentMonth)} {currentMonth.getFullYear()}
          </div>

          <button onClick={handleNextMonth} style={styleNavButton}>
            <ChevronRight sx={{ fontSize: 16 }} />
          </button>
        </div>

        {/* Días de la semana */}
        <div style={styleDaysHeader}>
          {["L", "M", "X", "J", "V", "S", "D"].map((day, index) => (
            <div key={index} style={styleDayHeaderCell}>
              {day}
            </div>
          ))}
        </div>

        {/* Calendario */}
        <div style={styleCalendarGrid}>
          {calendarDays.map((date, index) => {
            const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
            const isStartDate = isSameDate(date, selectedStartDate);
            const isEndDate = isSameDate(date, selectedEndDate);
            const isInRange =
              selectedStartDate &&
              selectedEndDate &&
              isDateInRange(date, selectedStartDate, selectedEndDate);
            const isHovered = hoveredDate && isSameDate(date, hoveredDate);
            const isToday = formatDate(date) === formatDate(new Date());

            // Crear rango temporal durante la selección
            const tempEndDate =
              isSelectingRange && selectedStartDate && hoveredDate
                ? hoveredDate
                : selectedEndDate;
            const isInTempRange =
              isSelectingRange &&
              selectedStartDate &&
              hoveredDate &&
              isDateInRange(
                date,
                selectedStartDate.getTime() <= hoveredDate.getTime()
                  ? selectedStartDate
                  : hoveredDate,
                selectedStartDate.getTime() <= hoveredDate.getTime()
                  ? hoveredDate
                  : selectedStartDate
              );

            // Verificar si este día haría que el rango sea inválido
            const wouldBeInvalidRange =
              isSelectingRange &&
              selectedStartDate &&
              hoveredDate &&
              !isValidRange(
                selectedStartDate.getTime() <= hoveredDate.getTime()
                  ? selectedStartDate
                  : hoveredDate,
                selectedStartDate.getTime() <= hoveredDate.getTime()
                  ? hoveredDate
                  : selectedStartDate
              );

            return (
              <button
                key={index}
                onClick={(event) => handleDayClick(date, event)}
                onMouseEnter={() => handleDayHover(date)}
                onMouseLeave={handleDayLeave}
                style={{
                  ...styleDayCell,
                  opacity: isCurrentMonth ? 1 : 0.3,
                  backgroundColor:
                    isStartDate || isEndDate
                      ? "#1976d2"
                      : isInRange
                      ? "rgba(25, 118, 210, 0.3)"
                      : isInTempRange && !wouldBeInvalidRange
                      ? "rgba(25, 118, 210, 0.1)"
                      : wouldBeInvalidRange
                      ? "rgba(244, 67, 54, 0.1)"
                      : "transparent",
                  color:
                    isStartDate || isEndDate
                      ? "white"
                      : isToday
                      ? "#1976d2"
                      : isCurrentMonth
                      ? "#333"
                      : "#999",
                  fontWeight:
                    isToday || isStartDate || isEndDate ? "bold" : "normal",
                  border:
                    isToday && !isStartDate && !isEndDate
                      ? "2px solid #1976d2"
                      : wouldBeInvalidRange
                      ? "1px solid #f44336"
                      : "1px solid transparent",
                  cursor: wouldBeInvalidRange ? "not-allowed" : "pointer",
                }}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>

        {/* Botones de acción */}
        <div style={styleActionButtons}>
          <button onClick={handleClearSelection} style={styleClearButton}>
            Limpiar
          </button>
          <button
            onClick={handleConfirmSelection}
            disabled={!isConfirmEnabled}
            style={{
              ...styleConfirmButton,
              opacity: isConfirmEnabled ? 1 : 0.5,
              cursor: isConfirmEnabled ? "pointer" : "not-allowed",
            }}
          >
            Confirmar
          </button>
        </div>

        {/* Footer informativo */}
        <div style={styleCalendarFooter}>
          {!selectedStartDate ? (
            <div style={styleFooterText}>📅 Haz clic en la fecha de inicio</div>
          ) : !selectedEndDate ? (
            <div>
              <div style={styleFooterText}>
                ✅ Inicio: {formatDisplayDate(selectedStartDate)} - Ahora
                selecciona la fecha de fin
              </div>
            </div>
          ) : (
            <div>
              <div style={styleRangePreview}>
                📅 Rango: {formatDisplayDate(selectedStartDate)} -{" "}
                {formatDisplayDate(selectedEndDate)}
              </div>
              <div
                style={{
                  ...styleFooterText,
                  color: isValidRange(selectedStartDate, selectedEndDate)
                    ? "#666"
                    : "#f44336",
                }}
              >
                ({getDaysBetween(selectedStartDate, selectedEndDate)} días)
                {!isValidRange(selectedStartDate, selectedEndDate) &&
                  " - Máximo 30 días"}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tooltip de error */}
      {showTooltip && (
        <div
          style={{
            ...styleTooltip,
            left: tooltipPosition.x - 100, // Centrar el tooltip
            top: tooltipPosition.y,
          }}
        >
          <div style={styleTooltipContent}>
            <Close
              sx={{ fontSize: 16, color: "#f44336", marginRight: "4px" }}
            />
            <span>No se pueden seleccionar más de 30 días</span>
          </div>
          <div style={styleTooltipArrow}></div>
        </div>
      )}
    </>
  );
};

// Estilos
const styleCalendarContainer = {
  position: "fixed",
  backgroundColor: "white",
  border: "1px solid #e0e0e0",
  borderRadius: "12px",
  boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
  zIndex: 1000,
  width: "320px",
  padding: "16px",
  animation: "fadeIn 0.2s ease-out",
};

const styleCalendarHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "16px",
  padding: "0 4px",
};

const styleNavButton = {
  background: "none",
  border: "none",
  borderRadius: "6px",
  padding: "8px",
  cursor: "pointer",
  color: "#1976d2",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.2s ease",
};

const styleMonthTitle = {
  fontSize: "16px",
  fontWeight: "600",
  color: "#1976d2",
  display: "flex",
  alignItems: "center",
};

const styleDaysHeader = {
  display: "grid",
  gridTemplateColumns: "repeat(7, 1fr)",
  gap: "2px",
  marginBottom: "8px",
};

const styleDayHeaderCell = {
  textAlign: "center",
  fontSize: "12px",
  fontWeight: "600",
  color: "#666",
  padding: "8px 4px",
};

const styleCalendarGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(7, 1fr)",
  gap: "2px",
  marginBottom: "12px",
};

const styleDayCell = {
  width: "36px",
  height: "36px",
  border: "1px solid transparent",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "14px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.2s ease",
  background: "none",
};

const styleCalendarFooter = {
  borderTop: "1px solid #f0f0f0",
  paddingTop: "12px",
  textAlign: "center",
};

const styleFooterText = {
  fontSize: "12px",
  color: "#666",
  marginBottom: "4px",
};

const styleActionButtons = {
  display: "flex",
  gap: "8px",
  marginBottom: "12px",
  justifyContent: "space-between",
};

const styleClearButton = {
  flex: 1,
  padding: "8px 16px",
  border: "1px solid #e0e0e0",
  borderRadius: "6px",
  backgroundColor: "white",
  color: "#666",
  cursor: "pointer",
  fontSize: "14px",
  transition: "all 0.2s ease",
};

const styleConfirmButton = {
  flex: 1,
  padding: "8px 16px",
  border: "none",
  borderRadius: "6px",
  backgroundColor: "#1976d2",
  color: "white",
  fontSize: "14px",
  fontWeight: "500",
  transition: "all 0.2s ease",
};

const styleRangePreview = {
  fontSize: "13px",
  color: "#1976d2",
  fontWeight: "600",
  marginBottom: "2px",
};

const styleWeekPreview = {
  fontSize: "12px",
  color: "#1976d2",
  fontWeight: "500",
};

const styleTooltip = {
  position: "fixed",
  zIndex: 1001,
  backgroundColor: "#f44336",
  color: "white",
  padding: "8px 12px",
  borderRadius: "6px",
  fontSize: "12px",
  fontWeight: "500",
  boxShadow: "0 4px 12px rgba(244, 67, 54, 0.3)",
  animation: "fadeIn 0.2s ease-out",
  width: "200px",
  textAlign: "center",
};

const styleTooltipContent = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const styleTooltipArrow = {
  position: "absolute",
  bottom: "-6px",
  left: "50%",
  transform: "translateX(-50%)",
  width: "0",
  height: "0",
  borderLeft: "6px solid transparent",
  borderRight: "6px solid transparent",
  borderTop: "6px solid #f44336",
};
