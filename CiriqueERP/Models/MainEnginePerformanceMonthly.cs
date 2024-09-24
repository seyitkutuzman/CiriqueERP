using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CiriqueERP.Models
{
    public class MainEnginePerformanceMonthly
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string VesselName { get; set; }
        public DateTime FormDate { get; set; }
        public string Personnel { get; set; }
        public int EngineNo { get; set; }
        public decimal CylinderConstantRpm { get; set; }
        public decimal SpeedRpm { get; set; }
        public decimal PresentSpeed { get; set; }
        public decimal TotalRunningHours { get; set; }
        public decimal PropellerPitch { get; set; }
        public decimal TheoreticalShipSpeed { get; set; }
        public string VesselCondition { get; set; }
        public int Sea { get; set; }
        public decimal EngineRoomTemp { get; set; }
        public decimal SW_Temperature { get; set; }
        public decimal Draft_FW_AFT { get; set; }
        public decimal Displacement { get; set; }
        public int WindWindDirection { get; set; }
        public decimal ActualShipSpeed { get; set; }
        public decimal ShipSlip { get; set; }
        public string ShipRoute { get; set; }
        public decimal FuelLevel { get; set; }
        public decimal GovernorSpeed { get; set; }
        public decimal SpeedSetting { get; set; }
        public decimal AverageSpeedME { get; set; }
        public decimal AverageSpeedTC { get; set; }
        public decimal FuelConsDuring { get; set; }
        public decimal FuelDensity { get; set; }
        public decimal FuelViscosity { get; set; }
        public decimal FuelEngInletTemp { get; set; }
        public decimal MeanScavAirPress { get; set; }
        public decimal ChangeAirTempBefore { get; set; }
        public decimal ChangeAirTempAfter { get; set; }
        public decimal EngineLoad { get; set; }
        public decimal TCExhInletTemp { get; set; }
        public decimal TCExhOutletTemp { get; set; }
        public decimal CylCoolingWaterTemp { get; set; }
        public decimal CylCoolingWaterPress { get; set; }
        public decimal CylLuboilTemp { get; set; }
        public decimal CylLuboilPress { get; set; }
        public decimal OilConsTonsPerDay { get; set; }
        public decimal EngineKW { get; set; }
        public int CompNo { get; set; } // Yeni eklenen alan
        public ICollection<CylinderExhaustGasTempMainEngineMonthly> CylinderExhaustGasTemps { get; set; } = new List<CylinderExhaustGasTempMainEngineMonthly>();
    }

     public class CylinderExhaustGasTempMainEngineMonthly
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public int CylinderNo { get; set; }
        public decimal PMax { get; set; }
        public decimal PComp { get; set; }
        public decimal ExhGasTemp { get; set; }
        public decimal FPumpRackInd { get; set; }
        public decimal VET { get; set; }
        public int MainEnginePerformanceMonthlyId { get; set; }

        [ForeignKey("MainEnginePerformanceMonthlyId")]
        public MainEnginePerformanceMonthly? MainEnginePerformanceMonthly { get; set; }
    }
}
