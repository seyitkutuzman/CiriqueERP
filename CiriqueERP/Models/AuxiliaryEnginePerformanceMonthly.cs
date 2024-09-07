using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CiriqueERP.Models
{
    public class AuxiliaryEnginePerformanceMonthly
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int? Id { get; set; }
    public string? Vessel { get; set; }
    public DateTime FormDate { get; set; }
    public string? Personnel { get; set; }
    public int EngineNo { get; set; }
    public decimal PresentSpeed { get; set; }
    public decimal SW_Temperature { get; set; }
    public decimal TotalRunningHours { get; set; }
    public decimal MeanScavAirPress { get; set; }
    public decimal EngineLoad { get; set; }
    public decimal FuelViscosity { get; set; }
    public decimal FuelEngInletTemp { get; set; }
    public decimal FuelPressure { get; set; }
    public decimal MainScavExhAirTemp { get; set; }
    public decimal EngineKW { get; set; }
    public decimal CylCoolingWaterTemp { get; set; }
    public decimal CylCoolingWaterPress { get; set; }
    public decimal CylLuboilTemp { get; set; }
    public decimal CylLuboilPress { get; set; }
    public decimal OilConsTonsPerDay { get; set; }
    
    // Eksik alanlar
    public int CompNo { get; set; } // CompNo alanı
    
    public ICollection<CylinderExhaustGasTempMonthly> CylinderExhaustGasTemps { get; set; } = new List<CylinderExhaustGasTempMonthly>();
}


public class CylinderExhaustGasTempMonthly
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int? Id { get; set; }
    public int CylinderNo { get; set; }
    public decimal PMax { get; set; }
    public decimal PComp { get; set; }
    public decimal ExhGasTemp { get; set; }
    public decimal FPumpRackInd { get; set; }

    public int? AuxiliaryEnginePerformanceId { get; set; } // Correct foreign key name

    [ForeignKey("AuxiliaryEnginePerformanceMonthlyId")]
    public AuxiliaryEnginePerformanceMonthly AuxiliaryEnginePerformanceMonthly { get; set; } // Corrected navigation property
}


}
