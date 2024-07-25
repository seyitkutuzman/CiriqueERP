using System;
using System.Collections.Generic;

namespace CiriqueERP.Models;

public partial class User
{
    public int Id { get; set; }

    public int CompNo { get; set; }

    public DateOnly CreateDate { get; set; }

    public DateOnly ModifyDate { get; set; }

    public string UserPass { get; set; } = null!;

    public int UserNo { get; set; }

    public int Departmant { get; set; }

    public string Name { get; set; } = null!;

    public string Surname { get; set; } = null!;

    public byte[] IsActive { get; set; } = null!;
}
