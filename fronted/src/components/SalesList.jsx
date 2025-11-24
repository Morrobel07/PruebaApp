import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";

function SalesList() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    api
      .get("/sales")
      .then((response) => {
        setSales(response.data || []);
      })
      .catch((error) => console.error("Error fetching sales:", error))
      .finally(() => setLoading(false));
  }, [location.state?.refresh]);

  if (loading) {
    return (
      <div className="text-center p-5">Cargando historial de ventas...</div>
    );
  }

  return (
    <div className="card shadow-sm">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h2 className="h4 mb-0">Historial de Ventas</h2>
        <button
          onClick={() => navigate("/sales/create")}
          className="btn btn-success"
        >
          <i className="bi bi-plus-circle me-1"></i> Nueva Venta
        </button>
      </div>
      <div className="card-body">
        {sales.length === 0 ? (
          <div className="alert alert-secondary text-center">
            No hay ventas registradas.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>ID Venta</th>
                  <th>Cliente</th>
                  <th>Fecha</th>
                  <th className="text-end">Total</th>
                </tr>
              </thead>
              <tbody>
                {sales.map((sale) => (
                  <tr key={sale.Id}>
                    <td>{sale.Id}</td>
                    <td>{sale.CustomerName || "N/A"}</td>
                    <td>{new Date(sale.SaleDate).toLocaleString()}</td>
                    <td className="text-end fw-bold">
                      ${sale.Total.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default SalesList;
