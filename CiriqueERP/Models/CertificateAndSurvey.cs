using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class CertificateAndSurvey
{
    [Key]
    public int CertificateID { get; set; }
    [Required]
    [MaxLength(255)]
    public string VesselName { get; set; }
    [MaxLength(255)]
    public string Department { get; set; }
    [MaxLength(255)]
    public string CertificateGroup { get; set; }
    [Required]
    [MaxLength(255)]
    public string CertificateName { get; set; }
    [MaxLength(255)]
    public string Type { get; set; }
    public DateTime? IssuedDate { get; set; }
    public DateTime? ExpirationDate { get; set; }
    [MaxLength(255)]
    public string IssuedBy { get; set; }
    [MaxLength(255)]
    public string Term { get; set; }
    public int? RenewalMonths { get; set; }
    public int? AnnualMonths { get; set; }
    public int? IntermediateMonths { get; set; }
    public DateTime? ValidationStartDate { get; set; }
    [MaxLength(50)]
    public string DocumentNo { get; set; }
    public bool HasDispensation { get; set; }
    public bool HasExemption { get; set; }
    [MaxLength(255)]
    public string CreatedBy { get; set; }
    public DateTime CreatedDate { get; set; }
    public DateTime? UpdatedDate { get; set; }
    public string Comment { get; set; } // Not: comment değil, Comment olarak güncellenmeli
    public ICollection<CertificateFile> CertificateFiles { get; set; }
}
    

public class CertificateFile
{
    [Key]
    public int FileID { get; set; }

    [ForeignKey("CertificateAndSurvey")]
    public int CertificateID { get; set; }

    [MaxLength(255)]
    public string FileName { get; set; }

    [MaxLength(255)]
    public string FilePath { get; set; }

    [MaxLength(255)]
    public string FileComment { get; set; }

    public DateTime FileAddedDate { get; set; }

    public CertificateAndSurvey CertificateAndSurvey { get; set; }
}

public class CertificateGroup
{
    [Key]
    public int GroupID { get; set; }

    [Required]
    [MaxLength(255)]
    public string GroupName { get; set; }
}
