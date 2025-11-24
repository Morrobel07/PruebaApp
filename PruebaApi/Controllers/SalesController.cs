using PruebaApi.Models;
using PruebaApi.DTOs;
using System;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using System.Data.Entity;

namespace PruebaApi.Controllers
{
    [RoutePrefix("api/sales")]
    public class SalesController : ApiController
    {
        private Contextdb context = new Contextdb();

        [HttpGet]
        [Route("")]
        public IHttpActionResult GetSales([FromUri] int? customerId = null)
        {
            var query = context.Sales
                .Include(s => s.Customer)
                .Include(s => s.SaleItems.Select(si => si.Product))
                .AsQueryable();

            if (customerId.HasValue)
            {
                query = query.Where(s => s.CustomerId == customerId.Value);
            }

            var sales = query.OrderByDescending(s => s.SaleDate).ToList();
            return Ok(sales);
        }

        [HttpGet]
        [Route("{id:int}", Name = "GetSaleById")]
        public IHttpActionResult GetSale(int id)
        {
            var sale = context.Sales
                .Include(s => s.Customer)
                .Include(s => s.SaleItems.Select(si => si.Product))
                .FirstOrDefault(s => s.Id == id);

            if (sale == null) return NotFound();
            return Ok(sale);
        }

        [HttpPost]
        [Route("")]
        public async Task<IHttpActionResult> PostSale([FromBody] SaleCreateDTO dto)
        {
            if (dto == null) return BadRequest("Payload inválido.");
            if (dto.Items == null || !dto.Items.Any())
            {
                ModelState.AddModelError("Items", "La venta debe contener al menos un ítem.");
                return BadRequest(ModelState);
            }

            var customer = context.Customers.Find(dto.CustomerId);
            if (customer == null || !customer.IsActive)
            {
                ModelState.AddModelError("CustomerId", "Cliente inexistente o inactivo.");
                return BadRequest(ModelState);
            }

            foreach (var item in dto.Items)
            {
                if (item.Quantity <= 0)
                {
                    ModelState.AddModelError("Quantity", "La cantidad debe ser mayor que cero.");
                    return BadRequest(ModelState);
                }

                var product = context.Products.Find(item.ProductId);
                if (product == null || !product.IsActive)
                {
                    ModelState.AddModelError("ProductId", $"Producto {item.ProductId} inexistente o inactivo.");
                    return BadRequest(ModelState);
                }

                if (product.Stock < item.Quantity)
                {
                    ModelState.AddModelError("Stock", $"Stock insuficiente para el producto {product.Name} (id={product.Id}).");
                    return BadRequest(ModelState);
                }
            }

            using (var tx = context.Database.BeginTransaction())
            {
                try
                {
                    var sale = new Sale
                    {
                        CustomerId = dto.CustomerId,
                        SaleDate = DateTime.UtcNow,
                        Total = 0m
                    };

                    context.Sales.Add(sale);
                    context.SaveChanges();

                    decimal total = 0m;

                    foreach (var itemDto in dto.Items)
                    {
                        var product = context.Products.Find(itemDto.ProductId);

                        var saleItem = new SaleItem
                        {
                            SaleId = sale.Id,
                            ProductId = product.Id,
                            Quantity = itemDto.Quantity,
                            Price = product.Price
                        };

                        total += saleItem.Price * saleItem.Quantity;

                        product.Stock -= saleItem.Quantity;
                        context.Entry(product).State = EntityState.Modified;

                        context.SalesItems.Add(saleItem);
                    }

                    sale.Total = total;
                    context.Entry(sale).State = EntityState.Modified;

                    context.SaveChanges();
                    tx.Commit();


                    return CreatedAtRoute("GetSaleById", new { id = sale.Id }, sale);
                }
                catch (Exception ex)
                {
                    tx.Rollback();
                    return InternalServerError(ex);
                }
            }
        }

        [HttpDelete]
        [Route("{id:int}")]
        public IHttpActionResult CancelSale(int id)
        {
            var sale = context.Sales
                .Include(s => s.SaleItems)
                .FirstOrDefault(s => s.Id == id);

            if (sale == null) return NotFound();

            using (var tx = context.Database.BeginTransaction())
            {
                try
                {

                    foreach (var si in sale.SaleItems)
                    {
                        var product = context.Products.Find(si.ProductId);
                        if (product != null)
                        {
                            product.Stock += si.Quantity;
                            context.Entry(product).State = EntityState.Modified;
                        }
                    }


                    context.SalesItems.RemoveRange(sale.SaleItems);
                    context.Sales.Remove(sale);

                    context.SaveChanges();
                    tx.Commit();
                    return Ok(new { Message = "Venta cancelada y stock restaurado." });
                }
                catch (Exception ex)
                {
                    tx.Rollback();
                    return InternalServerError(ex);
                }
            }
        }
    }
}