using System;
using System.Collections.Generic;

namespace CiriqueERP.Models;

public partial class Role
{
    public int Id { get; set; }

    public string RoleName { get; set; } = null!;

    public string Description { get; set; } = null!;
}
