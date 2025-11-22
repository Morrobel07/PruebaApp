import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProductList from "./components/ProductList";
import ProductForm from "./components/ProductForm";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="container mt-5">
        <div className="card shadow-lg">
          <div className="card-header">
            <h1 className="text-center display-5">Gestión de Productos</h1>
          </div>
          <div className="card-body p-4">
            <Routes>
              <Route path="/" element={<ProductList />} />
              <Route path="/create" element={<ProductForm />} />
              <Route path="/edit/:id" element={<ProductForm />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
