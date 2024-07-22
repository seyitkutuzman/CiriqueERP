﻿using System;
using System.Collections.Generic;

namespace CiriqueERP.Models;

public partial class CoClass
{
    public int Id { get; set; }

    public string? VesselName { get; set; }

    public string? DocNo { get; set; }

    public string? Description { get; set; }

    public DateOnly? OpenedDate { get; set; }

    public int? Status { get; set; }

    public int? Tasks { get; set; }

    public int? CompNo { get; set; }
}
