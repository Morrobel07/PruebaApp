import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";

// Mapeo para OperationType (asumo 1=Entry, 2=Exit por tu lógica de POST)
const OPERATION_NAMES = {
  1: { name: "Entrada", style: "bg-success" },
  2: { name: "Salida/Ajuste", style: "bg-danger" },
};

// Componente para ver el historial de movimientos (transacciones) de inventario
function InventoryMovementList() {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation(); // Hook para acceder al estado de la navegación

  useEffect(() => {
    fetchMovements();
    // El efecto se ejecutará cuando el componente se monte Y cuando cambie el estado de la ubicación
  }, [location.state?.refresh]);

  const fetchMovements = () => {
    setLoading(true);

    // El endpoint del backend no usa paginación y devuelve el historial completo
    api
      .get("/inventory")
      .then((response) => {
        const movementsData = Array.isArray(response.data)
          ? response.data
          : response.data?.Result || [];
        setMovements(movementsData);
      })
      .catch((error) => {
        console.error(
          "Error fetching inventory movements:",
          error.response || error
        );
        setMovements([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (loading)
    return (
      <div className="d-flex justify-content-center p-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );

  return (
    <div className="card shadow-sm">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h2 className="h4 mb-0">Historial de Movimientos</h2>
        <div>
          <button
            onClick={() => navigate("/inventory/create")}
            className="btn btn-success btn-sm me-2"
          >
            <i className="bi bi-plus-circle me-1"></i> Registrar Movimiento
          </button>
          <button
            onClick={fetchMovements}
            className="btn btn-outline-secondary btn-sm"
          >
            <i className="bi bi-arrow-clockwise me-1"></i> Actualizar
          </button>
        </div>
      </div>
      <div className="card-body">
        {movements.length === 0 ? (
          <div className="alert alert-secondary text-center">
            No hay movimientos de inventario registrados.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>ID Mov.</th>
                  <th>Producto</th>
                  <th>Tipo</th>
                  <th className="text-center">Cambio Cant.</th>
                  <th>Fecha Transacción</th>
                </tr>
              </thead>
              <tbody>
                {movements
                  .slice()
                  .reverse()
                  .map((item) => {
                    const typeInfo = OPERATION_NAMES[item.OperationType] || {
                      name: "Desconocido",
                      style: "bg-secondary",
                    };
                    const isEntry = item.QuantityChange > 0;
                    const quantityDisplay = isEntry
                      ? `+${item.QuantityChange}`
                      : item.QuantityChange;

                    return (
                      <tr key={item.Id}>
                        <td>{item.Id}</td>
                        <td>{item.Product?.Name || "N/A"}</td>
                        <td>
                          <span className={`badge ${typeInfo.style}`}>
                            {typeInfo.name}
                          </span>
                        </td>
                        <td
                          className={`text-center fw-bold ${
                            isEntry ? "text-success" : "text-danger"
                          }`}
                        >
                          {quantityDisplay}
                        </td>
                        <td>
                          {new Date(item.TransactionDate).toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default InventoryMovementList;
