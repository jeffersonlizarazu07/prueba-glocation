import React from "react";
import "../styles/Header.css";

export default function Header({ activeSection, onNavigate }) {
  return (
    <header className="site-header">
      <div className="container">
        <div className="brand">
          📁 <strong>Proyectos</strong>
        </div>
        <nav className="nav">
          <button
            className={activeSection === "data" ? "active" : ""}
            onClick={() => onNavigate("data")}
          >
            📊 <span>Datos</span>
          </button>
          <button
            className={activeSection === "charts" ? "active" : ""}
            onClick={() => onNavigate("charts")}
          >
            📈 <span>Gráficos</span>
          </button>
          <button
            className={activeSection === "ai" ? "active" : ""}
            onClick={() => onNavigate("ai")}
          >
            🤖 <span>IA</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
