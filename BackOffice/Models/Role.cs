using System;
using System.Collections.Generic;

namespace BackOffice.Models;

public partial class Role
{
    public int Id { get; set; }

    public string? RoleName { get; set; }

    public string? Description { get; set; }

    public virtual ICollection<Department> Departments { get; set; } = new List<Department>();
}
