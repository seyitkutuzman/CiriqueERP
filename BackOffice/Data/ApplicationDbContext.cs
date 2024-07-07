using Microsoft.EntityFrameworkCore;
using BackOffice.BoModels; 

namespace BackOffice.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<BackOfficeUsers> Users { get; set; }
    }
}
