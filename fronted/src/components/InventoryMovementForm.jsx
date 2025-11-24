import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

const OPERATION_TYPES = {
  ENTRY: 1, // Entrada de Stock (Suma)
  EXIT: 2, // Salida de Stock (Resta - aunque las ventas lo hacen aparte, esto es para ajustes)
};

function InventoryMovementForm() {
  const [products, setProducts] = useState([]);
  const [movement, setMovement] = useState({
    ProductId: "",
    QuantityChange: 0,
    OperationType: OPERATION_TYPES.ENTRY, // Por defecto: Entrada
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // 1. Cargar la lista de productos para el selector
  useEffect(() => {
    // Solicitamos todos los productos en una sola página para el selector
    api
      .get("/product?page=1&pageSize=1000")
      .then((response) => {
        const productsData = Array.isArray(response.data.Products)
          ? response.data.Products
          : Array.isArray(response.data)
          ? response.data
          : [];
        setProducts(productsData);
      })
      .catch((error) => {
        console.error("Error al cargar productos:", error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setMovement((prev) => ({
      ...prev,
      [name]:
        type === "number" || name === "ProductId" || name === "OperationType"
          ? value === ""
            ? 0
            : parseFloat(value)
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const finalQuantityChange =
      movement.OperationType === OPERATION_TYPES.ENTRY
        ? Math.abs(movement.QuantityChange)
        : -Math.abs(movement.QuantityChange);

    const payload = {
      ProductId: parseInt(movement.ProductId),
      QuantityChange: finalQuantityChange,
      OperationType: parseInt(movement.OperationType),
    };

    try {
      await api.post("/inventory", payload);
      setMessage("Transacción de inventario registrada con éxito.");
      setMovement({
        ProductId: "",
        QuantityChange: 0,
        OperationType: OPERATION_TYPES.ENTRY,
      });
      setTimeout(
        () => navigate("/inventory", { state: { refresh: true } }),
        1500
      );
    } catch (error) {
      console.error("Error al registrar movimiento:", error.response || error);

      if (
        error.response &&
        error.response.data &&
        error.response.data.ModelState
      ) {
        const errors = error.response.data.ModelState;
        let errorMsg = "Error en la validación: ";
        for (const key in errors) {
          errorMsg += errors[key].join(", ") + " ";
        }
        setMessage(errorMsg);
      } else {
        setMessage(
          "Error al procesar el movimiento. Verifique la cantidad y el producto."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card shadow-sm mx-auto" style={{ maxWidth: "700px" }}>
      <div className="card-header">
        <h2 className="h4 mb-0">Registro de Movimiento de Stock</h2>
      </div>
      <div className="card-body">
        {message && (
          <div
            className={`alert ${
              message.includes("éxito") ? "alert-success" : "alert-danger"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="OperationType" className="form-label">
              Tipo de Operación
            </label>
            <select
              id="OperationType"
              name="OperationType"
              value={movement.OperationType}
              onChange={handleChange}
              required
              className="form-select"
            >
              <option value={OPERATION_TYPES.ENTRY}>
                Entrada de Stock (Añadir)
              </option>
              <option value={OPERATION_TYPES.EXIT}>
                Salida de Stock (Reducir)
              </option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="ProductId" className="form-label">
              Producto
            </label>
            <select
              id="ProductId"
              name="ProductId"
              value={movement.ProductId}
              onChange={handleChange}
              required
              className="form-select"
            >
              <option value="">-- Seleccione un Producto --</option>
              {products.map((p) => (
                <option key={p.Id} value={p.Id}>
                  {p.Name} (Stock actual: {p.Stock})
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="QuantityChange" className="form-label">
              Cantidad a{" "}
              {movement.OperationType == OPERATION_TYPES.ENTRY
                ? "Añadir"
                : "Reducir"}
            </label>
            <input
              type="number"
              id="QuantityChange"
              name="QuantityChange"
              min="1"
              value={movement.QuantityChange}
              onChange={handleChange}
              required
              className="form-control"
            />
          </div>
          <div className="d-flex justify-content-end gap-2 mt-4">
            <button
              type="button"
              onClick={() => navigate("/inventory")}
              className="btn btn-secondary"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={
                loading || movement.QuantityChange <= 0 || !movement.ProductId
              }
            >
              {loading ? "Procesando..." : "Registrar Movimiento"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default InventoryMovementForm;
