using System;
using System.Collections.Generic;

namespace BackOffice.Models;

public partial class Users
{
    public int Id { get; set; }

    public int? CompNo { get; set; }

    public int? UserNo { get; set; }

    public string? UserPass { get; set; }

    public int? Departmant { get; set; }

    public DateOnly? CreateDate { get; set; }

    public DateOnly? ModifyDate { get; set; }

    public byte[]? IsActive { get; set; }

    public virtual Company? CompNoNavigation { get; set; }

    public virtual Department? DepartmantNavigation { get; set; }
}
