import { useCallback } from "react";
import * as XLSX from "xlsx";

export const useExportAttendance = () => {
  
  // Función para generar los datos de exportación de la tabla de asistencias
  const generateAttendanceExportData = useCallback((empleados, dias, horarios, cellStatuses, getCellStatus) => {
    const data = [];
    
    // Header con información del período
    data.push([
      "REPORTE DE ASISTENCIA",
      "",
      "",
      `Período: ${dias[0]?.fullDate} al ${dias[dias.length - 1]?.fullDate}`,
      "",
      `Total días: ${dias.length}`,
      `Empleados: ${empleados.length}`
    ]);
    data.push([]); // Línea vacía
    
    // Headers de la tabla
    const headers = ["Plaza", "Empleado"];
    dias.forEach(dia => {
      headers.push(`${dia.dia} ${dia.fecha} - Entrada`);
      headers.push(`${dia.dia} ${dia.fecha} - Salida`);
    });
    data.push(headers);
    
    // Datos de empleados
    empleados.forEach(empleado => {
      const row = [empleado.plaza, empleado.nombre];
      
      dias.forEach((dia, diaIndex) => {
        // Parsear horario string
        const horarioString = horarios[empleado.id][diaIndex];
        let entradaHora = "--";
        let salidaHora = "--";
        
        if (horarioString && horarioString.includes("/")) {
          const [entrada, salida] = horarioString.split("/");
          entradaHora = entrada;
          salidaHora = salida;
        } else if (horarioString && !horarioString.includes("/")) {
          entradaHora = horarioString.toUpperCase();
          salidaHora = horarioString.toUpperCase();
        }
        
        // Obtener status actual (puede haber sido editado)
        const entradaStatus = getCellStatus(empleado.id, diaIndex, "entrada");
        const salidaStatus = getCellStatus(empleado.id, diaIndex, "salida");
        
        // Formatear celda de entrada
        const entradaCelda = entradaStatus !== "normal" 
          ? `${entradaHora} (${entradaStatus.toUpperCase()})`
          : entradaHora;
          
        // Formatear celda de salida
        const salidaCelda = salidaStatus !== "normal" 
          ? `${salidaHora} (${salidaStatus.toUpperCase()})`
          : salidaHora;
        
        row.push(entradaCelda, salidaCelda);
      });
      
      data.push(row);
    });
    
    return data;
  }, []);

  // Función para generar los datos de exportación de la tabla de contadores
  const generateCountersExportData = useCallback((empleados, cellStatuses, dias) => {
    const data = [];
    
    // Header
    data.push([
      "REPORTE DE CONTADORES DE ASISTENCIA",
      "",
      `Total días: ${dias.length}`,
      `Empleados: ${empleados.length}`
    ]);
    data.push([]); // Línea vacía
    
    // Headers
    data.push(["Plaza", "Empleado", "Normal", "Retardos", "Faltas", "Permisos", "Vacaciones", "Total Registros"]);
    
    // Calcular contadores para cada empleado
    const statusTypes = ["normal", "retardo", "falta", "permiso", "vacaciones"];
    
    empleados.forEach(empleado => {
      const counters = {
        normal: 0,
        retardo: 0,
        falta: 0,
        permiso: 0,
        vacaciones: 0,
      };

      // Contar status para este empleado
      dias.forEach((_, dayIndex) => {
        ["entrada", "salida"].forEach((type) => {
          const key = `${empleado.id}-${dayIndex}-${type}`;
          const status = cellStatuses[key] || "normal";
          if (counters.hasOwnProperty(status)) {
            counters[status]++;
          }
        });
      });

      const totalRecords = dias.length * 2; // entrada + salida por cada día
      
      data.push([
        empleado.plaza,
        empleado.nombre,
        counters.normal,
        counters.retardo,
        counters.falta,
        counters.permiso,
        counters.vacaciones,
        totalRecords
      ]);
    });
    
    // Fila de totales
    const totals = statusTypes.reduce((acc, status) => {
      acc[status] = empleados.reduce((sum, empleado) => {
        const employeeTotal = dias.reduce((empSum, _, dayIndex) => {
          const entradaKey = `${empleado.id}-${dayIndex}-entrada`;
          const salidaKey = `${empleado.id}-${dayIndex}-salida`;
          const entradaStatus = cellStatuses[entradaKey] || "normal";
          const salidaStatus = cellStatuses[salidaKey] || "normal";
          
          return empSum + 
            (entradaStatus === status ? 1 : 0) + 
            (salidaStatus === status ? 1 : 0);
        }, 0);
        return sum + employeeTotal;
      }, 0);
      return acc;
    }, {});
    
    data.push([]); // Línea vacía
    data.push([
      "TOTALES",
      `${empleados.length} empleados`,
      totals.normal,
      totals.retardo,
      totals.falta,
      totals.permiso,
      totals.vacaciones,
      empleados.length * dias.length * 2
    ]);
    
    return data;
  }, []);

  // Función principal de exportación
  const exportToExcel = useCallback((
    empleados, 
    dias, 
    horarios, 
    cellStatuses, 
    getCellStatus, 
    activeTab = 0,
    fileName = null
  ) => {
    try {
      // Crear un nuevo workbook
      const wb = XLSX.utils.book_new();
      
      // Generar nombre de archivo si no se proporciona
      const defaultFileName = fileName || `Asistencia_${dias[0]?.fullDate.replace(/-/g, '')}_${dias[dias.length - 1]?.fullDate.replace(/-/g, '')}.xlsx`;
      
      if (activeTab === 0) {
        // Exportar tabla de asistencias
        const attendanceData = generateAttendanceExportData(empleados, dias, horarios, cellStatuses, getCellStatus);
        const ws = XLSX.utils.aoa_to_sheet(attendanceData);
        
        // Ajustar ancho de columnas
        const colWidths = [
          { wch: 10 }, // Plaza
          { wch: 30 }, // Empleado
        ];
        
        // Agregar ancho para cada día (entrada + salida)
        dias.forEach(() => {
          colWidths.push({ wch: 15 }); // Entrada
          colWidths.push({ wch: 15 }); // Salida
        });
        
        ws['!cols'] = colWidths;
        
        XLSX.utils.book_append_sheet(wb, ws, "Asistencias");
        
      } else {
        // Exportar tabla de contadores
        const countersData = generateCountersExportData(empleados, cellStatuses, dias);
        const ws = XLSX.utils.aoa_to_sheet(countersData);
        
        // Ajustar ancho de columnas
        ws['!cols'] = [
          { wch: 10 }, // Plaza
          { wch: 30 }, // Empleado
          { wch: 10 }, // Normal
          { wch: 10 }, // Retardos
          { wch: 10 }, // Faltas
          { wch: 10 }, // Permisos
          { wch: 12 }, // Vacaciones
          { wch: 15 }, // Total Registros
        ];
        
        XLSX.utils.book_append_sheet(wb, ws, "Contadores");
      }
      
      // Descargar archivo
      XLSX.writeFile(wb, defaultFileName);
      
      console.log(`✅ Archivo exportado: ${defaultFileName}`);
      return { success: true, fileName: defaultFileName };
      
    } catch (error) {
      console.error("❌ Error al exportar:", error);
      return { success: false, error: error.message };
    }
  }, [generateAttendanceExportData, generateCountersExportData]);

  // Función para exportar ambas pestañas en un solo archivo
  const exportBothTabs = useCallback((
    empleados, 
    dias, 
    horarios, 
    cellStatuses, 
    getCellStatus,
    fileName = null
  ) => {
    try {
      const wb = XLSX.utils.book_new();
      const defaultFileName = fileName || `Reporte_Completo_${dias[0]?.fullDate.replace(/-/g, '')}_${dias[dias.length - 1]?.fullDate.replace(/-/g, '')}.xlsx`;
      
      // Agregar hoja de asistencias
      const attendanceData = generateAttendanceExportData(empleados, dias, horarios, cellStatuses, getCellStatus);
      const wsAttendance = XLSX.utils.aoa_to_sheet(attendanceData);
      
      const colWidthsAttendance = [{ wch: 10 }, { wch: 30 }];
      dias.forEach(() => {
        colWidthsAttendance.push({ wch: 15 }, { wch: 15 });
      });
      wsAttendance['!cols'] = colWidthsAttendance;
      
      XLSX.utils.book_append_sheet(wb, wsAttendance, "Asistencias");
      
      // Agregar hoja de contadores
      const countersData = generateCountersExportData(empleados, cellStatuses, dias);
      const wsCounters = XLSX.utils.aoa_to_sheet(countersData);
      
      wsCounters['!cols'] = [
        { wch: 10 }, { wch: 30 }, { wch: 10 }, { wch: 10 }, 
        { wch: 10 }, { wch: 10 }, { wch: 12 }, { wch: 15 }
      ];
      
      XLSX.utils.book_append_sheet(wb, wsCounters, "Contadores");
      
      // Descargar archivo
      XLSX.writeFile(wb, defaultFileName);
      
      console.log(`✅ Reporte completo exportado: ${defaultFileName}`);
      return { success: true, fileName: defaultFileName };
      
    } catch (error) {
      console.error("❌ Error al exportar reporte completo:", error);
      return { success: false, error: error.message };
    }
  }, [generateAttendanceExportData, generateCountersExportData]);

  return {
    exportToExcel,
    exportBothTabs,
  };
};