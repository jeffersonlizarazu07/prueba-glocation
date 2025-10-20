import React from "react";
import "../styles/ProjectReport.css";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

// Registrar los componentes necesarios de Chart.js (incluye ArcElement para torta)
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

export default function ProjectReport({
  data = [], // puede ser [{estado, count}] o lista de proyectos
  visible = false,
  projects = [], // fallback: lista completa de proyectos
  onBack = () => {},
}) {
  if (!visible) return null;

  // --- Aggregation por estado (mantener gráfico de barras) ---
  const aggregated =
    data.length > 0 && Object.prototype.hasOwnProperty.call(data[0], "count")
      ? data
      : (() => {
          const items =
            data.length > 0 &&
            Object.prototype.hasOwnProperty.call(data[0], "estado")
              ? data
              : projects;

          const map = {};
          items.forEach((p) => {
            let estadoLabel = "Desconocido";
            if (!p) {
              estadoLabel = "Desconocido";
            } else if (typeof p.estado === "string" && p.estado.trim() !== "") {
              estadoLabel = p.estado.trim();
            } else if (p.estado && typeof p.estado === "object") {
              estadoLabel =
                (p.estado.nombre && String(p.estado.nombre).trim()) ||
                (p.estado.name && String(p.estado.name).trim()) ||
                JSON.stringify(p.estado);
            } else if (p.estado == null && (p.nombreEstado || p.status)) {
              estadoLabel =
                (p.nombreEstado && String(p.nombreEstado).trim()) ||
                (p.status && String(p.status).trim()) ||
                "Desconocido";
            } else {
              estadoLabel = String(p.estado || "Desconocido").trim();
            }

            map[estadoLabel] = (map[estadoLabel] || 0) + 1;
          });
          return Object.entries(map).map(([estado, count]) => ({
            estado,
            count,
          }));
        })();

  const labels = aggregated.map((d) => d.estado);
  const values = aggregated.map((d) => d.count);

  const colors = [
    "#4f46e5",
    "#06b6d4",
    "#f59e0b",
    "#ef4444",
    "#10b981",
    "#8b5cf6",
    "#f97316",
    "#06b6a4",
  ];
  const backgroundColors = labels.map((_, i) => colors[i % colors.length]);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Proyectos por estado",
        data: values,
        backgroundColor: backgroundColors,
        borderRadius: 6,
      },
    ],
  };

  // --- Agrupar por año usando fecha de inicio (para la torta abajo) ---
  const rawItems =
    projects.length > 0
      ? projects
      : data.length > 0 && !data[0]?.count
      ? data
      : [];

  const yearMap = {};
  rawItems.forEach((p) => {
    if (!p) return;
    const dateCandidates = [
      p.fechaInicio,
      p.fecha_inicio,
      p.startDate,
      p.start_date,
      p.fechaInicioStr,
      p.fecha,
    ];
    const dateStr = dateCandidates.find((c) => c != null);
    let d = null;
    if (dateStr instanceof Date) d = dateStr;
    else if (typeof dateStr === "number") d = new Date(dateStr);
    else if (typeof dateStr === "string") {
      d = new Date(dateStr);
      if (isNaN(d)) {
        // intentar parsear si viene en formato "YYYY-MM-DD" sin zona
        const parts = dateStr.split("-");
        if (parts.length >= 3) {
          const y = Number(parts[0]);
          const m = Number(parts[1]) - 1;
          const day = Number(parts[2].slice(0, 2));
          d = new Date(y, m, day);
        }
      }
    }
    if (d instanceof Date && !isNaN(d)) {
      const y = String(d.getFullYear());
      yearMap[y] = (yearMap[y] || 0) + 1;
    }
  });

  const yearLabels = Object.keys(yearMap).sort((a, b) => Number(a) - Number(b));
  const yearValues = yearLabels.map((y) => yearMap[y] || 0);
  const yearColors = yearLabels.map((_, i) => colors[(i + 2) % colors.length]);

  const yearPieData = {
    labels: yearLabels,
    datasets: [
      {
        label: "Proyectos por año (fecha de inicio)",
        data: yearValues,
        backgroundColor: yearColors,
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="card report-card" role="region" aria-label="Reportes">
      <div className="report-header">
        <h3>Análisis Visual de Proyectos</h3>
        <div className="controls">
          <button className="btn primary" onClick={onBack}>
            ← Volver a Datos
          </button>
        </div>
      </div>

      {/* Gráfico de barras: estados */}
      <div
        className="report-body"
        style={{
          display: "flex",
          gap: 24,
          alignItems: "flex-start",
          padding: 24,
          flexWrap: "wrap",
        }}
      >
        <div className="chart" style={{ flex: 2, minWidth: 280, height: 350 }}>
          {values.length === 0 ? (
            <p className="muted">
              No hay datos suficientes para generar gráficos.
              <br />
              Crea algunos proyectos primero.
            </p>
          ) : (
            <Bar
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    backgroundColor: "rgba(0,0,0,0.8)",
                    titleColor: "white",
                    bodyColor: "white",
                  },
                },
                scales: { y: { beginAtZero: true } },
              }}
              redraw={true}
              key={labels.join("|")}
            />
          )}
        </div>

        <div className="summary" style={{ flex: 1, minWidth: 200 }}>
          <h4>Estadísticas</h4>
          <p className="muted">
            Total de proyectos:{" "}
            <strong>
              {projects.length ||
                (data.length && !data[0]?.count
                  ? data.length
                  : aggregated.reduce((s, x) => s + x.count, 0))}
            </strong>
          </p>
          <ul>
            {aggregated.length === 0 ? (
              <li className="muted">No hay estados registrados.</li>
            ) : (
              aggregated.map((d) => (
                <li key={d.estado}>
                  {d.estado}: <strong>{d.count}</strong>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>

      {/* Gráfico tipo torta: proyectos por año según fechaInicio */}
      <div>
        <h3 style={{marginTop: "30px"}}>Proyectos por año de inicio</h3>
      </div>
      <div
        className="report-body"
        style={{
          display: "flex",
          gap: 24,
          alignItems: "flex-start",
          padding: 24,
          flexWrap: "wrap",
        }}
      >
        <div
          className="chart"
          style={{
            flex: 2,
            minWidth: 280,
            height: 350,
          }}
        >
          {yearValues.length === 0 ? (
            <p className="muted">
              No hay fechas de inicio válidas para graficar.
            </p>
          ) : (
            <Pie
              data={yearPieData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "bottom",
                    labels: {
                      padding: 8,
                      usePointStyle: true,
                      font: { size: 12 },
                    },
                  },
                  tooltip: {
                    callbacks: {
                      label: (ctx) => {
                        const total =
                          yearValues.reduce((a, b) => a + b, 0) || 1;
                        const value = ctx.parsed;
                        const pct = ((value / total) * 100).toFixed(1);
                        return `${ctx.label}: ${value} (${pct}%)`;
                      },
                    },
                  },
                },
              }}
              redraw={true}
              key={"pieYears|" + yearLabels.join("|")}
            />
          )}
        </div>

        <div className="summary" style={{ flex: 1, minWidth: 200 }}>
          <h4>Estadísticas por año de inicio</h4>
          <p className="muted">
            Total proyectos:{" "}
            <strong>
              {projects.length ||
                (data.length && !data[0]?.count
                  ? data.length
                  : aggregated.reduce((s, x) => s + x.count, 0))}
            </strong>
          </p>
          <ul>
            {yearLabels.length === 0 ? (
              <li className="muted">No hay datos</li>
            ) : (
              yearLabels.map((y, i) => {
                const count = yearValues[i] || 0;
                const pct = (
                  (count / (yearValues.reduce((a, b) => a + b, 0) || 1)) *
                  100
                ).toFixed(1);
                return (
                  <li key={y}>
                    <span>
                      {y}
                      {": "}
                    </span>
                    <span>
                      {" "}
                      <strong>
                        {count} {"-"} <span>({pct}%)</span>
                      </strong>
                    </span>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
