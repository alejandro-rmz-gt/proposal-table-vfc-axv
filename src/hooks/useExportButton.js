import { useState, useCallback } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

/**
 * Hook personalizado para manejar la exportación de datos a diferentes formatos
 * @param {Object} config - Configuración del hook
 * @param {Array} config.data - Array de datos a exportar
 * @param {Array} config.columns - Definición de columnas (opcional)
 * @param {string} config.filename - Nombre base del archivo
 * @param {Array} config.formats - Formatos disponibles ['xlsx', 'csv', 'pdf']
 * @param {Array} config.sheetNames - Nombres de hojas para Excel
 * @param {Object} config.metadata - Metadatos adicionales
 * @returns {Object} - Funciones y estados del hook
 */
export const useExportButton = ({
  data = [],
  columns = null,
  filename = "export",
  formats = ["xlsx"],
  sheetNames = ["Datos"],
  metadata = {},
}) => {
  // Estados internos
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState(null);

  // Utilidades de formateo
  const formatDate = useCallback((date) => {
    if (!date) return "";
    if (typeof date === "string") return date;
    return date.toLocaleDateString("es-ES");
  }, []);

  const getCurrentDateTime = useCallback(() => {
    return new Date().toLocaleString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  // Función para procesar datos antes de exportar
  const processDataForExport = useCallback(
    (rawData, selectedColumns = null) => {
      if (!Array.isArray(rawData) || rawData.length === 0) {
        return [];
      }

      // Si no se especifican columnas, usar todas las propiedades del primer objeto
      const columnsToUse =
        selectedColumns || columns || Object.keys(rawData[0]);

      return rawData.map((item) => {
        const processedItem = {};
        columnsToUse.forEach((col) => {
          const columnKey = typeof col === "string" ? col : col.key;
          const columnLabel =
            typeof col === "string" ? col : col.label || col.key;

          let value = item[columnKey];

          // Formatear valores especiales
          if (value instanceof Date) {
            value = formatDate(value);
          } else if (typeof value === "boolean") {
            value = value ? "Sí" : "No";
          } else if (value === null || value === undefined) {
            value = "";
          }

          processedItem[columnLabel] = value;
        });
        return processedItem;
      });
    },
    [columns, formatDate]
  );

  // Exportar a XLSX
  const exportToXLSX = useCallback(
    async (processedData, customFilename) => {
      try {
        setIsExporting(true);
        setExportError(null);

        // Crear nuevo workbook
        const workbook = XLSX.utils.book_new();

        // Si es un array de arrays (múltiples hojas)
        if (Array.isArray(processedData[0]) && sheetNames.length > 1) {
          processedData.forEach((sheetData, index) => {
            const worksheet = XLSX.utils.json_to_sheet(sheetData);
            const sheetName = sheetNames[index] || `Hoja${index + 1}`;
            XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
          });
        } else {
          // Una sola hoja
          const worksheet = XLSX.utils.json_to_sheet(processedData);

          // Agregar metadatos como comentarios (si es posible)
          if (metadata.title) {
            XLSX.utils.sheet_add_aoa(worksheet, [[metadata.title]], {
              origin: "A1",
            });
            XLSX.utils.sheet_add_aoa(worksheet, [[""]], { origin: "A2" }); // Línea vacía
            // Ajustar el rango para incluir el título
            const range = XLSX.utils.decode_range(worksheet["!ref"]);
            range.s.r = 0; // Empezar desde la fila 0
            worksheet["!ref"] = XLSX.utils.encode_range(range);
          }

          XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            sheetNames[0] || "Datos"
          );
        }

        // Agregar metadatos al workbook
        workbook.Props = {
          Title: metadata.title || "Exportación de Datos",
          Subject: metadata.subject || "Datos exportados desde el sistema",
          Author: metadata.author || "Sistema de Asistencias",
          CreatedDate: new Date(),
        };

        // Generar archivo y descargar
        const excelBuffer = XLSX.write(workbook, {
          bookType: "xlsx",
          type: "array",
          compression: true,
        });

        const blob = new Blob([excelBuffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        saveAs(blob, `${customFilename}_${getCurrentDateTime()}.xlsx`);

        return {
          success: true,
          message: "Archivo XLSX exportado correctamente",
        };
      } catch (error) {
        console.error("Error exportando XLSX:", error);
        const errorMessage = "Error al generar archivo XLSX";
        setExportError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setIsExporting(false);
      }
    },
    [sheetNames, metadata, getCurrentDateTime]
  );

  // Exportar a CSV
  const exportToCSV = useCallback(
    async (processedData, customFilename) => {
      try {
        setIsExporting(true);
        setExportError(null);

        // Convertir datos a CSV
        const worksheet = XLSX.utils.json_to_sheet(processedData);
        const csvContent = XLSX.utils.sheet_to_csv(worksheet, {
          FS: ",", // Field separator
          RS: "\n", // Record separator
        });

        // Crear blob con BOM para UTF-8 (importante para caracteres especiales)
        const BOM = "\uFEFF";
        const blob = new Blob([BOM + csvContent], {
          type: "text/csv;charset=utf-8;",
        });

        saveAs(blob, `${customFilename}_${getCurrentDateTime()}.csv`);

        return {
          success: true,
          message: "Archivo CSV exportado correctamente",
        };
      } catch (error) {
        console.error("Error exportando CSV:", error);
        const errorMessage = "Error al generar archivo CSV";
        setExportError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setIsExporting(false);
      }
    },
    [getCurrentDateTime]
  );

  // Exportar a PDF (requiere instalación de jsPDF)
  const exportToPDF = useCallback(
    async (processedData, customFilename) => {
      try {
        // Verificar si jsPDF está disponible
        const jsPDF = await import("jspdf").then((module) => module.default);
        const { default: autoTable } = await import("jspdf-autotable");

        setIsExporting(true);
        setExportError(null);

        const doc = new jsPDF();

        // Configurar documento
        doc.setFontSize(16);
        doc.text(metadata.title || "Reporte de Datos", 14, 22);

        doc.setFontSize(10);
        doc.text(`Generado: ${getCurrentDateTime()}`, 14, 30);

        // Obtener columnas y datos para la tabla
        const columns =
          processedData.length > 0 ? Object.keys(processedData[0]) : [];
        const rows = processedData.map((item) =>
          columns.map((col) => item[col] || "")
        );

        // Crear tabla
        autoTable(doc, {
          head: [columns],
          body: rows,
          startY: 35,
          styles: {
            fontSize: 8,
            cellPadding: 2,
          },
          headStyles: {
            fillColor: [25, 118, 210], // Color azul del sistema
            textColor: 255,
            fontStyle: "bold",
          },
          alternateRowStyles: {
            fillColor: [245, 245, 245],
          },
        });

        // Guardar archivo
        doc.save(`${customFilename}_${getCurrentDateTime()}.pdf`);

        return {
          success: true,
          message: "Archivo PDF exportado correctamente",
        };
      } catch (error) {
        console.error("Error exportando PDF:", error);
        const errorMessage =
          "Error al generar archivo PDF. Asegúrate de tener jsPDF instalado.";
        setExportError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setIsExporting(false);
      }
    },
    [metadata, getCurrentDateTime]
  );

  // Función principal de exportación
  const handleExport = useCallback(
    async (format, customColumns = null) => {
      if (!data || data.length === 0) {
        const errorMessage = "No hay datos para exportar";
        setExportError(errorMessage);
        return { success: false, error: errorMessage };
      }

      if (!formats.includes(format)) {
        const errorMessage = `Formato ${format} no soportado`;
        setExportError(errorMessage);
        return { success: false, error: errorMessage };
      }

      try {
        // Procesar datos
        const processedData = processDataForExport(data, customColumns);

        if (processedData.length === 0) {
          const errorMessage =
            "No se pudieron procesar los datos para exportar";
          setExportError(errorMessage);
          return { success: false, error: errorMessage };
        }

        let result;
        switch (format) {
          case "xlsx":
            result = await exportToXLSX(processedData, filename);
            break;
          case "csv":
            result = await exportToCSV(processedData, filename);
            break;
          case "pdf":
            result = await exportToPDF(processedData, filename);
            break;
          default:
            throw new Error(`Formato ${format} no implementado`);
        }

        if (result.success) {
          setExportError(null);
        }

        return result;
      } catch (error) {
        console.error("Error en handleExport:", error);
        const errorMessage = `Error inesperado al exportar: ${error.message}`;
        setExportError(errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [
      data,
      formats,
      filename,
      processDataForExport,
      exportToXLSX,
      exportToCSV,
      exportToPDF,
    ]
  );

  // Limpiar errores
  const clearError = useCallback(() => {
    setExportError(null);
  }, []);

  // Retornar API del hook
  return {
    // Estados
    isExporting,
    exportError,
    hasData: data && data.length > 0,

    // Funciones principales
    handleExport,
    clearError,

    // Información útil
    availableFormats: formats,
    dataCount: data ? data.length : 0,

    // Funciones individuales por formato (por si se necesitan)
    exportToXLSX: (customColumns) => handleExport("xlsx", customColumns),
    exportToCSV: (customColumns) => handleExport("csv", customColumns),
    exportToPDF: (customColumns) => handleExport("pdf", customColumns),
  };
};
