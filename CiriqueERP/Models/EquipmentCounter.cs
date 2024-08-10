namespace CiriqueERP.Models
{
    public class EquipmentCounter
    {
        public int? Id { get; set; }
        public int CompNo { get; set; }  // Şirket numarası eklendi
        public string Vessel { get; set; }
        public string EquipmentCounterName { get; set; }
    }
}
