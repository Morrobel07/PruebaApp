// src/api/inventoryService.js
import api from "./api";

const inventoryService = {
  getHistory: (productId = null) => {
    // Permite filtrar por ID de producto (opcional)
    return api.get("/inventory", {
      params: { productId },
    });
  },
  registerMovement: (data) => {
    // data debe ser { ProductId, QuantityChange, OperationType }
    return api.post("/inventory", data);
  },
  // No hay update ni delete en movimientos de inventario por ser registros históricos
};

export default inventoryService;
