// MainEnginePerformanceDaily.cs
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
public class MainEnginePerformanceDaily
{
    public int Id { get; set; }
    public string VesselName { get; set; }
    public DateTime FormDate { get; set; }
    public string Personnel { get; set; }
    public int EngineNo { get; set; }
    public decimal AverageSpeedTC { get; set; }
    public decimal FuelPressure { get; set; }
    public decimal EngineLoad { get; set; }
    public decimal MeanScavAirPress { get; set; }
    public decimal TCExhInletTemp { get; set; }
    public decimal TCExhOutletTemp { get; set; }
    public decimal EngineKW { get; set; }
    public decimal CoolingWaterTemp { get; set; }
    public decimal LuboilTemp { get; set; }
    public decimal CoolingWaterPress { get; set; }
    public decimal LuboilPress { get; set; }
    public int compNo { get; set; }
    public ICollection<CylinderExhaustGasTempMainEngine> CylinderExhaustGasTemps { get; set; }
}

// CylinderExhaustGasTemp.cs
public class CylinderExhaustGasTempMainEngine
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }
    public int CylinderNo { get; set; }
    public decimal ExhaustGasTemp { get; set; }

    public int MainEnginePerformanceDailyId { get; set; } // Foreign Key zorunlu alan

    [ForeignKey("MainEnginePerformanceDailyId")]
    public MainEnginePerformanceDaily? MainEnginePerformanceDaily { get; set; }
}
