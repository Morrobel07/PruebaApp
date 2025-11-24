using System;
using System.Collections.Generic;

namespace PruebaApi.DTOs
{
    public class SaleItemCreateDTO
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
    }

    public class SaleCreateDTO
    {
        public int CustomerId { get; set; }
        public List<SaleItemCreateDTO> Items { get; set; }
    }
}