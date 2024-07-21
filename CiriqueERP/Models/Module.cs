using System;
using System.Collections.Generic;

namespace CiriqueERP.Models;

public partial class Module
{
    public int Id { get; set; }

    public string ModuleName { get; set; } = null!;

    public string Description { get; set; } = null!;

    public int Price { get; set; }
}
