﻿using System;
using System.Collections.Generic;

namespace CiriqueERP.Models;

public partial class Manual
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string Path { get; set; } = null!;
}
