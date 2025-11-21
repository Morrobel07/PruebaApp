using PruebaApi.Models;
using PruebaApi.DTOs;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Web.Http;

namespace PruebaApi.Controllers
{
    [RoutePrefix("api/customers")]
    public class CustomersController : ApiController
    {
        private Contextdb context = new Contextdb();

        [HttpGet]
        [Route("")]
        public IHttpActionResult GetCustomers()
        {
            var customers = context.Customers.Where(c => c.IsActive).ToList();
            return Ok(customers);
        }

        [HttpGet]
        [Route("{id:int}")]
        public IHttpActionResult GetCustomer(int id)
        {
            var customer = context.Customers.Find(id);
            if (customer == null || !customer.IsActive)
            {
                return NotFound();
            }
            return Ok(customer);
        }
        [HttpPost]
        [Route("")]
        public IHttpActionResult PostCustomer([FromBody] CustomerDTO customerDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Validación de unicidad de Name (siguiendo el patrón de Product)
            if (context.Customers.Any(c => c.Name == customerDto.Name))
            {
                ModelState.AddModelError("Name", "Ya existe un cliente con este nombre.");
                return Conflict();
            }

            var customer = new Customer
            {
                Name = customerDto.Name,
                Email = customerDto.Email,
                IsActive = true,
                CreatedAt = System.DateTime.Now
            };

            context.Customers.Add(customer);
            context.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { controller = "Customers", id = customer.Id }, customer);
        }

        [HttpPut]
        [Route("{id:int}")]
        public IHttpActionResult PutCustomer(int id, [FromBody] CustomerDTO customerDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var customer = context.Customers.Find(id);
            if (customer == null)
            {
                return NotFound();
            }

            if (context.Customers.Any(c => c.Name == customerDto.Name && c.Id != id))
            {
                ModelState.AddModelError("Name", "Ya existe otro cliente con este nombre.");
                return Conflict();
            }

            customer.Name = customerDto.Name;
            customer.Email = customerDto.Email;

            context.Entry(customer).State = EntityState.Modified;
            context.SaveChangesAsync();

            return StatusCode(HttpStatusCode.NoContent);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public IHttpActionResult DeleteCustomer(int id)
        {
            var customer = context.Customers.Find(id);
            if (customer == null)
            {
                return NotFound();
            }

            customer.IsActive = false;

            context.Entry(customer).State = EntityState.Modified;
            context.SaveChanges();

            return StatusCode(HttpStatusCode.NoContent);
        }


    }
}