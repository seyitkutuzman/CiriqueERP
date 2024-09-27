using System.ComponentModel.DataAnnotations;

namespace CiriqueERP.Models
{
    public class StockGeneral
    {
        [Key]
        public int StockID { get; set; }

        public string StockMainGroup { get; set; }
        public string BudgetCode { get; set; }
        public string StockCode { get; set; }
        public string IMPACode { get; set; }

        [Required]
        public string ItemNo { get; set; }

        public string DrawingNo { get; set; }

        [Required]
        public string StockName { get; set; }

        public string StockNameLocal { get; set; }

        [Required]
        public string Unit { get; set; }

        public bool? HasExpirationDate { get; set; }
        public bool? IsMSDS { get; set; }
        public bool? IsCritical { get; set; }
        public bool? HasCertificate { get; set; }
        public bool? OptimumStock { get; set; }

        public int? MinStock { get; set; }
        public int? MaxStock { get; set; }
        public int? WorkingStock { get; set; }

        public string Comment { get; set; }
        public string FilePath { get; set; }
        public string ImageResizeOption { get; set; }
        public int compNo { get; set; }
    }
}
