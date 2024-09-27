using System;
using System.ComponentModel.DataAnnotations;

namespace CiriqueERP.Models
{
    public class StockInventory
    {
        [Key]
        public int StockInventoryID { get; set; }
        public string StockMainGroup { get; set; }
        public string Vessel { get; set; }
        public string Catalog { get; set; }
        public string StockName { get; set; }
        public string StockCode { get; set; }
        public bool MinStockDefined { get; set; }
        public bool OptimumStock { get; set; }
        public int Quantity { get; set; }
        public int MinQuantity { get; set; }
        public int ExistingQuantity { get; set; }
        public int CompNo { get; set; }  // Şirket numarası eklendi
        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}
