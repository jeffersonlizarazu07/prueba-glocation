import prisma from "../prismaClient.js";
import { groq } from "../config.js";

export const projectAnalysis = async (req, res) => {
  try {
    // Obtiene únicamente las descripciones de todos los proyectos
    const proyectos = await prisma.proyecto.findMany({
      select: { descripcion: true },
    });

    // Valida que existan proyectos para analizar
    if (!proyectos.length) {
      return res.status(400).json({ error: "No hay proyectos para analizar" });
    }

    // Concatena todas las descripciones en un solo texto
    // Limita a 16000 caracteres para no exceder el límite del modelo
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

    // Ejecuta la llamada al servicio de Groq con configuración optimizada
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile", // Modelo LLaMA optimizado para versatilidad
      messages: [{ role: "user", content: prompt }],
      max_tokens: 350, // Limita la longitud de la respuesta
      temperature: 0.4, // Temperatura baja para respuestas más consistentes y predecibles
    });

    // Extrae el contenido de la respuesta con validación de estructura
    const resumen =
      completion?.choices?.[0]?.message?.content ||
      "No fue posible generar un resumen.";

    // Retorna el análisis generado junto con metadata
    res.json({
      totalProyectos: proyectos.length,
      analisis: resumen,
    });
  } catch (error) {
    // Manejo centralizado de errores con logging
    console.error("Error en análisis IA:", error);
    res.status(400).json({
      error: "No existen proyectos para analizar con la IA",
      details: error.message,
    });
    res.status(500).json({
      error: "Error generando análisis con IA",
      details: error.message,
    });
  }
};
