import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// Importación de componentes de Layout y Páginas
import Layout from "./components/Layout";
import ProductList from "./components/ProductList";
import ProductForm from "./components/ProductForm";
import CustomerList from "./components/CustomerList";
import CustomerForm from "./components/CustomerForm";
import InventoryMovementForm from "./components/InventoryMovementForm";
import InventoryMovementList from "./components/InventoryMovementList";
import SalesForm from "./components/SalesForm";
import SalesList from "./components/SalesList";

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta principal que renderiza el Layout con la barra de navegación */}
        <Route path="/" element={<Layout />}>
          {/* Rutas anidadas que se mostrarán dentro del Layout */}
          {/* Sección de Productos */}
          <Route index element={<ProductList />} /> {/* La página de inicio */}
          <Route path="create" element={<ProductForm />} />
          <Route path="edit/:id" element={<ProductForm />} />
          {/* Sección de Clientes (con rutas corregidas) */}
          <Route path="customers" element={<CustomerList />} />
          <Route path="customers/create" element={<CustomerForm />} />
          <Route path="customers/edit/:id" element={<CustomerForm />} />
          {/* Sección de Inventario */}
          <Route path="inventory" element={<InventoryMovementList />} />
          <Route path="inventory/create" element={<InventoryMovementForm />} />
          {/* Sección de Ventas */}
          <Route path="sales" element={<SalesList />} />
          <Route path="sales/create" element={<SalesForm />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
