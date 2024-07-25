using System;
using System.Collections.Generic;

namespace CiriqueERP.Models;

public partial class Company
{
    public int Id { get; set; }

    public int CompNo { get; set; }

    public string Adress { get; set; } = null!;

    public DateOnly CreateDate { get; set; }

    public DateOnly ModifyDate { get; set; }

    public string TaxNumber { get; set; } = null!;

    public byte[] IsActive { get; set; } = null!;

    public int Module { get; set; }
}
