using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using WebAPINorthWind.Data;
using WebAPINorthWind.Models;

namespace WebAPINorthWind.Controllers
{
    [EnableCors("CORSPolicy")]
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly NorthWindContext _context;

        public ProductsController(NorthWindContext context)
        {
            _context = context;
        }

        // GET: api/Products
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductDTO>>> GetProducts()
        {
            return await _context.Products.Select(p => (ProductDTO)p).ToListAsync();
        }

        // GET: api/Products/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ProductDTO>> GetProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);

            if(product == null)
            {
                return NotFound();
            }

            return (ProductDTO)product;
        }

        // PUT: api/Products/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProduct(int id, ProductDTO productDTO)
        {
            if(id != productDTO.Id)
            {
                return BadRequest();
            }

            var Product = await _context.Products.FindAsync(id);

            if(Product == null)
            {
                return NotFound();
            }

            Product.Name = productDTO.Name;
            Product.UnitPrice = productDTO.UnitPrice;

            try
            {
                await _context.SaveChangesAsync();
            } 
            catch(DbUpdateConcurrencyException) when (!ProductExists(id))
            {
                return NotFound();
            }

            return NoContent();
        }

        // POST: api/Products
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost]
        public async Task<ActionResult<ProductDTO>> PostProduct(ProductDTO productDTO)
        {
            Product product = productDTO;

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProduct), new { id = product.Id}, (ProductDTO)product);
        }

        // DELETE: api/Products
        [HttpDelete("{id}")]
        public async Task<ActionResult<ProductDTO>> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);

            if(product == null)
            {
                return NotFound();
            }

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ProductExists(int id)
        {
            return _context.Products.Any(x => x.Id == id);
        }
    }
}
