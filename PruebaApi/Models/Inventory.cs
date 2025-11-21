using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace PruebaApi.Models
{
    public class Inventory
    {
        [Key]
        public int Id { get; set; }

        // Foreign Key al producto afectado
        public int ProductId { get; set; }
        [ForeignKey("ProductId")]
        public virtual Product Product { get; set; }

        [Required]
        public int QuantityChange { get; set; }

        [Required]
        [StringLength(50)]
        public string OperationType { get; set; }

        public DateTime TransactionDate { get; set; } = DateTime.Now;
    }
}