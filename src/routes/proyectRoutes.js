import { Router } from "express";

import {
  createProyect,
  listProyects,
  getProyect,
  updateProyect,
  deleteProyect,
  proyectGraphics,
  proyectAnalysis,
} from "../controllers/proyectControllers.js";

const router = Router();

// Endpoints adicionales para análisis y gráficos

router.get('/graficos', proyectGraphics);

router.get('/analisis/:id', proyectAnalysis);


/**
 * @swagger
 * /proyectos:
 *   post:
 *     summary: Crear un nuevo proyecto
 *     tags: [Proyectos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Proyecto'
 *     responses:
 *       201:
 *         description: Proyecto creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Proyecto'
 *       500:
 *         description: Error creando proyecto
 */

router.post("/", createProyect); // Crear

/**
 * @swagger
 * /proyectos:
 *   get:
 *     summary: Listar todos los proyectos
 *     tags: [Proyectos]
 *     responses:
 *       200:
 *         description: Lista de proyectos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Proyecto'
 *       500:
 *         description: Error listando proyectos
 */

router.get("/", listProyects); // Listar

/**
 * @swagger
 * /proyectos/{id}:
 *   get:
 *     summary: Obtener un proyecto por ID
 *     tags: [Proyectos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Proyecto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Proyecto'
 *       404:
 *         description: Proyecto no encontrado
 *       500:
 *         description: Error obteniendo proyecto
 */

router.get("/:id", getProyect); // Obtener uno

/**
 * @swagger
 * /proyectos/{id}:
 *   put:
 *     summary: Actualizar un proyecto por ID
 *     tags: [Proyectos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Proyecto'
 *     responses:
 *       200:
 *         description: Proyecto actualizado
 *       404:
 *         description: Proyecto no encontrado
 *       500:
 *         description: Error actualizando proyecto
 */

router.put("/:id", updateProyect); // Actualizar

/**
 * @swagger
 * /proyectos/{id}:
 *   delete:
 *     summary: Eliminar un proyecto por ID
 *     tags: [Proyectos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Proyecto eliminado
 *       404:
 *         description: Proyecto no encontrado
 *       500:
 *         description: Error eliminando proyecto
 */

router.delete("/:id", deleteProyect); // Eliminar

export default router;
