namespace CiriqueERP.Models
{
    public class Users
    {
        public int Id { get; set; }
        public int compNo { get; set; }
        public int userNo { get; set; }
        public int userPass { get; set; }
        public int department { get; set; }
        public DateTime createDate { get; set; }
        public DateTime modifyDate { get; set; }
        public bool isActive { get; set; }
        
    }
}
