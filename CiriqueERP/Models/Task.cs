using System;
using System.Collections.Generic;

namespace CiriqueERP.Models;

public partial class Task
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string Description { get; set; } = null!;

    public DateOnly CreateDate { get; set; }

    public DateOnly ModifyDate { get; set; }

    public int Rating { get; set; }

    public byte[] IsDone { get; set; } = null!;

    public int Checker { get; set; }
}
