using Microsoft.EntityFrameworkCore;
using BackOffice.Models; 

namespace BackOffice.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<BackOfficeUser> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Fluent API kullanarak model konfigürasyonu yapabilirsiniz
            modelBuilder.Entity<BackOfficeUser>(entity =>
            {
                entity.HasKey(e => e.Id); // Primary key
                entity.Property(e => e.UserCode).HasMaxLength(100);
                entity.Property(e => e.UserPass).HasMaxLength(100);
                entity.Property(e => e.Name).HasMaxLength(100);
                entity.Property(e => e.Surname).HasMaxLength(100);
                entity.Property(e=> e.CreateDate).HasMaxLength(100);
                entity.Property(e => e.ModifyDate).HasMaxLength(100);
                entity.Property(e=>e.Department).HasMaxLength(100);
            });

            // Diğer tablolar için konfigürasyonlar
            // modelBuilder.Entity<Department>(entity =>
            // {
            //     entity.HasKey(e => e.DepartmentId);
            //     entity.Property(e => e.DepartmentName).HasMaxLength(100);
            // });
        }
    }
}
