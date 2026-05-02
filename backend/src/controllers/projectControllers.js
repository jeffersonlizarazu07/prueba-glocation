import prisma from "../prismaClient.js";
import { groq } from "../config.js";

/* CRUD básico */
export const createProject = async (req, res) => {
  try {
    // Extrae los campos requeridos del body de la petición
    const { nombre, descripcion, estado, fechaInicio, fechaFin } = req.body;
    // Convierte las fechas de string ISO a objetos Date
    const project = await prisma.proyecto.create({
      data: {
        nombre,
        descripcion,
        estado,
        fechaInicio: new Date(fechaInicio),
        fechaFin: new Date(fechaFin),
      },
    });
    res.status(201).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creando proyecto' });
  }
};

export const listProjects = async (req, res) => {
  try {
    // Obtiene todos los proyectos ordenados del más reciente al más antiguo
    const projects = await prisma.proyecto.findMany({
      orderBy: { id: "desc" },
    });
    res.json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error listando proyectos" });
  }
};

export const getProject = async (req, res) => {
  try {
    // Convierte el parámetro de ruta a número para la búsqueda
    const id = Number(req.params.id);
    const project = await prisma.proyecto.findUnique({ where: { id } });
    // Valida que el proyecto exista
    if (!project)
      return res.status(404).json({ error: "Proyecto no encontrado" });
    res.json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo proyecto" });
  }
};

export const updateProject = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { nombre, descripcion, estado, fechaInicio, fechaFin } = req.body;
    const proyecto = await prisma.proyecto.update({
      where: { id },
      data: {
        nombre,
        descripcion,
        estado,
        fechaInicio: fechaInicio ? new Date(fechaInicio) : undefined,
        fechaFin: fechaFin ? new Date(fechaFin) : undefined,
      },
    });
    res.json(proyecto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error actualizando proyecto" });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const id = Number(req.params.id);
    await prisma.proyecto.delete({ where: { id } });
    res.json({ ok: true, msg: "Proyecto eliminado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error eliminando proyecto" });
  }
};
