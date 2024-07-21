using System;
using System.Collections.Generic;

namespace CiriqueERP.Models;

public partial class BackOfficeUser
{
    public int Id { get; set; }

    public int Department { get; set; }

    public DateTime CreateDate { get; set; }

    public DateTime ModifyDate { get; set; }

    public string Name { get; set; } = null!;

    public string Surname { get; set; } = null!;

    public string UserCode { get; set; } = null!;

    public string UserPass { get; set; } = null!;
}
