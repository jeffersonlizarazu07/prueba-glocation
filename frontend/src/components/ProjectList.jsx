import "../styles/ProjectList.css";
import { eliminar } from "../services/api";

export default function ProjectList({ data = [], onEdit, onChange }) {
  // Eliminar proyecto
  const doDelete = async (id) => {
    // Confirmar eliminación
    if (!confirm("¿Eliminar proyecto?")) return;
    try {
      await eliminar(id);
      onChange();
    } catch (err) {
      console.error(err);
      alert("Error eliminando proyecto");
    }
  };

  return (
    <div className="card list-card">
      <h3>Listado de proyectos</h3>

      {data.length === 0 ? (
        <p className="muted">No hay proyectos aún.</p>
      ) : (
        <table className="projects-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Estado</th>
              <th>Inicio</th>
              <th>Fin</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {data.map((project) => (
              <tr key={project.id}>
                <td data-label="Nombre">{project.nombre}</td>
                <td data-label="Descripción">{project.descripcion}</td>
                <td data-label="Estado">{project.estado}</td>
                <td data-label="Inicio">{project.fechaInicio}</td>
                <td data-label="Fin">{project.fechaFin || "-"}</td>
                <td className="actions" data-label="Acciones">
                  <button
                    className="btn.primary"
                    onClick={() => onEdit(project)}
                  >
                    Editar
                  </button>
                  <button
                    className="danger"
                    onClick={() => doDelete(project.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
