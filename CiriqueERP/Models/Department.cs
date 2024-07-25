using System;
using System.Collections.Generic;

namespace CiriqueERP.Models;

public partial class Department
{
    public int Id { get; set; }

    public string DepartmantName { get; set; } = null!;

    public int DepartmentRoles { get; set; }
}
