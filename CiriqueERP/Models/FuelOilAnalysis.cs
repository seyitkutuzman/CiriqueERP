using System;
using System.ComponentModel.DataAnnotations;

public class FuelOilAnalysis
{
    [Key]
    public int ReportID { get; set; } // Otomatik artan birincil anahtar

    [MaxLength(255)]
    public string? VesselName { get; set; } // Gemi adı

    [MaxLength(50)]
    public string ReportNumber { get; set; } // Rapor numarası

    [Required]
    public DateTime Date { get; set; } // Rapor tarihi

    [Required]
    public decimal Quantity { get; set; } // Miktar

    [Required]
    public decimal Viscosity { get; set; } // Viskozite

    [Required]
    public decimal Density { get; set; } // Yoğunluk

    [MaxLength(255)]
    public string Port { get; set; } // Liman

    [MaxLength(50)]
    public string BunkerType { get; set; } // Yakıt türü

    [MaxLength(50)]
    public string Status { get; set; } // Durum

    [MaxLength(255)]
    public string Supplier { get; set; } // Tedarikçi

    [MaxLength(255)]
    public string BargeTerminal { get; set; } // Barge veya terminal adı

    public DateTime? SampleSentDate { get; set; } // Örnek gönderim tarihi

    public DateTime? SampleReceivedDate { get; set; } // Örnek alım tarihi

    [MaxLength(255)]
    public string FirmName { get; set; } // Firma adı

    [MaxLength(255)]
    public string SamplingMethod { get; set; } // Örnek alma metodu

    [MaxLength(255)]
    public string SealNumberSupplier { get; set; } // Tedarikçi mühür numarası

    [MaxLength(255)]
    public string SealNumberMarpol { get; set; } // Marpol mühür numarası

    [MaxLength(255)]
    public string SamplePointType { get; set; } // Örnek noktası türü

    [MaxLength(255)]
    public string SealNumberLab { get; set; } // Laboratuvar mühür numarası

    [MaxLength(255)]
    public string SealNumberVessel { get; set; } // Gemi mühür numarası

    public string CompanyComments { get; set; } // Şirket yorumları

    [MaxLength(255)]
    public string DocumentFile { get; set; } // Belge dosyası
}
