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

        public DbSet<BackOfficeUsers> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Fluent API kullanarak model konfigürasyonu yapabilirsiniz
            modelBuilder.Entity<BackOfficeUsers>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("PK__backOffi__3214EC2744D8EDE9");

                entity.ToTable("backOfficeUsers");

                entity.Property(e => e.Id).HasColumnName("ID");
                entity.Property(e => e.createDate).HasColumnName("createDate");
                entity.Property(e => e.department).HasColumnName("department");
                entity.Property(e => e.modifyDate).HasColumnName("modifyDate");
                entity.Property(e => e.name)
                    .HasMaxLength(25)
                    .IsUnicode(false)
                    .HasColumnName("name");
                entity.Property(e => e.surname)
                    .HasMaxLength(25)
                    .IsUnicode(false)
                    .HasColumnName("surname");
                entity.Property(e => e.userCode)
                    .HasMaxLength(10)
                    .IsUnicode(false)
                    .HasColumnName("userCode");
                entity.Property(e => e.userPass)
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .HasColumnName("userPass");
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
