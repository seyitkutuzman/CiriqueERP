using System;
using System.Collections.Generic;

namespace CiriqueERP.Models;

public partial class Crew
{
    public int Id { get; set; }

    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string PhoneNo { get; set; } = null!;

    public string Adress { get; set; } = null!;

    public DateOnly DateOfBirth { get; set; }

    public DateOnly HireDate { get; set; }

    public byte[] Gender { get; set; } = null!;

    public decimal PerformanceAvg { get; set; }

    public string Ship { get; set; } = null!;

    public int DepartmentId { get; set; }

    public DateOnly CreateDate { get; set; }

    public DateOnly ModifyDate { get; set; }

    public byte[] IsActive { get; set; } = null!;

    public byte[] IsOffice { get; set; } = null!;
}
