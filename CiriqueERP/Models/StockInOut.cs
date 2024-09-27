using System;
using System.ComponentModel.DataAnnotations;

namespace CiriqueERP.Models
{
    public class StockInOut
    {
        [Key]
        public int StockInOutID { get; set; }

        [Required]
        [StringLength(100)]
        public string StockMainGroup { get; set; }

        [StringLength(50)]
        public string InOut { get; set; }

        [StringLength(100)]
        public string InOutType { get; set; }

        [Required]
        public int Quantity { get; set; }

        [Required]
        public DateTime Date { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public int CompNo { get; set; }
    }
}
