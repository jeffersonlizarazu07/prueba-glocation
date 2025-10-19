import prisma from "../prismaClient.js";
import openAI from "openai";

/* CRUD básico */
export const createProyect = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const proyecto = await prisma.proyecto.findUnique({
      where: { id },
      select: { descripcion: true }
    });

    if (!proyecto) return res.status(404).json({ error: 'Proyecto no encontrado' });

    // Llamada a la API de IA con la descripción de un solo proyecto
    const resumen = `Resumen simulado de proyecto: ${proyecto.descripcion.slice(0, 100)}...`;

    res.json({ resumen });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error generando resumen' });
  }
};

export const listProyects = async (req, res) => {
  try {
    const proyects = await prisma.proyecto.findMany({
      orderBy: { id: "desc" },
    });
    res.json(proyects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error listando proyectos" });
  }
};

export const getProyect = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const proyect = await prisma.proyecto.findUnique({ where: { id } });
    if (!proyect)
      return res.status(404).json({ error: "Proyecto no encontrado" });
    res.json(proyect);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo proyecto" });
  }
};

export const updateProyect = async (req, res) => {
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

export const deleteProyect = async (req, res) => {
  try {
    const id = Number(req.params.id);
    await prisma.proyecto.delete({ where: { id } });
    res.json({ ok: true, msg: "Proyecto eliminado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error eliminando proyecto" });
  }
};

/* /graficos -> agregados */
export const proyectGraphics = async (req, res) => {
  try {
    const resultados = await prisma.proyecto.groupBy({
      by: ["estado"], // Agrupamos por estado
      _count: { estado: true }, // Contamos proyectos por estado
      orderBy: { estado: "asc" }, // Opcional: orden alfabético
    });

    const data = resultados.map((r) => ({
      estado: r.estado,
      cantidad: r._count.estado,
    }));

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error generando gráficos de proyectos" });
  }
};

/* /analisis -> resumen de descripciones (placeholder + ejemplo integración AI) */
const openai = new openAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const proyectAnalysis = async (req, res) => {
  try {
    const proyectos = await prisma.proyecto.findMany({
      select: { descripcion: true },
    });
    const descripciones = proyectos.map((p) => p.descripcion).join(" ");

    const prompt = `Genera un resumen breve de los siguientes proyectos: ${descripciones}`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const resumen = response.choices[0].message.content;

    res.json({ resumen });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error generando resumen" });
  }
};
