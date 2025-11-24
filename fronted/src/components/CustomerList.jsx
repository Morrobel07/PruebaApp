import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../components/Pagination";
import api from "../services/api";

function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCustomers();
  }, [currentPage]);

  const fetchCustomers = () => {
    setLoading(true);

    const url = `/customers`;

    api
      .get(url)
      .then((response) => {
        const customersData = Array.isArray(response.data)
          ? response.data
          : response.data?.data || response.data?.customers || [];

        setCustomers(customersData);

        const total =
          response.data?.totalPages || response.data?.total_pages || 1;
        setTotalPages(total);
      })
      .catch((error) => {
        console.error("Error fetching customers:", error.response || error);
        console.error(
          "Error al cargar clientes. Verifique la conexión con el Backend."
        );
        setCustomers([]);
        setTotalPages(1);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "¿Estás seguro de que quieres eliminar este cliente? Esta acción no se puede deshacer."
    );
    if (!confirmed) return;

    api
      .delete(`/customers/${id}`)
      .then(() => {
        console.log("Cliente eliminado.");
        fetchCustomers();
      })
      .catch((error) => {
        console.error("Error deleting customer:", error);
        console.error("Error al eliminar el cliente.");
      });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
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
        <h2 className="h4 mb-0">Clientes Registrados</h2>
        <button
          onClick={() => navigate("/customers/create")}
          className="btn btn-primary"
        >
          <i className="bi bi-person-plus-fill me-2"></i>Crear Nuevo Cliente
        </button>
      </div>
      <div className="card-body">
        {customers.length === 0 ? (
          <div className="alert alert-secondary text-center">
            No hay clientes registrados.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Teléfono</th>
                  <th className="text-end">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.Id}>
                    <td>{customer.Name}</td>
                    <td>{customer.Email || "N/A"}</td>
                    <td>{customer.Phone || "N/A"}</td>
                    <td className="text-end">
                      <button
                        onClick={() =>
                          navigate(`/customers/edit/${customer.Id}`)
                        }
                        className="btn btn-outline-primary btn-sm me-2"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(customer.Id)}
                        className="btn btn-outline-danger btn-sm"
                      >
                        Eliminar
                      </button>
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

export default CustomerList;
