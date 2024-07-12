using System;
using System.Collections.Generic;

namespace CiriqueERP.Models;

public partial class SparePart
{
    public int Id { get; set; }

    public string? Name { get; set; }

    public string? Description { get; set; }

    public DateOnly? CreateDate { get; set; }

    public DateOnly? ModifyDate { get; set; }
}
