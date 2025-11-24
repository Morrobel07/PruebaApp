import React from "react";
import { NavLink, Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="container mt-4">
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4 rounded shadow-sm">
        <div className="container-fluid">
          <NavLink className="navbar-brand" to="/">
            <i className="bi bi-box-seam me-2"></i>
            Gestión App
          </NavLink>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink className="nav-link" to="/">
                  Productos
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/customers">
                  Clientes
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/inventory">
                  Movimientos de Inventario
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/sales">
                  Ventas
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* El contenido de las rutas anidadas se renderizará aquí */}
      <Outlet />
    </div>
  );
}

export default Layout;
