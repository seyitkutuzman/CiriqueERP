using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace BackOffice.Models;

public partial class BackOfficeUsers
{
    public int Id { get; set; }

    public string userCode { get; set; }

    public string userPass { get; set; }

    public int department { get; set; }

    public DateTime? createDate { get; set; }

    public DateTime? modifyDate { get; set; }

    public string name { get; set; }

    public string surname { get; set; }
}
