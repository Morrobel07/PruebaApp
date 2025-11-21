import { React } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProductList from "./components/ProductList";
import InactiveProducts from "./components/InactiveProducts"; // 1. Importar el nuevo componente
import ProductForm from "./components/ProductForm";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Gestión de Productos (.NET 4.8 + React)
          </h1>
        </header>
        <main className="container mx-auto">
          <Routes>
            {/* Listado de Productos (Ruta principal) */}
            <Route path="/" element={<ProductList />} />

            {/* Ruta para ver productos inactivos */}
            <Route path="/inactive" element={<InactiveProducts />} />

            {/* Creación de Producto */}
            <Route path="/create" element={<ProductForm />} />

            {/* Edición de Producto */}
            <Route path="/edit/:id" element={<ProductForm />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
