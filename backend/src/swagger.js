import swaggerJSDoc from 'swagger-jsdoc';

// Definición básica de Swagger
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API Proyectos - GLocation Test',
    version: '1.0.0',
    description: 'Documentación de la API REST de proyectos para prueba técnica',
  },
  servers: [
    {
      url: 'http://localhost:3000/api',
      description: 'Servidor de desarrollo',
    },
  ],
  components: {
    schemas: {
      Proyecto: {
        type: 'object',
        required: ['nombre', 'descripcion', 'estado', 'fechaInicio', 'fechaFin'],
        properties: {
          id: {
            type: 'integer',
            example: 1,
          },
          nombre: {
            type: 'string',
            example: 'Proyecto Manhattan',
          },
          descripcion: {
            type: 'string',
            example: 'Proyecto secreto de desarrollo histórico...',
          },
          estado: {
            type: 'string',
            enum: ['en progreso', 'pendiente', 'finalizado'],
            example: 'en progreso',
          },
          fechaInicio: {
            type: 'string',
            format: 'date',
            example: '2021-01-07',
          },
          fechaFin: {
            type: 'string',
            format: 'date',
            example: '2024-02-17',
          },
        },
      },
    },
  },
};

// Opciones Swagger Jsdoc
const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.js'], // Aquí busca los comentarios en tus rutas
};

const swaggerSpec = swaggerJSDoc(options); // Especificación de Swagger

export default swaggerSpec;