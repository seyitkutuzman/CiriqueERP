using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CiriqueERP.Models
{
    public class AuxiliaryEnginePerformance
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)] // Id otomatik olarak oluşturulacak
        public int Id { get; set; }
        public string Vessel { get; set; }
        public string Personnel { get; set; }
        public string Place { get; set; }
        public DateTime Date { get; set; }
        public int EngineNo { get; set; }
        public bool TasksCompleted { get; set; }
        public int CompNo { get; set; }

        // Yeni Eklenen Özellikler
        public decimal AverageSpeed { get; set; }
        public decimal EngineLoad { get; set; }
        public decimal EngineKW { get; set; }
        public decimal CoolingWaterTemp { get; set; }
        public decimal LuboilTemp { get; set; }
        public decimal CoolingWaterPress { get; set; }
        public decimal LuboilPress { get; set; }

        public ICollection<CylinderExhaustGasTemp> CylinderExhaustGasTemps { get; set; } = new List<CylinderExhaustGasTemp>();
    }

    public class CylinderExhaustGasTemp
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)] // Id otomatik olarak oluşturulacak
        public int Id { get; set; }
        public int CylinderNo { get; set; }
        public double ExhaustGasTemp { get; set; }

        public int AuxiliaryEnginePerformanceId { get; set; } // Yabancı anahtar null olamaz
        [ForeignKey("AuxiliaryEnginePerformanceId")]
        public AuxiliaryEnginePerformance AuxiliaryEnginePerformance { get; set; } // Navigasyon özelliği
    }
}
