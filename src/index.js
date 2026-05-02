import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { PORT } from './config.js';
import projectRouter from '../src/routes/projectRoutes.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger.js';

const app = express();
app.use(express.json());

app.use(cors()); // Habilita cors para todas las rutas
app.use(bodyParser.json());
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));// Documentación Swagger
app.use('/api/proyectos', projectRouter); // Ruta general

app.get('/', (req, res) => res.json({ ok: true, msg: 'API Backend funcionando' }));

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));


