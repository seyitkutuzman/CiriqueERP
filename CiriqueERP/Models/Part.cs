using System;
using System.Collections.Generic;

namespace CiriqueERP.Models;

public partial class Part
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string Description { get; set; } = null!;

    public DateOnly LastMaintenance { get; set; }

    public DateOnly CreateDate { get; set; }

    public DateOnly ModifyDate { get; set; }

    public int Period { get; set; }

    public byte[] IsAnnual { get; set; } = null!;

    public byte[] IsMonthly { get; set; } = null!;

    public byte[] IsWeekly { get; set; } = null!;
}
