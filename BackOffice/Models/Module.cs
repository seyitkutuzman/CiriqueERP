using System;
using System.Collections.Generic;

namespace BackOffice.Models;

public partial class Module
{
    public int Id { get; set; }

    public string? ModuleName { get; set; }

    public int? Price { get; set; }

    public string? Description { get; set; }

    public virtual ICollection<Company> Companies { get; set; } = new List<Company>();
}
