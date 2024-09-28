using System;
using System.ComponentModel.DataAnnotations;

namespace CiriqueERP.Models
{
    public class OrderList
    {
        [Key]
        public int OrderID { get; set; }

        [Required]
        [StringLength(100)]
        public string Vessel { get; set; }

        [StringLength(50)]
        public string BudgetCode { get; set; }

        [StringLength(255)]
        public string Firm { get; set; }

        [StringLength(100)]
        public string Department { get; set; }

        [StringLength(100)]
        public string DirectOrderNo { get; set; }

        [StringLength(100)]
        public string ReferenceNo { get; set; }

        public DateTime OrderDate { get; set; }

        [StringLength(100)]
        public string Personnel { get; set; }

        [StringLength(100)]
        public string SignedPersonnel { get; set; }

        [StringLength(50)]
        public string Status { get; set; }

        public decimal SubTotal { get; set; }

        [StringLength(10)]
        public string Currency { get; set; }

        public bool IsSigned { get; set; }

        public int CompNo { get; set; }  // Şirket numarası

        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}
