using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PruebaApi.Models
{
    public class PaginInfo
    {
        public int CurrentPage { get; set; }
        public int ItemsPerPage { get; set; }
        public int TotalItems { get; set; }

        public int Total
        {
            get { return (int)Math.Ceiling((decimal)TotalItems / ItemsPerPage); }
        }
    }
}