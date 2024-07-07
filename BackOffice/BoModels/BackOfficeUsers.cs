namespace BackOffice.BoModels
{
    public class BackOfficeUsers
    {
        int ID { get; set; }
        public string userCode { get; set; }
        public string userPass { get; set; }
        public int department { get; set; }
        public DateTime createDate { get; set;}
        public DateTime modifyDate { get; set;}
    }
}
