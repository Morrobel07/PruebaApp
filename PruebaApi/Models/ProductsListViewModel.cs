using PruebaApi.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PruebaApi.Models
{
    public class ProductsListViewModel
    {
        public IEnumerable<Product> Products { get; set; } =
          Enumerable.Empty<Product>();

        public PaginInfo PaginInfo { get; set; }
    }
}