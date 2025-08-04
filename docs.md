# 📋 Resumen Técnico - Sistema de Asistencia CVV

## 🏗️ **Arquitectura General**

### **Componentes Principales:**
- **AttendanceSystemCVV.jsx** - Componente principal que orquesta toda la aplicación
- **useWeekAttendance.js** - Hook personalizado que maneja toda la lógica de negocio
- **AttendanceTable.jsx** - Tabla principal de asistencia con celdas editables
- **CountersTable.jsx** - Tabla de resumen con contadores por empleado
- **TabsContainer.jsx** - Sistema de pestañas con navegación de rangos de fechas
- **WeekPickerCalendar.jsx** - Calendario para selección de rangos personalizados
- **EditableCell.jsx** - Celda individual editable (hora + status)
- **TimeEditor.jsx** - Editor inline de horas
- **StatusMenu.jsx** - Menú contextual para cambiar status

## 🎯 **Funcionalidades Core**

### **1. Gestión de Rangos de Fechas Dinámicos**
```javascript
// Estado del rango actual
const [currentRangeStart, setCurrentRangeStart] = useState(initialDate);
const [currentRangeEnd, setCurrentRangeEnd] = useState(endDate);

// Generación dinámica de días
const generateRangeDays = (startDate, endDate) => {
  // Genera array de días entre las fechas
  // Incluye información: fecha, día semana, fullDate, isWeekend
}
```

**Características:**
- ✅ **Rango flexible**: Desde 1 día hasta 30 días máximo
- ✅ **Navegación inteligente**: Anterior/Siguiente mantiene duración del rango
- ✅ **Selector personalizado**: Calendario con validación visual

### **2. Sistema de Doble Edición por Celda**
```javascript
// Cada celda maneja:
- Hora (clic izquierdo) - Solo gerentes
- Status (clic derecho) - Todos los usuarios
```

**Estados por celda:**
- `normal` - Verde claro
- `retardo` - Amarillo/Naranja  
- `falta` - Rojo/Rosa
- `permiso` - Morado
- `vacaciones` - Verde

### **3. Control de Roles y Permisos**
```javascript
const [esGerente, setEsGerente] = useState(false);

// Restricciones por rol:
- Usuario normal: Solo puede cambiar status
- Gerente: Puede editar horas + status
```

## 🔄 **Flujo de Datos**

### **Hook useWeekAttendance (Gestor Central)**
```javascript
return {
  // Estado del rango
  currentRangeStart, currentRangeEnd, currentDays,
  
  // Datos procesados
  empleadosNormalizados, horarios,
  
  // Estados de celdas
  cellStatuses, setCellStatuses,
  
  // Funciones de navegación
  handleWeekChange, getCurrentWeekDisplay,
  
  // Funciones de edición
  handleTimeChange, handleStatusChange, getCellStatus,
  
  // Selector de fechas
  handleRangeSelect, showWeekPicker, weekPickerPosition
};
```

### **Transformación de Datos**
1. **testData** (datos brutos) → 
2. **generateRangeData()** (datos por rango) →
3. **normalizeEmployeesData()** (estructura consistente) →
4. **generateHorarios()** (formato tabla) →
5. **Renderizado en tabla**

## 🎨 **Sistema de Interfaces**

### **Tabla Principal (AttendanceTable)**
- **Headers dinámicos**: Se generan según días del rango
- **Celdas editables**: Doble funcionalidad (hora/status)
- **Scroll horizontal**: Para rangos largos
- **Estilos condicionales**: Según status y permisos

### **Calendario de Selección (WeekPickerCalendar)**
- **Selección en 2 pasos**: Inicio → Fin → Confirmar
- **Validación visual**: Rangos > 30 días en rojo
- **Posicionamiento inteligente**: Se ajusta a pantalla
- **Feedback inmediato**: Tooltips y colores

### **Sistema de Pestañas (TabsContainer)**
- **Tab 1**: Tabla de asistencias (edición)
- **Tab 2**: Tabla de contadores (solo lectura)
- **Navegación de fechas**: Integrada en header

## ⚙️ **Gestión de Estado**

### **Estados Locales por Componente:**
```javascript
// AttendanceSystemCVV
const [esGerente, setEsGerente] = useState(false);

// useWeekAttendance
const [currentRangeStart, setCurrentRangeStart] = useState();
const [currentRangeEnd, setCurrentRangeEnd] = useState();
const [cellStatuses, setCellStatuses] = useState({});
const [currentRangeData, setCurrentRangeData] = useState([]);

// WeekPickerCalendar
const [selectedStartDate, setSelectedStartDate] = useState(null);
const [selectedEndDate, setSelectedEndDate] = useState(null);
const [showMaxDaysWarning, setShowMaxDaysWarning] = useState(false);
```

### **Persistencia de Cambios:**
- **Cambios de hora**: Actualizan `currentRangeData`
- **Cambios de status**: Actualizan `cellStatuses`
- **Navegación**: Regenera datos para nuevo rango

## 🛡️ **Validaciones y Restricciones**

### **Límite de 30 Días**
```javascript
const MAX_DAYS = 30;
const validateDateRange = (startDate, endDate) => {
  const dayCount = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
  return { isValid: dayCount <= MAX_DAYS, dayCount };
};
```

### **Validación de Horas**
```javascript
const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
// Acepta: HH:MM o "--"
```

### **Control de Permisos**
- **Edición de horas**: Solo modo gerente
- **Feedback visual**: Celdas grises para usuarios sin permisos
- **Tooltips informativos**: Explican limitaciones

## 🎛️ **Interacciones de Usuario**

### **Navegación de Fechas:**
1. **Flechas anterior/siguiente**: Mueve rango completo
2. **Clic en selector**: Abre calendario
3. **Selección en calendario**: Inicio → Fin → Confirmar

### **Edición de Celdas:**
1. **Clic izquierdo**: Edita hora (solo gerente)
2. **Clic derecho**: Cambia status (todos)
3. **Enter/Escape**: Confirma/cancela edición

### **Cambio de Vista:**
1. **Tab Asistencias**: Vista de edición
2. **Tab Contadores**: Vista de resumen
3. **Modo gerente**: Toggle de permisos

## 📊 **Estructura de Datos**

### **testData.js - Datos de Prueba**
```javascript
{
  employees: [{ id, name, plaza }],
  attendanceData: {
    employees: [{
      id, name, plaza,
      records: [{
        date, dayOfWeek,
        entrada: { time, status, originalTime },
        salida: { time, status, originalTime }
      }]
    }]
  },
  days: [{ fecha, dia, fullDate, month, isWeekend }]
}
```

### **Estados Calculados**
```javascript
// cellStatuses: Mapeo de status por celda
"1-0-entrada": "retardo"  // empleadoId-dayIndex-tipo
"1-0-salida": "normal"

// horarios: Formato para tabla
horarios[empleadoId] = ["08:00/16:00", "RETARDO", "--/--"]
```

## 🚀 **Optimizaciones**

### **Renderizado Eficiente:**
- **useEffect con dependencias**: Solo regenera cuando cambian fechas
- **React.Fragment**: Evita nodos DOM extra
- **Estilos inline calculados**: Solo cuando necesario

### **Gestión de Memoria:**
- **Estados localizados**: Cada componente maneja su estado
- **Cleanup en useEffect**: Limpia event listeners
- **Validaciones tempranas**: Evita cálculos innecesarios

## 🔧 **Utilidades Helper**

```javascript
// Fechas
addDays(date, days) // Suma días a fecha
formatDate(date) // YYYY-MM-DD
getDayName(date) // "Lun", "Mar", etc.

// Validaciones
validateDateRange(start, end) // Verifica límites
wouldExceedMaxDays(start, end) // Preview validación

// Transformaciones
normalizeEmployeesData() // Estructura consistente
generateHorarios() // Formato tabla
initializeCellStatuses() // Status iniciales
```

## 📱 **Responsive y UX**

### **Adaptabilidad:**
- **Scroll horizontal**: Para rangos largos
- **Posicionamiento dinámico**: Calendario se ajusta
- **Feedback visual**: Estados claros y colores consistentes

### **Accesibilidad:**
- **Tooltips informativos**: Explican funcionalidad
- **Cursors apropiados**: pointer, not-allowed, etc.
- **Contraste adecuado**: Textos legibles en todos los fondos

## 🎯 **Casos de Uso Principal**

1. **Administrador selecciona semana** → Ve tabla con todos los empleados
2. **Administrador edita horas** → Clic izquierdo en celdas
3. **Usuario cambia status** → Clic derecho en celdas  
4. **Navegación temporal** → Flechas o calendario personalizado
5. **Vista resumen** → Tab contadores para estadísticas

Esta arquitectura modular permite escalabilidad, mantenimiento sencillo y experiencia de usuario fluida. 🚀