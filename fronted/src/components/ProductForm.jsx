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

  if (loading && isEdit)
    return (
      <div className="p-4 text-center">Cargando datos para edición...</div>
    );

  return (
    <div className="p-8 max-w-lg mx-auto bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">
        {isEdit ? "Editar Producto" : "Crear Producto"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ... (Campos de formulario, son iguales al ejemplo anterior) ... */}
        <div>
          <label className="block font-medium">Nombre</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block font-medium">Precio</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            step="0.01"
            min="0.01"
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block font-medium">Stock</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            min="0"
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="flex justify-between">
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white p-2 rounded disabled:opacity-50 hover:bg-indigo-700"
          >
            {isEdit ? "Guardar Cambios" : "Crear"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="bg-gray-400 text-white p-2 rounded hover:bg-gray-500"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProductForm;
