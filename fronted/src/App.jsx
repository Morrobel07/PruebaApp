import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProductList from "./components/ProductList";
import ProductForm from "./components/ProductForm";
import "./App.css";

function App() {
  return (
    <Router>
      {/* Contenedor principal de Bootstrap */}
      <div className="container mt-5">
        {/* Tarjeta principal con sombra y padding */}
        <div className="card shadow-lg">
          <div className="card-header">
            <h1 className="text-center display-5">Gestión de Productos</h1>
          </div>
          <div className="card-body p-4">
            <Routes>
              {/* Listado de Productos (Ruta principal) */}
              <Route path="/" element={<ProductList />} />
              {/* Creación de Producto */}
              <Route path="/create" element={<ProductForm />} />
              {/* Edición de Producto */}
              <Route path="/edit/:id" element={<ProductForm />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
