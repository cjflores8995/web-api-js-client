using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPINorthWind.Models
{
    public class ProductDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public decimal UnitPrice { get; set; }

        public static implicit operator Product(ProductDTO productDTO)
        {
            return new Product
            {
                Id = productDTO.Id,
                Name = productDTO.Name,
                UnitPrice = productDTO.UnitPrice
            };
        }
    }
}
