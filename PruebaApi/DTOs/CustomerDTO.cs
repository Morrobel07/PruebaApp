using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace PruebaApi.DTOs
{

    public class CustomerDTO
    {
        [Required(ErrorMessage = "El nombre del cliente es obligatorio.")]
        [StringLength(200)]
        public string Name { get; set; }

        [Required(ErrorMessage = "El email es obligatorio.")]
        [EmailAddress(ErrorMessage = "Formato de email inválido.")]
        public string Email { get; set; }
    }

}