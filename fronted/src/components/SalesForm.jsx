import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function SalesForm() {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [saleItems, setSaleItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Cargar clientes y productos al montar el componente
  useEffect(() => {
    const fetchInitialData = async () => {
      // Usamos Promise.allSettled para que si una petición falla, la otra no se vea afectada.
      try {
        const [customersResult, productsResult] = await Promise.allSettled([
          api.get("/customers"),
          api.get("/product?page=1&pageSize=1000"),
        ]);

        if (customersResult.status === "fulfilled") {
          setCustomers(customersResult.value.data || []);
        }
        if (productsResult.status === "fulfilled") {
          setProducts(productsResult.value.data.Products || []);
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
        setMessage("Error al cargar datos necesarios para la venta.");
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  const [currentItem, setCurrentItem] = useState({
    productId: "",
    quantity: 1,
  });

  const handleAddItem = () => {
    if (!currentItem.productId || currentItem.quantity <= 0) {
      alert("Por favor, seleccione un producto y una cantidad válida.");
      return;
    }

    const product = products.find((p) => p.Id == currentItem.productId);
    if (!product) return;

    if (saleItems.some((item) => item.ProductId === product.Id)) {
      alert("Este producto ya está en la lista. Puede editar la cantidad.");
      return;
    }

    setSaleItems([
      ...saleItems,
      {
        ProductId: product.Id,
        Name: product.Name,
        Quantity: parseInt(currentItem.quantity),
        Price: product.Price,
      },
    ]);
    setCurrentItem({ productId: "", quantity: 1 }); // Resetear
  };

  const handleRemoveItem = (productId) => {
    setSaleItems(saleItems.filter((item) => item.ProductId !== productId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCustomerId || saleItems.length === 0) {
      setMessage("Debe seleccionar un cliente y añadir al menos un producto.");
      return;
    }

    setLoading(true);
    setMessage("");

    const payload = {
      CustomerId: parseInt(selectedCustomerId),
      Items: saleItems.map(({ ProductId, Quantity }) => ({
        ProductId,
        Quantity,
      })),
    };

    try {
      await api.post("/sales", payload);
      setMessage("Venta registrada con éxito.");
      setTimeout(() => navigate("/sales", { state: { refresh: true } }), 1500);
    } catch (error) {
      console.error("Error al registrar la venta:", error);
      setMessage("Error al procesar la venta. Verifique el stock disponible.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && customers.length === 0) {
    return <div className="text-center p-5">Cargando...</div>;
  }

  return (
    <div className="card shadow-sm">
      <div className="card-header">
        <h2 className="h4 mb-0">Registrar Nueva Venta</h2>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="customer" className="form-label fw-bold">
              1. Seleccione un Cliente
            </label>
            <select
              id="customer"
              className="form-select"
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              required
            >
              <option value="">-- Clientes --</option>
              {customers.map((c) => (
                <option key={c.Id} value={c.Id}>
                  {c.Name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="form-label fw-bold">
              2. Añadir Productos a la Venta
            </label>
            <div className="d-flex gap-2 p-3 border rounded">
              <select
                className="form-select"
                value={currentItem.productId}
                onChange={(e) =>
                  setCurrentItem({ ...currentItem, productId: e.target.value })
                }
              >
                <option value="">-- Productos --</option>
                {products.map((p) => (
                  <option key={p.Id} value={p.Id}>
                    {p.Name} (Stock: {p.Stock})
                  </option>
                ))}
              </select>
              <input
                type="number"
                className="form-control"
                style={{ maxWidth: "100px" }}
                value={currentItem.quantity}
                onChange={(e) =>
                  setCurrentItem({ ...currentItem, quantity: e.target.value })
                }
                min="1"
              />
              <button
                type="button"
                className="btn btn-success"
                onClick={handleAddItem}
              >
                Añadir
              </button>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="h5">Productos en la Venta</h3>
            {saleItems.length === 0 ? (
              <p className="text-muted">Aún no hay productos en la venta.</p>
            ) : (
              <ul className="list-group">
                {saleItems.map((item) => (
                  <li
                    key={item.ProductId}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <div>
                      {item.Name} - <strong>Cantidad: {item.Quantity}</strong>
                    </div>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => handleRemoveItem(item.ProductId)}
                    >
                      Quitar
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {message && (
            <div
              className={`alert ${
                message.includes("éxito") ? "alert-success" : "alert-danger"
              }`}
            >
              {message}
            </div>
          )}

          <div className="d-flex justify-content-end gap-2 mt-4">
            <button
              type="button"
              onClick={() => navigate("/sales")}
              className="btn btn-secondary"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || saleItems.length === 0}
            >
              {loading ? "Procesando Venta..." : "Finalizar Venta"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SalesForm;
