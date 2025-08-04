# 📋 Especificación Técnica - Backend Sistema de Asistencia CVV

## 🎯 **Objetivo del Sistema**

Crear un backend que gestione registros de asistencia de empleados por plaza, permitiendo:
- **Consulta de rangos de fechas** (1-30 días máximo)
- **Edición de horas** (solo gerentes) y **status** (todos los usuarios)
- **Control de permisos** por plaza y rol de usuario
- **Auditoría completa** de cambios

---

## 📊 **Modelo de Datos Requerido**

### **Entidad: Usuario**
```
- id (Primary Key)
- name (Nombre completo)
- email (Único)
- plaza (Código de plaza ej: "CVV-20")
- role (administradora|gerente|usuario)
- created_at
```

**Reglas de negocio:**
- `administradora`: Acceso a todas las plazas + edición de horas
- `gerente`: Acceso a su plaza + edición de horas
- `usuario`: Acceso a su plaza + solo cambio de status

### **Entidad: Empleado**
```
- id (Primary Key)
- name (Nombre completo)
- plaza (Código de plaza)
- active (Boolean - empleado activo)
- hire_date (Fecha de contratación)
- created_at
```

### **Entidad: Registro de Asistencia**
```
- id (Primary Key)
- employee_id (Foreign Key → Empleado)
- date (Fecha del registro)
- day_of_week (Lun, Mar, Mié, etc.)

-- ENTRADA --
- entrada_time (HH:MM o NULL)
- entrada_status (normal|retardo|falta|permiso|vacaciones)
- entrada_original_time (Para auditoría)
- entrada_modified_by (Foreign Key → Usuario)
- entrada_modified_at (Timestamp)

-- SALIDA --
- salida_time (HH:MM o NULL)
- salida_status (normal|retardo|falta|permiso|vacaciones)
- salida_original_time (Para auditoría)
- salida_modified_by (Foreign Key → Usuario)
- salida_modified_at (Timestamp)

- created_at
- updated_at
```

**Índices requeridos:**
- `UNIQUE(employee_id, date)` - Un registro por empleado por día
- `INDEX(employee_id, date)` - Consultas por rango
- `INDEX(date)` - Consultas generales por fecha

### **Entidad: Log de Auditoría** (Opcional pero recomendada)
```
- id (Primary Key)
- table_name (Tabla modificada)
- record_id (ID del registro modificado)
- action (CREATE|UPDATE|DELETE)
- old_values (JSON con valores anteriores)
- new_values (JSON con valores nuevos)
- modified_by (Foreign Key → Usuario)
- modified_at (Timestamp)
```

---

## 🔌 **Endpoints de API Requeridos**

### **1. Obtener Datos de Rango de Fechas**

```http
GET /api/attendance/range?start_date=2024-08-16&end_date=2024-08-22&plaza=CVV-20
```

**Validaciones:**
- ✅ Rango máximo 30 días
- ✅ Usuario tiene acceso a la plaza
- ✅ Fechas en formato válido (YYYY-MM-DD)

**Lógica:**
1. Obtener empleados activos de la plaza
2. Generar array de fechas entre inicio y fin
3. Buscar registros existentes para empleados + fechas
4. **IMPORTANTE**: Completar días vacíos con registros default
5. Formatear respuesta según estructura esperada

**Respuesta esperada:**
```json
{
  "period": {
    "start_date": "2024-08-16",
    "end_date": "2024-08-22",
    "total_days": 7
  },
  "employees": [
    {
      "id": 1,
      "name": "MIGUEL ANGEL ROMERO GUEVARA", 
      "plaza": "CVV-20",
      "records": [
        {
          "date": "2024-08-16",
          "day_of_week": "Vie",
          "entrada": {
            "time": "07:43",
            "status": "normal",
            "original_time": "07:43"
          },
          "salida": {
            "time": "15:55", 
            "status": "normal",
            "original_time": "15:55"
          }
        },
        {
          "date": "2024-08-17",
          "day_of_week": "Sáb", 
          "entrada": {
            "time": "--",
            "status": "normal",
            "original_time": null
          },
          "salida": {
            "time": "--",
            "status": "normal", 
            "original_time": null
          }
        }
        // ... más días
      ]
    }
    // ... más empleados
  ]
}
```

### **2. Actualizar Status de Asistencia**

```http
PATCH /api/attendance/status
Content-Type: application/json

{
  "employee_id": 1,
  "date": "2024-08-16",
  "type": "entrada",  // o "salida"
  "new_status": "retardo"
}
```

**Validaciones:**
- ✅ Usuario tiene acceso a la plaza del empleado
- ✅ Status válido (normal|retardo|falta|permiso|vacaciones)
- ✅ Type válido (entrada|salida)

**Lógica:**
1. Buscar o crear registro de asistencia
2. Actualizar solo el campo de status correspondiente
3. Marcar quién y cuándo modificó
4. Guardar en log de auditoría
5. Retornar registro actualizado

### **3. Actualizar Hora de Asistencia** (Solo Gerentes)

```http
PATCH /api/attendance/time
Content-Type: application/json

{
  "employee_id": 1,
  "date": "2024-08-16", 
  "type": "entrada",  // o "salida"
  "new_time": "08:00"  // o "--" para vacío
}
```

**Validaciones:**
- ✅ Usuario es gerente o administradora
- ✅ Usuario tiene acceso a la plaza del empleado
- ✅ Formato de hora válido (HH:MM) o "--"

**Lógica:**
1. Verificar rol de gerente
2. Buscar o crear registro de asistencia
3. **Si es la primera modificación**: Guardar hora actual en `original_time`
4. Actualizar hora y metadatos de modificación
5. Guardar en log de auditoría

### **4. Obtener Empleados por Plaza**

```http
GET /api/employees?plaza=CVV-20
```

**Respuesta:**
```json
[
  {
    "id": 1,
    "name": "MIGUEL ANGEL ROMERO GUEVARA",
    "plaza": "CVV-20", 
    "active": true
  }
  // ... más empleados
]
```

### **5. Obtener Contadores** (Opcional - para Tab de estadísticas)

```http
GET /api/attendance/counters?start_date=2024-08-16&end_date=2024-08-22&plaza=CVV-20
```

**Respuesta:**
```json
{
  "employees": [
    {
      "id": 1,
      "name": "MIGUEL ANGEL ROMERO GUEVARA",
      "counters": {
        "normal": 8,
        "retardo": 1, 
        "falta": 0,
        "permiso": 0,
        "vacaciones": 0
      }
    }
  ],
  "summary": {
    "total_employees": 3,
    "avg_attendance_rate": 0.85
  }
}
```

---

## 🔒 **Reglas de Seguridad y Permisos**

### **Control de Acceso por Plaza:**
```
- administradora → Todas las plazas
- gerente → Solo su plaza
- usuario → Solo su plaza  
```

### **Control de Modificaciones:**
```
- Horas → Solo gerente + administradora
- Status → Todos los usuarios (con acceso a plaza)
```

### **Validaciones Críticas:**
- ✅ Máximo 30 días por consulta
- ✅ Formato de hora: `^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$`
- ✅ Status válidos únicamente
- ✅ Un registro por empleado por día

---

## ⚡ **Optimizaciones Requeridas**

### **Base de Datos:**
- **Índices en campos de consulta frecuente**
- **Constraints para integridad** (UNIQUE employee_id + date)
- **Foreign Keys con CASCADE apropiado**

### **Queries Eficientes:**
- **Una sola query** para traer empleados + registros de un rango
- **LEFT JOIN** para incluir empleados sin registros
- **Prefetch relacionados** para evitar N+1

### **Ejemplo de Query SQL:**
```sql
SELECT 
    e.id, e.name, e.plaza,
    ar.date, ar.day_of_week,
    ar.entrada_time, ar.entrada_status, ar.entrada_original_time,
    ar.salida_time, ar.salida_status, ar.salida_original_time
FROM employees e
LEFT JOIN attendance_records ar ON e.id = ar.employee_id 
    AND ar.date BETWEEN ? AND ?
WHERE e.plaza = ? AND e.active = TRUE
ORDER BY e.name, ar.date;
```

---

## 🧩 **Lógica de Completado de Datos**

### **Problema:** 
El frontend espera **TODOS los días del rango** para cada empleado, pero la DB solo tiene registros para días con datos.

### **Solución:**
1. **Generar rango completo** de fechas entre inicio y fin
2. **Para cada empleado**: Buscar registros existentes
3. **Completar días faltantes** con estructura default:
   ```json
   {
     "date": "2024-08-17",
     "day_of_week": "Sáb",
     "entrada": {"time": "--", "status": "normal", "original_time": null},
     "salida": {"time": "--", "status": "normal", "original_time": null}
   }
   ```

### **Pseudocódigo:**
```
empleados = obtener_empleados_por_plaza(plaza)
rango_fechas = generar_fechas(inicio, fin)

para cada empleado:
    registros_existentes = obtener_registros(empleado, inicio, fin)
    registros_completos = []
    
    para cada fecha en rango_fechas:
        si existe registro para fecha:
            agregar registro_existente
        sino:
            agregar registro_vacio_default
    
    empleado.records = registros_completos
```

---

## 📝 **Headers y Autenticación**

### **Headers Requeridos:**
```http
Authorization: Bearer <token>
Content-Type: application/json
```

### **Respuestas de Error:**
```json
// 400 Bad Request
{
  "error": "Rango no puede exceder 30 días"
}

// 403 Forbidden  
{
  "error": "Sin permisos para acceder a esta plaza"
}

// 404 Not Found
{
  "error": "Empleado no encontrado"
}
```

---

## 🚀 **Consideraciones de Implementación**

### **Framework Recomendado:**
- **Django + DRF** (Python)
- **Laravel** (PHP) 
- **Express + Sequelize** (Node.js)
- **Spring Boot** (Java)

### **Base de Datos:**
- **PostgreSQL** (recomendado por JSON fields y performance)
- **MySQL** (alternativa válida)

### **Caching Estratégico:**
- **Lista de empleados por plaza** (cambia poco)
- **Configuraciones de usuario** (roles, permisos)

### **Testing Crítico:**
- ✅ Validación de permisos por plaza
- ✅ Completado correcto de días vacíos
- ✅ Restricción de 30 días máximo
- ✅ Auditoría de cambios
- ✅ Concurrencia en updates

---

## 📋 **Checklist de Entrega**

### **Funcional:**
- [ ] Endpoint de rango con completado de días vacíos
- [ ] Update de status (todos los usuarios)  
- [ ] Update de horas (solo gerentes)
- [ ] Control de permisos por plaza
- [ ] Validación de 30 días máximo
- [ ] Log de auditoría

### **No Funcional:**
- [ ] Autenticación por tokens
- [ ] Manejo de errores consistente
- [ ] Validaciones de entrada robustas
- [ ] Queries optimizadas
- [ ] Tests unitarios críticos
- [ ] Documentación de API (Swagger/OpenAPI)

---

## 💡 **Datos de Prueba Sugeridos**

```sql
-- Usuarios
INSERT INTO users VALUES 
(1, 'Ana García', 'ana@empresa.com', 'CVV-20', 'administradora'),
(2, 'Carlos López', 'carlos@empresa.com', 'CVV-20', 'gerente'),
(3, 'María Ruiz', 'maria@empresa.com', 'CVV-20', 'usuario');

-- Empleados  
INSERT INTO employees VALUES
(1, 'MIGUEL ANGEL ROMERO GUEVARA', 'CVV-20', true),
(2, 'MARIA GABRIELA NUCHE SANTACRUZ', 'CVV-20', true),
(3, 'JOCELINE SALDAÑA PEREZ', 'CVV-20', true);

-- Registros de ejemplo
INSERT INTO attendance_records VALUES
(1, 1, '2024-08-16', 'Vie', '07:43', 'normal', '07:43', '15:55', 'normal', '15:55'),
(2, 1, '2024-08-19', 'Lun', '08:15', 'retardo', '08:15', '16:05', 'normal', '16:05');
```

Este backend debe integrarse perfectamente con el frontend existente sin requerir cambios en la interfaz. 🎯