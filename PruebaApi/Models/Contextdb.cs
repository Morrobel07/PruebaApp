using PruebaApi.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace PruebaApi.Models
{
    public class Contextdb : DbContext
    {

        public Contextdb() :
            base("DefaultConnection")
        {

        }

        public DbSet<Product> Products { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Inventory> Inventory { get; set; }

        public DbSet<Sale> Sales { get; set; }
        public DbSet<SaleItem> SalesItems { get; set; }

    }
}