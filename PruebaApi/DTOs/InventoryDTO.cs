using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace PruebaApi.DTOs
{
    public class InventoryDTO
    {
        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Debe especificar un ID de Producto válido.")]
        public int ProductId { get; set; }

        [Required(ErrorMessage = "La cantidad de cambio es obligatoria.")]
        public int QuantityChange { get; set; }

        [Required(ErrorMessage = "El tipo de operación es obligatorio.")]
        [StringLength(50)]
        public string OperationType { get; set; }
    }
}