import { use } from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  // Estado para almacenar los datos del formulario
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      setLoading(true);
      api
        .get(`/product/${id}`)
        .then((response) => {
          setFormData({
            name: response.data.Name,
            price: response.data.Price, // Cargar el precio desde la API
            stock: response.data.Stock,
          });
        })
        .catch((err) => {
          console.error("Error fetching product data:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isEdit, id]); // Corregido: La sintaxis del array de dependencias era incorrecta

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "number" ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const dataToSend = {
      name: formData.name, // Corregido: Usar propiedades en minúscula del estado
      price: formData.price,
      stock: formData.stock,
    };

    const request = isEdit
      ? api.put(`/product/${id}`, dataToSend)
      : api.post("/product", dataToSend);

    request
      .then(() => {
        alert(isEdit ? "Producto Actualizado" : " Producto creado.");
        navigate("/");
      })
      .catch((err) => {
        console.error("Error submitting form:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Muestra un spinner de carga si se están cargando datos para editar
  if (loading && isEdit) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "200px" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    // Contenedor para centrar el formulario y limitar su ancho
    <div className="mx-auto" style={{ maxWidth: "600px" }}>
      <h2 className="h2 mb-4 text-center">
        {isEdit ? "Editar Producto" : "Crear Producto"}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Nombre del Producto
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="form-control"
            placeholder="Ej: Laptop, Teclado, etc."
          />
        </div>
        <div className="mb-3">
          <label htmlFor="price" className="form-label">
            Precio
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            step="0.01"
            min="0.01"
            required
            className="form-control"
            placeholder="0.00"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="stock" className="form-label">
            Stock
          </label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            min="0"
            required
            className="form-control"
            placeholder="0"
          />
        </div>
        <div className="d-flex justify-content-end gap-2 mt-4">
          <button type="submit" disabled={loading} className="btn btn-primary">
            {isEdit ? "Guardar Cambios" : "Crear"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="btn btn-secondary"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProductForm;
