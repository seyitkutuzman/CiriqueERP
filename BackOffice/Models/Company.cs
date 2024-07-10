using System;
using System.Collections.Generic;

namespace BackOffice.Models;

public partial class Company
{
    public int Id { get; set; }

    public int? CompNo { get; set; }

    public string? TaxNumber { get; set; }

    public int? ModuleId { get; set; }

    public string? Adress { get; set; }

    public DateOnly? CreateDate { get; set; }

    public DateOnly? ModifyDate { get; set; }

    public byte[]? IsActive { get; set; }

    public virtual Module? Module { get; set; }

    public virtual ICollection<User> Users { get; set; } = new List<User>();
}
