import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";
import Pagination from "../components/Pagination";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [Page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const location = useLocation(); // Hook para acceder al estado de la navegación

  useEffect(() => {
    fetchProducts();
    // El efecto se ejecutará cuando cambie la página O cuando se reciba el estado de refresco.
  }, [Page, location.state?.refresh]);

  const fetchProducts = useCallback(() => {
    setLoading(true);
    api
      .get(`/product?page=${Page}`)
      .then((response) => {
        setProducts(response.data.Products);
        setTotalPages(response.data.PaginInfo.Total);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setProducts([]);
        setTotalPages(1);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [Page]); // fetchProducts en sí solo necesita Page como dependencia

  const handleSoftDelete = (productId) => {
    api
      .delete(`/product/${productId}`)
      .then(() => {
        alert("Producto Desactivado");
        fetchProducts();
      })
      .catch((error) => {
        console.error("Error al desactivar el producto:", error);
        alert("Error al desactivar el producto");
      });
  };

  // const handlePageChange = (newPage) => {
  //   if (newPage >= 1 && newPage <= totalPages) {
  //     setPage(newPage);
  //   }
  // };

  if (loading)
    return <div className="text-center p-4">Cargando productos...</div>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="h3 mb-0">Inventario de Productos</h2>
        <button onClick={() => navigate("/create")} className="btn btn-success">
          <i className="bi bi-plus-circle me-2"></i>Crear Nuevo Producto
        </button>
      </div>

      {products.length === 0 && Page === 1 ? (
        <div className="alert alert-info text-center">
          No hay productos registrados en el inventario.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Estado</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.Id}>
                  <td>{product.Name}</td>
                  <td>${product.Price.toFixed(2)}</td>
                  <td>{product.Stock}</td>
                  <td>
                    <span
                      className={`badge ${
                        product.IsActive ? "bg-success" : "bg-danger"
                      }`}
                    >
                      {product.IsActive ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="text-end">
                    <button
                      onClick={() => navigate(`/edit/${product.Id}`)}
                      className="btn btn-primary btn-sm me-2"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleSoftDelete(product.Id)}
                      className={`btn btn-sm ${
                        product.IsActive
                          ? "btn-outline-danger"
                          : "btn-outline-success"
                      }`}
                    >
                      {product.IsActive ? "Desactivar" : "Activar"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="d-flex justify-content-center mt-4">
        <Pagination
          currentPage={Page}
          totalPages={totalPages}
          onPageChange={(newPage) => setPage(newPage)}
        />
      </div>
    </div>
  );
}

export default ProductList;
