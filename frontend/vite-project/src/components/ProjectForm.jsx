import React, { useEffect, useState } from "react";
import "../styles/ProjectForm.css";
import { crear, actualizar } from "../services/api";

// Estado inicial del formulario
const empty = {
  nombre: "",
  descripcion: "",
  estado: "En progreso",
  fechaInicio: "",
  fechaFin: "",
};

export default function ProjectForm({ onDone, editing, onCancel }) {
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(false);

  // Cerrar modal con tecla Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && !loading) {
        onCancel();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onCancel, loading]);

  // Carga datos si es edición
  useEffect(() => {
    if (editing) {
      setForm({
        nombre: editing.nombre || "",
        descripcion: editing.descripcion || "",
        estado: editing.estado || "En progreso",
        fechaInicio: editing.fechaInicio
          ? editing.fechaInicio.slice(0, 10)
          : "",
        fechaFin: editing.fechaFin ? editing.fechaFin.slice(0, 10) : "",
      });
    } else setForm(empty);
  }, [editing]);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Enviar formulario
  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Prepara el payload para la API
      const payload = {
        nombre: form.nombre,
        descripcion: form.descripcion,
        estado: form.estado,
        fechaInicio: form.fechaInicio
          ? new Date(form.fechaInicio).toISOString()
          : null,
        fechaFin: form.fechaFin ? new Date(form.fechaFin).toISOString() : null,
      };
      // Validar si es edición o creación
      if (editing && editing.id) {
        await actualizar(editing.id, payload);
      } else {
        await crear(payload);
      }
      onDone();
    } catch (err) {
      console.error(err);
      alert("Error al guardar");
    } finally {
      setLoading(false);
    }
  };

  // Cerrar mosal al seleccionar el overlay
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && !loading) {
      onCancel();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-container">
        <div className="modal-header">
          <h3>{editing ? "Editar Proyecto" : "Nuevo Proyecto"}</h3>
          <button
            type="button"
            className="modal-close"
            onClick={onCancel}
            aria-label="Cerrar modal"
          >
            ✕
          </button>
        </div>

        <form className="modal-form" onSubmit={submit}>
          <div className="form-content">
            <div className="form-group">
              <label htmlFor="nombre">Nombre del Proyecto</label>
              <input
                id="nombre"
                name="nombre"
                value={form.nombre}
                onChange={handle}
                required
                placeholder="Ingresa el nombre del proyecto"
              />
            </div>

            <div className="form-group">
              <label htmlFor="descripcion">Descripción</label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={form.descripcion}
                onChange={handle}
                rows="4"
                placeholder="Describe el proyecto..."
              />
            </div>

            <div className="form-group">
              <label htmlFor="estado">Estado</label>
              <select
                id="estado"
                name="estado"
                value={form.estado}
                onChange={handle}
              >
                <option value="En progreso">En progreso</option>
                <option value="Finalizado">Finalizado</option>
                <option value="Pausado">Pausado</option>
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fechaInicio">Fecha de Inicio</label>
                <input
                  id="fechaInicio"
                  name="fechaInicio"
                  type="date"
                  value={form.fechaInicio}
                  onChange={handle}
                />
              </div>
              <div className="form-group">
                <label htmlFor="fechaFin">Fecha de Fin</label>
                <input
                  id="fechaFin"
                  name="fechaFin"
                  type="date"
                  value={form.fechaFin}
                  onChange={handle}
                />
              </div>
            </div>
          </div>

          <div className="modal-actions">
            <button
              type="submit"
              className="btnAceptOrUbdate"
              disabled={loading}
            >
              {loading ? "Guardando..." : editing ? "Actualizar" : "Crear"}
            </button>
            <button
              type="button"
              className="btnCancel"
              onClick={onCancel}
              disabled={loading}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
