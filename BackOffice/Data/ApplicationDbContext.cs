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

        public DbSet<Users> CompanyUser { get; set; }

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

            modelBuilder.Entity<Users>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("PK__Users__3214EC27C1ECF451");

                entity.HasIndex(e => e.UserNo, "UQ__Users__CB9A040D0F6F8D90").IsUnique();

                entity.Property(e => e.Id).HasColumnName("ID");
                entity.Property(e => e.CompNo).HasColumnName("compNo");
                entity.Property(e => e.CreateDate).HasColumnName("createDate");
                entity.Property(e => e.Departmant).HasColumnName("departmant");
                entity.Property(e => e.IsActive)
                    .HasMaxLength(1)
                    .HasDefaultValueSql("((0))")
                    .IsFixedLength()
                    .HasColumnName("isActive");
                entity.Property(e => e.ModifyDate).HasColumnName("modifyDate");
                entity.Property(e => e.UserNo).HasColumnName("userNo");
                entity.Property(e => e.UserPass)
                    .HasMaxLength(25)
                    .IsUnicode(false)
                    .HasColumnName("userPass");

                entity.HasOne(d => d.CompNoNavigation).WithMany(p => p.Users)
                    .HasPrincipalKey(p => p.CompNo)
                    .HasForeignKey(d => d.CompNo)
                    .HasConstraintName("FK__Users__compNo__6C390A4C");

                entity.HasOne(d => d.DepartmantNavigation).WithMany(p => p.Users)
                    .HasForeignKey(d => d.Departmant)
                    .HasConstraintName("FK__Users__departman__6D2D2E85");
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
