namespace PruebaApi.Migrations
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;
    using PruebaApi.Models;

    internal sealed class Configuration : DbMigrationsConfiguration<PruebaApi.Models.Contextdb>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
        }

        protected override void Seed(PruebaApi.Models.Contextdb context)
        {
            //  This method will be called after migrating to the latest version.

            //  You can use the DbSet<T>.AddOrUpdate() helper extension method
            //  to avoid creating duplicate seed data.

            context.Products.AddOrUpdate(

              new Product
              {
                  Name = "Kayak",
                  Price = 275M,
                  Stock = 30,
                  IsActive = true,
                  CreatedAt = DateTime.Now,
              },
              new Product
              {
                  Name = "Webcam HD",
                  Price = 45.00m,
                  Stock = 120,
                  IsActive = true,
                  CreatedAt = DateTime.Now.AddHours(-4)
              },
              new Product
              {
                  Name = "Mousepad XL",
                  Price = 15.50m,
                  Stock = 200,
                  IsActive = true,
                  CreatedAt = DateTime.Now.AddHours(-1)

              }
              );
            context.SaveChanges();
            base.Seed(context);


        }
    }
}
