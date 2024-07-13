using System;
using System.Collections.Generic;

namespace CiriqueERP.Models;

public partial class Crew
{
    public int Id { get; set; }

    public string? FirstName { get; set; }

    public string? LastName { get; set; }

    public byte[]? IsOffice { get; set; }

    public string? Ship { get; set; }

    public string? Email { get; set; }

    public string? PhoneNo { get; set; }

    public string? Adress { get; set; }

    public byte[]? Gender { get; set; }

    public DateOnly? DateOfBirth { get; set; }

    public DateOnly? HireDate { get; set; }

    public int? DepartmentId { get; set; }

    public decimal? PerformanceAvg { get; set; }

    public DateOnly? CreateDate { get; set; }

    public DateOnly? ModifyDate { get; set; }

    public byte[]? IsActive { get; set; }

    public virtual Department? Department { get; set; }
}
