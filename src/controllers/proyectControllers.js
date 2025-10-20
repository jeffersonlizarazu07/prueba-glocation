import prisma from "../prismaClient.js";
import { groq } from "../config.js";

/* CRUD básico */
export const createProyect = async (req, res) => {
  try {
    const { nombre, descripcion, estado, fechaInicio, fechaFin } = req.body;
    const proyect = await prisma.proyecto.create({
      data: {
        nombre,
        descripcion,
        estado,
        fechaInicio: new Date(fechaInicio),
        fechaFin: new Date(fechaFin),
      },
    });
    res.status(201).json(proyect);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creando proyecto' });
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
export const proyectAnalysis = async (req, res) => {
  try {
    const proyectos = await prisma.proyecto.findMany({
      select: { descripcion: true },
    });

    if (!proyectos.length) {
      return res.status(400).json({ error: "No hay proyectos para analizar" });
    }

    // Concatenar descripciones
    const textoDescripciones = proyectos
      .map((p) => p.descripcion)
      .join(". ")
      .slice(0, 16000);

    // Prompt para Groq
    const prompt = `
      A partir de las siguientes descripciones de proyectos,
      genera un resumen profesional en español que explique
      el objetivo general de los proyectos y su enfoque,
      sin inventar información adicional.
      ---
      ${textoDescripciones}
    `;

    // Llamada a Groq con modelo actualizado
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile", // Versión del modelo actualizada
      messages: [{ role: "user", content: prompt }],
      max_tokens: 350,
      temperature: 0.4,
    });

    const resumen =
      completion?.choices?.[0]?.message?.content ||
      "No fue posible generar un resumen.";

    res.json({
      totalProyectos: proyectos.length,
      analisis: resumen,
    });

  } catch (error) {
    console.error("Error en análisis IA:", error);
    res.status(500).json({
      error: "Error generando análisis con IA",
      details: error.message,
    });
  }
};