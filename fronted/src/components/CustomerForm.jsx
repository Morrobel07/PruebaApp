import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

function CustomerForm() {
  const [customer, setCustomer] = useState({
    Name: "",
    Email: "",
    Phone: "",
    Address: "",
  });
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  useEffect(() => {
    if (isEditing) {
      setLoading(true);
      api
        .get(`/customers/${id}`)
        .then((response) => {
          setCustomer(response.data);
        })
        .catch((error) => {
          console.error("Error fetching customer:", error);
          console.error(`Error al cargar los datos del cliente con ID: ${id}`);
        })
        .finally(() => setLoading(false));
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEditing) {
        await api.put(`/customers/${id}`, customer);
        console.log("Cliente actualizado con éxito.");
      } else {
        await api.post("/customers", customer);
        console.log("Cliente creado con éxito.");
      }

      navigate("/customers");
    } catch (error) {
      console.error("Error al guardar cliente:", error.response || error);
      console.error(
        `Error al ${isEditing ? "actualizar" : "crear"} el cliente.`
      );
    } finally {
      setLoading(false);
    }
  };

  const title = isEditing
    ? `Editar Cliente: ${customer.Name}`
    : "Crear Nuevo Cliente";

  return (
    <div className="card shadow-sm mx-auto" style={{ maxWidth: "700px" }}>
      <div className="card-header">
        <h2 className="h4 mb-0">{title}</h2>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="Name" className="form-label">
              Nombre Completo
            </label>
            <input
              type="text"
              id="Name"
              name="Name"
              value={customer.Name}
              onChange={handleChange}
              required
              className="form-control"
              placeholder="Nombre del cliente"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="Email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="Email"
              name="Email"
              value={customer.Email}
              onChange={handleChange}
              className="form-control"
              placeholder="correo@ejemplo.com"
            />
          </div>

          <div className="d-flex justify-content-end gap-2 mt-4">
            <button
              type="button"
              onClick={() => navigate("/customers")}
              className="btn btn-secondary"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading
                ? "Guardando..."
                : isEditing
                ? "Guardar Cambios"
                : "Crear Cliente"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CustomerForm;
