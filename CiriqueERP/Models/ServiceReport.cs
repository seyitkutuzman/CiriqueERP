using System;
using System.ComponentModel.DataAnnotations;

public class ServiceReport
{
    [Key]
    public int ReportID { get; set; } // Otomatik artan birincil anahtar

    [MaxLength(255)]
    public string VesselName { get; set; } // Gemi adı

    [MaxLength(255)]
    public string VesselComponent { get; set; } // Gemi bileşeni

    [MaxLength(255)]
    public string Company { get; set; } // Şirket adı

    [Required]
    public DateTime ReportDate { get; set; } // Rapor tarihi

    public string Description { get; set; } // Açıklama

    [MaxLength(255)]
    public string DocumentFile { get; set; } // Belge dosyası

    [MaxLength(255)]
    public string CreatedBy { get; set; } // Oluşturan kişi

    public DateTime CreatedDate { get; set; } = DateTime.Now; // Oluşturulma tarihi

    public int compNo { get; set; } // Şirket numarası
}
