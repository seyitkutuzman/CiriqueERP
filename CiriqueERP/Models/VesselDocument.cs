using System;
using System.ComponentModel.DataAnnotations;

public class VesselDocument
{
    [Key]
    public int DocumentID { get; set; } // Birincil anahtar, otomatik artan

    [Required, MaxLength(255)]
    public string VesselName { get; set; } // Gemi adı

    [Required, MaxLength(255)]
    public string DocumentType { get; set; } // Doküman türü

    [Required, MaxLength(255)]
    public string SectionName { get; set; } // Bölüm adı

    [MaxLength(255)]
    public string Equipment { get; set; } // Ekipman bilgisi

    [Required, MaxLength(255)]
    public string BookName { get; set; } // Kitap adı veya doküman başlığı

    public string Description { get; set; } // Açıklama

    [MaxLength(500)]
    public string FilePath { get; set; } // Dosya yolu veya URL'si

    [MaxLength(255)]
    public string CreatedBy { get; set; } // Dokümanı oluşturan kişi

    public DateTime CreatedDate { get; set; } = DateTime.Now; // Oluşturulma tarihi

    [Required]
    public int CompNo { get; set; } // Şirket numarası
}
