# Prueba-project — Backend

Descripción
API REST para gestión de proyectos desarrollada con Node.js, Express y Prisma ORM.

- Expone endpoints bajo /api/proyectos consumidos por el frontend.
- Gestión completa de proyectos (CRUD).
- Endpoints de análisis y datos agregados para visualizaciones.

Repositorio Relacionado

Frontend: (https://github.com/jeffersonlizarazu07/prueba-glocation-frontend.git)

Prerequisitos
- Node.js >= 16
- npm o yarn
- Base de datos compatible con Prisma (Postgres, MySQL, SQLite)
- (Opcional) curl, Thunder Client o Postman

Variables de entorno (ejemplo)
- Crear `backend/.env` con al menos:
```
DATABASE_URL="postgresql://user:password@localhost:5432/dbname?schema=public"
PORT=3000
GROQ_API_KEY= MY-API_KEY
```

Instalación y configuración
```powershell
# Navegar al directorio del backend
cd c:\Users\jeffe\Desktop\Prueba-project\backend

# Instalar dependencias
npm install

# Generar el cliente de Prisma
npx prisma generate

# Crear/migrar el esquema de base de datos
npx prisma migrate dev --name init

# (Opcional) Poblar la base de datos con datos de ejemplo
npm run seed
```

Ejecutar servidor (desarrollo)
```powershell
npm run dev

Modo producción
npm start
```
Decisiones Técnicas 
```
Stack Tecnológico
```
- Node.js + Express: Elegido por su simplicidad, madurez y amplio ecosistema de middleware.
```
Prisma:

- Ventajas: Type-safe, migraciones automáticas, excelente DX con autocompletado.
- Alternativas consideradas: TypeORM, Sequelize.
- Soporte para múltiples bases de datos sin cambiar código.

Base de Datos y ORM:
```
Patrón MVC simplificado: Rutas → Controladores → Servicios/Prisma.
Separación de responsabilidades:

- /routes - Definición de endpoints.
- /controllers - Lógica de negocio y validaciones.
- Prisma Client - Acceso a datos.

Manejo de Fechas:
```
- Todas las fechas se almacenan como tipo DateTime en Prisma (ISO 8601).
- El endpoint /graficos agrupa por año extrayendo el año de fechaInicio.
- Se garantiza que fechaInicio nunca sea null mediante validaciones.

CORS:
```
- Configurado para permitir peticiones desde el frontend.
- En desarrollo: permite http://localhost:5173.
- En producción: restringido al dominio del frontend.

Agregaciones y Análisis:
```
- /graficos utiliza groupBy de Prisma para conteos eficientes.
- Cálculos de año mediante funciones de base de datos para mejor rendimiento.

Trade-offs Considerados
```
- Prisma vs SQL puro: Prisma sacrifica algo de control pero gana enormemente en productividad y type-safety.
- Agregaciones en BD vs código: Se prefirió hacer agregaciones en la base de datos para mejor performance con datasets grandes.
- Validaciones en backend vs frontend: Validaciones duplicadas en ambos lados (frontend para UX, backend para seguridad).

Rutas principales

http://localhost:3000/api/proyectos
```
- GET  /api/proyectos            — listar proyectos
```
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nombre": "Sistema de Inventario",
      "descripcion": "Desarrollo de sistema para control de inventarios",
      "estado": "En progreso",
      "fechaInicio": "2024-01-15T00:00:00.000Z",
      "fechaFin": "2024-06-30T00:00:00.000Z",
      "createdAt": "2024-10-01T10:30:00.000Z",
      "updatedAt": "2024-10-15T14:20:00.000Z"
    },
    {
      "id": 2,
      "nombre": "App Móvil E-commerce",
      "descripcion": "Aplicación móvil para ventas en línea",
      "estado": "Pendiente",
      "fechaInicio": "2024-03-01T00:00:00.000Z",
      "fechaFin": "2024-12-31T00:00:00.000Z",
      "createdAt": "2024-09-20T08:15:00.000Z",
      "updatedAt": "2024-09-20T08:15:00.000Z"
    }
  ],
  "count": 2
}


- POST /api/proyectos            — crear proyecto
```
Descripción: Crea un nuevo proyecto.
- body: { nombre, descripcion, estado, fechaInicio, fechaFin }

{
  "nombre": "Portal Web Corporativo",
  "descripcion": "Desarrollo de sitio web institucional",
  "estado": "Pendiente",
  "fechaInicio": "2024-11-01",
  "fechaFin": "2025-02-28"
}
  
- PUT  /api/proyectos/:id        — actualizar proyecto
```
Descripción: Actualiza un proyecto existente por su ID.
Parámetros URL:

- id (number): ID del proyecto a actualizar

{
  "success": true,
  "data": {
    "id": 3,
    "nombre": "Portal Web Corporativo",
    "descripcion": "Desarrollo de sitio web institucional con panel admin",
    "estado": "En progreso",
    "fechaInicio": "2024-11-01T00:00:00.000Z",
    "fechaFin": "2025-02-28T00:00:00.000Z",
    "createdAt": "2024-10-20T15:30:00.000Z",
    "updatedAt": "2024-10-20T16:45:00.000Z"
  },
  "message": "Proyecto actualizado exitosamente"
}

- DELETE /api/proyectos/:id      — eliminar proyecto
```
Descripción: Elimina un proyecto por su ID.
Parámetros URL:

- id (number): ID del proyecto a eliminar

{
  "success": true,
  "message": "Proyecto eliminado exitosamente"
}

- GET  /api/proyectos/graficos   — datos agregados para gráficas
  - respuesta recomendada:
  ```json
  {
    "totalProyectos": 9,
    "data": [{ "estado": "En progreso", "count": 4 }, ...],
    "yearData": [{ "year": "2024", "count": 5 }, ...]
  }
  ```
- GET  /api/proyectos/analisis   — resumen/analítica

Probar endpoints
```powershell
curl http://localhost:3000/api/proyectos
curl http://localhost:3000/api/proyectos/graficos
```

Notas de implementación
- Prisma maneja el acceso a BD. Asegurarse de que `fechaInicio` se guarda como Date/ISO para agrupados por año.
- Endpoint `/graficos` debe devolver agregados por estado (`data`) y opcionalmente `yearData` para la gráfica por año.

Depuración rápida
- Revisar logs del servidor y consola para errores.
- Si los conteos por año salen incorrectos, verificar que `fechaInicio` no sea null y tenga formato válido en la BD.
- Para problemas con Chart.js en frontend: usar `redraw` o `key` en los componentes de chart.

Sugerencias
- Añadir scripts package.json: `dev`, `start`, `migrate`, `seed`.
- Documentar schema.prisma y ejemplos de seed.
- Añadir tests básicos para los endpoints críticos.

📄 Licencia
Este proyecto es parte de una prueba técnica y está bajo licencia MIT.

👤 Autor
Jefferson Lizarazu.

GitHub: jeffersonlizarazu07.
Email: jeffersonlizarazu@hotmail.com.


Última actualización: Octubre 2024.