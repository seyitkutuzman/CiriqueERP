using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CiriqueERP.Models
{
    public class Order
    {
        public int OrderID { get; set; }                   // Sipariş ID
        public int UserID { get; set; }                    // Kullanıcı ID'si
        public string BudgetCode { get; set; }             // Bütçe Kodu
        public string Firm { get; set; }                   // Firma Bilgisi
        public string Currency { get; set; }               // Para Birimi
        public string PaymentType { get; set; }            // Ödeme Türü
        public DateTime PeriodStart { get; set; }          // Başlangıç Tarihi
        public DateTime PeriodEnd { get; set; }            // Bitiş Tarihi
        public DateTime OrderDate { get; set; }            // Sipariş Tarihi
        public string Vessel { get; set; }                 // Gemi Bilgisi
        public string ReferenceNo { get; set; }            // Referans No
        public decimal Amount { get; set; }                // Miktar
        public string Comment { get; set; }                // Yorum
        public string FilePath { get; set; }               // Dosya Yolu
        public DateTime CreatedAt { get; set; } = DateTime.Now;  // Oluşturulma Tarihi
        public DateTime UpdatedAt { get; set; } = DateTime.Now;  // Güncellenme Tarihi
        public int CompNo { get; set; }                    // Şirket No
    }
}