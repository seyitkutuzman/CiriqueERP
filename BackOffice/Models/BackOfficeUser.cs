using System;
using System.Collections.Generic;

namespace BackOffice.Models;

public partial class BackOfficeUser
{
    public int Id { get; set; }

    public string? UserCode { get; set; }

    public string? UserPass { get; set; }

    public int? Department { get; set; }

    public DateOnly? CreateDate { get; set; }

    public DateOnly? ModifyDate { get; set; }

    public string? Name { get; set; }

    public string? Surname { get; set; }

    public virtual Department? DepartmentNavigation { get; set; }
}
