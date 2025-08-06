import React, { useState, useRef, useEffect } from 'react';
import {
  GetApp as DownloadIcon,
  FileDownload,
  TableChart,
  PictureAsPdf,
  Description,
  CheckCircle,
  Error as ErrorIcon,
  CloudDownload,
} from '@mui/icons-material';
import { useExportButton } from '../../../hooks/useExportButton';

/**
 * Componente reutilizable para exportar datos a diferentes formatos
 */
export const ExportButton = ({
  // Props de datos
  data = [],
  columns = null,
  filename = 'export',
  formats = ['xlsx'],
  sheetNames = ['Datos'],
  metadata = {},

  // Props de UI
  title = 'Exportar',
  icon = <DownloadIcon />,
  position = 'top-right',
  disabled = false,
  loading = false,
  customStyles = {},
  size = 'medium', // 'small', 'medium', 'large'
  variant = 'contained', // 'contained', 'outlined', 'text'

  // Callbacks
  onSuccess,
  onError,
  onExportStart,
  onExportComplete,

  // Props adicionales
  enableDropdown = true,
  showSuccessMessage = true,
  autoHideSuccess = 3000,
}) => {
  // Estados locales del componente
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState(formats[0] || 'xlsx');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  // Referencias para manejo de clicks fuera
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  // Usar nuestro hook personalizado
  const {
    isExporting,
    exportError,
    handleExport,
    clearError,
    hasData,
    dataCount,
    availableFormats
  } = useExportButton({
    data,
    columns,
    filename,
    formats,
    sheetNames,
    metadata
  });

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !buttonRef.current?.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [showDropdown]);

  // Auto-hide success message
  useEffect(() => {
    if (showSuccess && autoHideSuccess > 0) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, autoHideSuccess);
      return () => clearTimeout(timer);
    }
  }, [showSuccess, autoHideSuccess]);

  // Auto-hide error message
  useEffect(() => {
    if (exportError && !showError) {
      setShowError(true);
      const timer = setTimeout(() => {
        setShowError(false);
        clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [exportError, showError, clearError]);

  // Obtener icono según el formato
  const getFormatIcon = (format) => {
    switch (format) {
      case 'xlsx':
        return <TableChart sx={{ fontSize: 18 }} />;
      case 'csv':
        return <Description sx={{ fontSize: 18 }} />;
      case 'pdf':
        return <PictureAsPdf sx={{ fontSize: 18 }} />;
      default:
        return <FileDownload sx={{ fontSize: 18 }} />;
    }
  };

  // Obtener color según el formato
  const getFormatColor = (format) => {
    switch (format) {
      case 'xlsx':
        return '#1D6F42'; // Verde Excel
      case 'csv':
        return '#666666'; // Gris
      case 'pdf':
        return '#DC4C41'; // Rojo PDF
      default:
        return '#1976d2'; // Azul por defecto
    }
  };

  // Manejar exportación
  const handleExportClick = async (format = selectedFormat) => {
    try {
      setShowSuccess(false);
      setShowError(false);
      
      // Callback de inicio
      if (onExportStart) {
        onExportStart(format);
      }

      // Ejecutar exportación
      const result = await handleExport(format);

      // Manejar resultado
      if (result.success) {
        setShowSuccess(true);
        if (onSuccess) {
          onSuccess(result, format);
        }
      } else {
        if (onError) {
          onError(result.error, format);
        }
      }

      // Callback de completado
      if (onExportComplete) {
        onExportComplete(result, format);
      }

      // Cerrar dropdown
      setShowDropdown(false);

    } catch (error) {
      console.error('Error en exportación:', error);
      if (onError) {
        onError(error.message, format);
      }
    }
  };

  // Manejar click del botón principal
  const handleMainButtonClick = () => {
    if (formats.length === 1 && !enableDropdown) {
      // Si solo hay un formato, exportar directamente
      handleExportClick(formats[0]);
    } else {
      // Mostrar/ocultar dropdown
      setShowDropdown(!showDropdown);
    }
  };

  // Determinar si el botón está deshabilitado
  const isDisabled = disabled || !hasData || isExporting || loading;

  return (
    <div style={{ ...getContainerStyle(position), ...customStyles.container }}>
      {/* Botón principal */}
      <button
        ref={buttonRef}
        onClick={handleMainButtonClick}
        disabled={isDisabled}
        style={{
          ...getButtonStyle(variant, size, isDisabled),
          ...customStyles.button
        }}
        title={
          !hasData 
            ? 'No hay datos para exportar' 
            : `${title} (${dataCount} registros)`
        }
      >
        {isExporting ? (
          <CloudDownload sx={{ fontSize: getIconSize(size), marginRight: '6px' }} />
        ) : (
          React.cloneElement(icon, { 
            sx: { fontSize: getIconSize(size), marginRight: '6px' } 
          })
        )}
        <span style={getButtonTextStyle(size)}>
          {isExporting ? 'Exportando...' : title}
        </span>
        {formats.length > 1 && !isExporting && (
          <span style={styleDropdownArrow}>▼</span>
        )}
      </button>

      {/* Dropdown de formatos */}
      {showDropdown && formats.length > 1 && (
        <div
          ref={dropdownRef}
          style={{ ...styleDropdown, ...customStyles.dropdown }}
        >
          {availableFormats.map((format) => (
            <div
              key={format}
              onClick={() => handleExportClick(format)}
              style={styleDropdownItem}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#f5f5f5';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
              }}
            >
              {getFormatIcon(format)}
              <span style={styleFormatLabel}>
                {format.toUpperCase()}
              </span>
              <span style={styleFormatDescription}>
                {getFormatDescription(format)}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Mensaje de éxito */}
      {showSuccess && showSuccessMessage && (
        <div style={styleSuccessMessage}>
          <CheckCircle sx={{ fontSize: 16, marginRight: '6px' }} />
          <span>Archivo exportado correctamente</span>
        </div>
      )}

      {/* Mensaje de error */}
      {showError && exportError && (
        <div style={styleErrorMessage}>
          <ErrorIcon sx={{ fontSize: 16, marginRight: '6px' }} />
          <span>{exportError}</span>
        </div>
      )}
    </div>
  );
};

// Función para obtener descripción del formato
const getFormatDescription = (format) => {
  switch (format) {
    case 'xlsx':
      return 'Archivo Excel';
    case 'csv':
      return 'Valores separados por comas';
    case 'pdf':
      return 'Documento PDF';
    default:
      return '';
  }
};

// Función para obtener estilo del contenedor según posición
const getContainerStyle = (position) => {
  const baseStyle = {
    position: 'relative',
    display: 'inline-block',
  };

  switch (position) {
    case 'top-right':
      return { ...baseStyle, marginLeft: 'auto' };
    case 'top-left':
      return { ...baseStyle, marginRight: 'auto' };
    case 'center':
      return { ...baseStyle, margin: '0 auto' };
    default:
      return baseStyle;
  }
};

// Función para obtener estilo del botón
const getButtonStyle = (variant, size, disabled) => {
  const baseStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    borderRadius: '6px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    fontFamily: 'inherit',
    fontWeight: '500',
    opacity: disabled ? 0.6 : 1,
    gap: '4px',
  };

  // Tamaños
  const sizeStyles = {
    small: { padding: '6px 12px', fontSize: '12px' },
    medium: { padding: '8px 16px', fontSize: '14px' },
    large: { padding: '12px 20px', fontSize: '16px' },
  };

  // Variantes
  const variantStyles = {
    contained: {
      backgroundColor: '#1976d2',
      color: 'white',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    outlined: {
      backgroundColor: 'transparent',
      color: '#1976d2',
      border: '1px solid #1976d2',
    },
    text: {
      backgroundColor: 'transparent',
      color: '#1976d2',
    },
  };

  return {
    ...baseStyle,
    ...sizeStyles[size],
    ...variantStyles[variant],
  };
};

// Función para obtener tamaño del texto del botón
const getButtonTextStyle = (size) => {
  return {
    fontSize: size === 'small' ? '12px' : size === 'large' ? '16px' : '14px',
    fontWeight: '500',
  };
};

// Función para obtener tamaño del ícono
const getIconSize = (size) => {
  switch (size) {
    case 'small':
      return 16;
    case 'large':
      return 20;
    default:
      return 18;
  }
};

// Estilos
const styleDropdownArrow = {
  fontSize: '10px',
  marginLeft: '4px',
  opacity: 0.7,
};

const styleDropdown = {
  position: 'absolute',
  top: '100%',
  right: 0,
  backgroundColor: 'white',
  border: '1px solid #e0e0e0',
  borderRadius: '6px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  zIndex: 1000,
  minWidth: '200px',
  padding: '8px 0',
  marginTop: '4px',
  animation: 'fadeIn 0.15s ease-out',
};

const styleDropdownItem = {
  display: 'flex',
  alignItems: 'center',
  padding: '10px 16px',
  cursor: 'pointer',
  transition: 'background-color 0.15s ease',
  gap: '12px',
};

const styleFormatLabel = {
  fontWeight: '500',
  fontSize: '14px',
  color: '#333',
  minWidth: '45px',
};

const styleFormatDescription = {
  fontSize: '12px',
  color: '#666',
  flex: 1,
};

const styleSuccessMessage = {
  position: 'absolute',
  top: '100%',
  right: 0,
  backgroundColor: '#4caf50',
  color: 'white',
  padding: '8px 12px',
  borderRadius: '4px',
  fontSize: '12px',
  display: 'flex',
  alignItems: 'center',
  marginTop: '8px',
  zIndex: 1001,
  animation: 'fadeIn 0.3s ease-out',
  boxShadow: '0 2px 8px rgba(76, 175, 80, 0.3)',
};

const styleErrorMessage = {
  position: 'absolute',
  top: '100%',
  right: 0,
  backgroundColor: '#f44336',
  color: 'white',
  padding: '8px 12px',
  borderRadius: '4px',
  fontSize: '12px',
  display: 'flex',
  alignItems: 'center',
  marginTop: '8px',
  zIndex: 1001,
  animation: 'fadeIn 0.3s ease-out',
  boxShadow: '0 2px 8px rgba(244, 67, 54, 0.3)',
  maxWidth: '250px',
};