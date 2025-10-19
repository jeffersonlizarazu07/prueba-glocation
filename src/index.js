import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { PORT } from './config.js';
import proyectRouter from '../src/routes/proyectRoutes.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger.js';

const app = express();
app.use(express.json());

app.use(cors());
app.use(bodyParser.json());
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/proyectos', proyectRouter);

app.get('/', (req, res) => res.json({ ok: true, msg: 'API Backend funcionando' }));

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));


