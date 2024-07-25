using System;
using System.Collections.Generic;

namespace CiriqueERP.Models;

public partial class VesselList
{
    public int Id { get; set; }

    public string? VesselName { get; set; }

    public int? CompNo { get; set; }
}
