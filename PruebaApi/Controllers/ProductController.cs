using PruebaApi.Models;
using PruebaApi.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Threading.Tasks;
using System.Data.Entity.Core.Metadata.Edm;


namespace PruebaApi.Controllers
{
    [RoutePrefix("api/product")]
    public class ProductController : ApiController
    {
        private Contextdb context = new Contextdb();
        private const int PageSize = 5;

        [HttpGet]
        [Route("")]
        public IHttpActionResult GetProducts([FromUri] int page, [FromUri] bool? isActive = null)
        {
            var productsQuery = context.Products.AsQueryable();

            if (isActive.HasValue)
            {
                productsQuery = productsQuery.Where(p => p.IsActive == isActive.Value);

            }

            var totalItems = productsQuery.Count();



            var products = productsQuery
                .OrderBy(p => p.Id)
                .Skip((page - 1) * PageSize)
                .Take(PageSize)
                .ToList();

            var viewModel = new ProductsListViewModel
            {
                Products = products,
                PaginInfo = new PaginInfo
                {
                    CurrentPage = page,
                    ItemsPerPage = PageSize,
                    TotalItems = totalItems

                }


            };

            return Ok(viewModel);


        }



        [HttpPost]
        [Route("")]
        public IHttpActionResult PostProduct([FromBody] ProductDTO productDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (context.Products.Any(p => p.Name == productDTO.Name))
            {
                ModelState.AddModelError("Name", "ya existe un producto con este nombre");
                return Conflict();
            }

            var product = new Product
            {
                Name = productDTO.Name,
                Price = productDTO.Price,
                Stock = productDTO.Stock,
                IsActive = true,
                CreatedAt = System.DateTime.Now
            };

            context.Products.Add(product);
            context.SaveChanges();

            return Ok();
        }

        [HttpGet]
        [Route("inactive")]
        public IHttpActionResult GetInactiveProducts([FromUri] int page = 1)
        {
            return GetProducts(page, isActive: false);
        }

        [HttpGet]
        [Route("{id:int}")]
        public IHttpActionResult GetProduct(int id)
        {
            var product = context.Products.Find(id);
            if (product == null)
            {
                return NotFound();
            }
            return Ok(product);
        }

        [HttpPut]
        [Route("{id:int}")]
        public IHttpActionResult PutProduct(int id, [FromBody] ProductDTO productDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var product = context.Products.Find(id);
            if (product == null)
            {
                return NotFound();
            }

            if (context.Products.Any(p => p.Name == productDTO.Name && product.Id != id))
            {
                return BadRequest(ModelState);

            }

            product.Name = productDTO.Name;
            product.Price = productDTO.Price;
            product.Stock = productDTO.Stock;

            context.Entry(product).State = System.Data.Entity.EntityState.Modified;
            context.SaveChanges();

            return Ok();
        }

        [HttpDelete]
        [Route("{id:int}")]

        public IHttpActionResult DeleteProduct(int id)
        {
            var product = context.Products.Find(id);

            if (product == null)
            {
                return NotFound();
            }

            product.IsActive = false;

            context.Products.Remove(product);
            //context.Entry(product).State = System.Data.Entity.EntityState.Modified;
            context.SaveChanges();
            return Ok(new { Message = "Producto Eliminado" });
        }

    }
}