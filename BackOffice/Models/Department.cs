using System;
using System.Collections.Generic;

namespace BackOffice.Models;

public partial class Department
{
    public int Id { get; set; }

    public string? DepartmantName { get; set; }

    public int? DepartmentRoles { get; set; }

    public virtual ICollection<BackOfficeUsers> BackOfficeUsers { get; set; } = new List<BackOfficeUsers>();

    public virtual ICollection<Crew> Crews { get; set; } = new List<Crew>();

    public virtual Role? DepartmentRolesNavigation { get; set; }

    public virtual ICollection<User> Users { get; set; } = new List<User>();
}
