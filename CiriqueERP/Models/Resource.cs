using System;
using System.Collections.Generic;

namespace CiriqueERP.Models;

public partial class Resource
{
    public int Id { get; set; }

    public string? Name { get; set; }

    public string? Value { get; set; }

    public DateOnly? CreateDate { get; set; }

    public DateOnly? ModifyDate { get; set; }

    public byte[]? IsActive { get; set; }
}
