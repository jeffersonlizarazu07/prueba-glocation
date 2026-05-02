const BASE =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api/proyectos";

export async function listar() {
  const r = await fetch(BASE);
  if (!r.ok) throw new Error("Error listar");
  return r.json();
}

export async function crear(payload) {
  const r = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return r.json();
}

export async function actualizar(id, payload) {
  const r = await fetch(`${BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return r.json();
}

export async function eliminar(id) {
  const r = await fetch(`${BASE}/${id}`, { method: "DELETE" });
  return r.json();
}

export async function solicitarResumen() {
  const r = await fetch(`${BASE}/analisis`);
  if (!r.ok) throw new Error("Error al crear análisis");
  return r.json();
}

export async function obtenerGraficos() {
  try {
    const r = await fetch(`${BASE}/graficos`);
    if (!r.ok) {
      console.error("Error al obtener gráficos", r.status);
      return { totalProyectos: 0, data: [] };
    }

    const payload = await r.json();
    // Si el backend devuelve directamente un array de estados agregados
    if (Array.isArray(payload)) {
      const normalized = payload.map((it) => {
        const estado =
          (it.estado && String(it.estado)) ||
          (it.name && String(it.name)) ||
          (it.nombre && String(it.nombre)) ||
          "Desconocido";

        let count = 0;
        if (it.count != null) count = Number(it.count);
        else if (it._count != null) {
          if (typeof it._count === "number") count = it._count;
          else if (typeof it._count === "object") {
            const vals = Object.values(it._count).filter(
              (v) => typeof v === "number"
            );
            count = vals.length ? Number(vals[0]) : 0;
          }
        } else if (it.total != null) count = Number(it.total);
        return { estado, count };
      });

      const total = normalized.reduce((s, x) => s + (Number(x.count) || 0), 0);
      return { totalProyectos: total, data: normalized };
    }

    // Fallback: no data estructurada -> devolver vacío
    return { totalProyectos: 0, data: [] };
  } catch (error) {
    console.error("Error al obtener gráficos.", error);
    return { totalProyectos: 0, data: [] };
  }
}
