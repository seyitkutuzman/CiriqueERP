using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CiriqueERP.Models
{
    public class AuxiliaryEnginePerformance
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string Vessel { get; set; }
        public string Personnel { get; set; }
        public string Place { get; set; }
        public DateTime Date { get; set; }
        public int EngineNo { get; set; }
        public bool TasksCompleted { get; set; }
        public int CompNo { get; set; }

        // Alanların veritabanı ile uyumlu olduğundan emin olun
        public decimal AverageSpeed { get; set; }  // Decimal'den Double'a geçiş yapılabilir
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
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public int CylinderNo { get; set; }
        public decimal ExhaustGasTemp { get; set; }

        public int AuxiliaryEnginePerformanceId { get; set; }

        [ForeignKey("AuxiliaryEnginePerformanceId")]
        public AuxiliaryEnginePerformance? AuxiliaryEnginePerformance { get; set; } // Navigasyon özelliği opsiyonel
    }

}
