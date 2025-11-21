import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Pagination from "../components/Pagination";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [Page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, [Page]);

  // Función para obtener productos de la API
  // Se envuelve en useCallback para evitar re-creaciones innecesarias
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
  }, [Page]);

  const handleSoftDelete = (productId) => {
    if (!window.confirm("Desactivar este Producto")) return;

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
    return <div className="p-4 text-center">Cargando productos...</div>;

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Inventario de Productos</h2>
      <button
        onClick={() => navigate("/create")}
        className="mb-4 bg-green-500 text-white p-2 rounded hover:bg-green-600"
      >
        Crear Nuevo Producto
      </button>

      {products.length === 0 && Page === 1 ? (
        <p>No hay productos registrados en el inventario.</p>
      ) : (
        <ul className="space-y-4">
          {products.map((product) => (
            <li
              key={product.Id}
              className="p-4 border rounded shadow-sm flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{product.Name}</p>
                <p className="text-sm text-gray-600">
                  ${product.Price.toFixed(2)} | Stock: {product.Stock}
                </p>
                <p
                  className={`text-xs font-medium ${
                    product.IsActive ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {product.IsActive ? "Activo" : "Inactivo"}
                </p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => navigate(`/edit/${product.Id}`)}
                  className="bg-blue-500 text-white p-1 rounded text-sm hover:bg-blue-600"
                >
                  Editar
                </button>
                {product.IsActive && (
                  <button
                    onClick={() => handleSoftDelete(product.Id)}
                    className="bg-red-500 text-white p-1 rounded text-sm hover:bg-red-600"
                  >
                    Desactivar
                  </button>
                )}

                {!product.IsActive && (
                  <button
                    onClick={() => handleSoftDelete(product.Id)}
                    className="bg-green-500 text-white p-1 rounded text-sm hover:bg-green-600"
                  >
                    Activar
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
      <div>
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
