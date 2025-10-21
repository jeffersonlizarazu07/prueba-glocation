import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import ProjectForm from "./components/ProjectForm";
import ProjectList from "./components/ProjectList";
import ProjectReport from "./components/ProjectReport";
import Footer from "./components/Footer";
import { listar, obtenerGraficos, solicitarResumen } from "./services/api";

export default function App() {
  const [activeSection, setActiveSection] = useState("data"); // 'data' | 'charts' | 'ai'
  const [projects, setProjects] = useState([]);
  const [grafData, setGrafData] = useState([]);
  const [aiResponse, setAiResponse] = useState(null);
  const [editing, setEditing] = useState(undefined);
  const [loading, setLoading] = useState(false);

  // Carga la lista de proyectos
  const load = async () => {
    try {
      const data = await listar();
      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error cargando proyectos", err);
    }
  };

  // Carga los datos para los gráficos
  const loadGraf = async () => {
    try {
      // Solicita los datos de gráficos al backend
      const g = await obtenerGraficos();
      setGrafData(g);
    } catch (err) {
      console.error("Error cargando graficos", err);
    }
  };

  // Carga el análisis de IA
  const loadAiAnalysis = async () => {
    setLoading(true);
    setAiResponse(null);
    try {
      // Solicita el análisis de IA desde el backend
      const response = await solicitarResumen();
      const textoHTML = (
        response.analisis || "No se logró generar el análisis"
      ).replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      setAiResponse(textoHTML);
    } catch (err) {
      console.error("Error cargando análisis IA", err);
      setAiResponse("Error al generar análisis con IA");
    } finally {
      setLoading(false);
    }
  };

  // Carga inicial de datos
  useEffect(() => {
    load();
    loadGraf();
  }, []);

  // Muestra el formulario en edición
  const showEdit = (project) => {
    setEditing(project);
  };

  // Después de crear o actualizar un proyecto
  const onCreatedOrUpdated = async () => {
    await load();
    await loadGraf();
    setEditing(undefined);
  };

  // Refresca los datos
  const refreshAllData = async () => {
    await load();
    await loadGraf();
    if (activeSection === "ai") {
      await loadAiAnalysis();
    }
  };

  return (
    <div className="app-root">
      <Header activeSection={activeSection} onNavigate={setActiveSection} />

      <main className="main-container">
        {/* Sección de Datos del Backend */}
        <section
          id="data-section"
          className={`content-section ${
            activeSection === "data" ? "active" : ""
          }`}
        >
          <div className="section-header">
            <h2>Datos de Proyectos</h2>
            <p className="section-description">
              Gestiona y visualiza todos los proyectos del sistema
            </p>
          </div>

          <div className="section-content">
            <div className="data-controls">
              <button className="btn primary" onClick={() => setEditing(null)}>
                Crear Proyecto
              </button>
            </div>

            {editing !== undefined && (
              <ProjectForm
                onDone={onCreatedOrUpdated}
                editing={editing}
                onCancel={() => setEditing(undefined)}
              />
            )}

            <ProjectList
              data={projects}
              onEdit={showEdit}
              onChange={refreshAllData}
            />
          </div>
        </section>

        {/* Sección de Gráficos */}
        <section
          id="charts-section"
          className={`content-section ${
            activeSection === "charts" ? "active" : ""
          }`}
        >
          <div className="section-header">
            <h2>Análisis Visual</h2>
            <p className="section-description">
              Gráficos y estadísticas basadas en los datos de proyectos
            </p>
          </div>

          <div className="section-content">
            <ProjectReport
              data={grafData}
              visible={true}
              projects={projects}
              onBack={() => setActiveSection("data")}
            />
          </div>
        </section>

        {/* Sección de IA */}
        <section
          id="ai-section"
          className={`content-section ${
            activeSection === "ai" ? "active" : ""
          }`}
        >
          <div className="section-header">
            <h2>Análisis con IA</h2>
            <p className="section-description">
              Respuestas inteligentes y análisis automático de proyectos
            </p>
          </div>

          <div className="section-content">
            <div className="ai-controls">
              <button
                className="btn primary"
                onClick={loadAiAnalysis}
                disabled={loading || projects.length === 0}
              >
                {loading ? "Generando..." : "Generar Análisis IA"}
              </button>
            </div>

            <div className="ai-response">
              {aiResponse ? (
                <div className="ai-content">
                  <h4>Análisis Generado por IA:</h4>
                  <div
                    className="ai-text"
                    dangerouslySetInnerHTML={{ __html: aiResponse }}
                  ></div>
                </div>
              ) : (
                <div className="ai-placeholder">
                  <p className="muted">
                    {projects.length === 0
                      ? "Primero necesitas crear algunos proyectos para generar análisis con IA"
                      : "Haz clic en 'Generar Análisis IA' para obtener insights automáticos"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
