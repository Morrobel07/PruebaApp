using PruebaApi.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Web.UI;

public class Sale
{
    [Key]
    public int Id { get; set; }

    public int CustomerId { get; set; }
    public DateTime SaleDate { get; set; }
    public decimal Total { get; set; }

    public virtual Customer Customer { get; set; }
    public virtual ICollection<SaleItem> SaleItems { get; set; }
}