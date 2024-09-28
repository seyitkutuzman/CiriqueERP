using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CiriqueERP.Models
{
public class DirectOrder
{
    public int DirectOrderID { get; set; }
    public string Vessel { get; set; }
    public string Firm { get; set; }
    public string Currency { get; set; }
    public string OrderNo { get; set; }
    public string ReferenceNo { get; set; }
    public DateTime OrderDate { get; set; }
    public string Status { get; set; }
    public DateTime PeriodStart { get; set; }
    public DateTime PeriodEnd { get; set; }
    public string Comment { get; set; }

    public ICollection<OrderDetail> OrderDetails { get; set; }
    public ICollection<PersonnelSign> PersonnelSigns { get; set; }
}
public class OrderDetail
{
    public int OrderDetailID { get; set; }
    public int DirectOrderID { get; set; }
    public string BudgetCode { get; set; }
    public decimal Amount { get; set; }
    public decimal VAT { get; set; }
    public decimal OIV { get; set; }
    public decimal OTV { get; set; }
    public decimal DiscountNet { get; set; }
    public decimal Freight { get; set; }
    public decimal SubTotal { get; set; }

    public DirectOrder DirectOrder { get; set; }
}

public class PersonnelSign
{
    public int PersonnelSignID { get; set; }
    public int DirectOrderID { get; set; }
    public string PersonnelName { get; set; }
    public string Status { get; set; }
    public decimal Limit { get; set; }
    public DateTime SignedDate { get; set; }
    public string Comment { get; set; }

    public DirectOrder DirectOrder { get; set; }
}


}