using PruebaApi.DTOs;
using PruebaApi.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

namespace PruebaApi.Controllers
{

    [RoutePrefix("api/inventory")]
    public class InventoryController : ApiController
    {
        private Contextdb context = new Contextdb();

        [HttpGet]
        [Route("")]
        public IHttpActionResult GetInventory([FromUri] int? productId = null)
        {
            var query = context.Inventory.Include(i => i.Product).AsQueryable();

            if (productId.HasValue)
            {
                query = query.Where(i => i.ProductId == productId.Value);
            }

            var inventory = query.OrderByDescending(i => i.TransactionDate).ToListAsync();
            return Ok(inventory);
        }

        [HttpPost]
        [Route("")]
        public async Task<IHttpActionResult> PostInventory([FromBody] InventoryDTO inventoryDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var product = context.Products.Find(inventoryDto.ProductId);
            if (product == null || !product.IsActive)
            {
                ModelState.AddModelError("ProductId", "El Producto especificado no existe o está inactivo.");
                return BadRequest(ModelState);
            }

            var inventory = new Inventory
            {
                ProductId = inventoryDto.ProductId,
                QuantityChange = inventoryDto.QuantityChange,
                OperationType = inventoryDto.OperationType,
                TransactionDate = System.DateTime.Now
            };

            context.Inventory.Add(inventory);
            product.Stock += inventoryDto.QuantityChange;

            if (product.Stock < 0)
            {
                context.Inventory.Remove(inventory);
                ModelState.AddModelError("QuantityChange", $"La operación resultaría en stock negativo ({product.Stock}).");
                return BadRequest(ModelState);
            }

            context.Entry(product).State = EntityState.Modified;
            context.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { controller = "Inventory", id = inventory.Id }, inventory);
        }



    }
}