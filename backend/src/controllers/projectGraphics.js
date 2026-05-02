import prisma from "../prismaClient.js";

export const projectGraphics = async (req, res) => {
  try {
    // Obtiene el total de proyectos registrados
    const totalProyectos = await prisma.proyecto.count();

    // Agrupa proyectos por estado y cuenta las ocurrencias
    // Ordena alfabéticamente para consistencia en la visualización
    const resultados = await prisma.proyecto.groupBy({
      by: ["estado"],
      _count: { estado: true },
      orderBy: { estado: "asc" },
    });

    // Transforma los resultados con valores por defecto para estados nulos
    const data = resultados.map((r) => ({
      estado: r.estado || "Desconocido",
      count: r._count?.estado ?? 0,
    }));

    // Agrupa proyectos por año (fechaInicio) en el backend
    const proyectosConFechas = await prisma.proyecto.findMany({
      select: { fechaInicio: true },
    });

    // Procesa las fechas en memoria para agrupar por año
    const yearMap = {};
    proyectosConFechas.forEach((p) => {
      const d = p?.fechaInicio ? new Date(p.fechaInicio) : null;
      // Valida que la fecha sea válida antes de procesarla
      if (d instanceof Date && !isNaN(d)) {
        const y = String(d.getFullYear());
        yearMap[y] = (yearMap[y] || 0) + 1;
      }
    });

    // Convierte el mapa a array y ordena cronológicamente
    const yearData = Object.keys(yearMap)
      .sort((a, b) => Number(a) - Number(b))
      .map((y) => ({ year: y, count: yearMap[y] }));

    // Retorna las tres métricas principales para los dashboards
    res.json({
      totalProyectos,
      data, // [{ estado, count }]
      yearData, // [{ year, count }]
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "No existen proyectos para graficar" });
    res.status(500).json({ error: "Error generando gráficos de proyectos" });
  }
};
