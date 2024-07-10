using System;
using System.Collections.Generic;

namespace BackOffice.Models;

public partial class Part
{
    public int Id { get; set; }

    public string? Name { get; set; }

    public string? Description { get; set; }

    public byte[]? IsAnnual { get; set; }

    public byte[]? IsMonthly { get; set; }

    public byte[]? IsWeekly { get; set; }

    public int? Period { get; set; }

    public DateOnly? LastMaintenance { get; set; }

    public DateOnly? CreateDate { get; set; }

    public DateOnly? ModifyDate { get; set; }
}
