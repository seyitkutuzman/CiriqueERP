using System;
using System.Collections.Generic;
using BackOffice.Models;
using Microsoft.EntityFrameworkCore;

namespace BackOffice.Models;

public partial class MasterContext : DbContext
{
    public MasterContext()
    {
    }

    public MasterContext(DbContextOptions<MasterContext> options)
        : base(options)
    {
    }

    public virtual DbSet<BackOfficeUsers> BackOfficeUsers { get; set; }

    public virtual DbSet<Company> Companies { get; set; }

    public virtual DbSet<Crew> Crews { get; set; }

    public virtual DbSet<Department> Departments { get; set; }

    public virtual DbSet<Manual> Manuals { get; set; }

    public virtual DbSet<Module> Modules { get; set; }

    public virtual DbSet<Part> Parts { get; set; }

    public virtual DbSet<Resource> Resources { get; set; }

    public virtual DbSet<Role> Roles { get; set; }

    public virtual DbSet<SparePart> SpareParts { get; set; }

    public virtual DbSet<Task> Tasks { get; set; }

    public virtual DbSet<Users> Users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseSqlServer("data source=Seyit-Laptop\\SEYIT;initial catalog=master;;Trusted_Connection=True;TrustServerCertificate=True;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
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

        modelBuilder.Entity<Company>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Company__3214EC27CC81B651");

            entity.ToTable("Company");

            entity.HasIndex(e => e.CompNo, "UQ__Company__5E452BB77CBDC631").IsUnique();

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.Adress)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasColumnName("adress");
            entity.Property(e => e.CompNo)
                .IsRequired()
                .HasColumnName("compNo");
            entity.Property(e => e.CreateDate).HasColumnName("createDate");
            entity.Property(e => e.IsActive)
                .HasMaxLength(1)
                .HasDefaultValueSql("((0))")
                .IsFixedLength()
                .HasColumnName("isActive");
            entity.Property(e => e.ModifyDate).HasColumnName("modifyDate");
            entity.Property(e => e.ModuleId).HasColumnName("moduleID");
            entity.Property(e => e.TaxNumber)
                .HasMaxLength(500)
                .IsUnicode(false)
                .HasColumnName("taxNumber");

            entity.HasOne(d => d.Module).WithMany(p => p.Companies)
                .HasForeignKey(d => d.ModuleId)
                .HasConstraintName("FK__Company__moduleI__63A3C44B");
        });

        modelBuilder.Entity<Crew>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__crew__3214EC27066CEE70");

            entity.ToTable("crew");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.Adress)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("adress");
            entity.Property(e => e.CreateDate).HasColumnName("createDate");
            entity.Property(e => e.DateOfBirth).HasColumnName("dateOfBirth");
            entity.Property(e => e.DepartmentId).HasColumnName("departmentID");
            entity.Property(e => e.Email)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("email");
            entity.Property(e => e.FirstName)
                .HasMaxLength(25)
                .IsUnicode(false)
                .HasColumnName("firstName");
            entity.Property(e => e.Gender)
                .HasMaxLength(1)
                .IsFixedLength()
                .HasColumnName("gender");
            entity.Property(e => e.HireDate).HasColumnName("hireDate");
            entity.Property(e => e.IsActive)
                .HasMaxLength(1)
                .HasDefaultValueSql("((0))")
                .IsFixedLength()
                .HasColumnName("isActive");
            entity.Property(e => e.IsOffice)
                .HasMaxLength(1)
                .IsFixedLength()
                .HasColumnName("isOffice");
            entity.Property(e => e.LastName)
                .HasMaxLength(25)
                .IsUnicode(false)
                .HasColumnName("lastName");
            entity.Property(e => e.ModifyDate).HasColumnName("modifyDate");
            entity.Property(e => e.PerformanceAvg)
                .HasColumnType("decimal(18, 0)")
                .HasColumnName("performanceAvg");
            entity.Property(e => e.PhoneNo)
                .HasMaxLength(11)
                .IsUnicode(false)
                .HasColumnName("phoneNo");
            entity.Property(e => e.Ship)
                .HasMaxLength(25)
                .IsUnicode(false)
                .HasColumnName("ship");

            entity.HasOne(d => d.Department).WithMany(p => p.Crews)
                .HasForeignKey(d => d.DepartmentId)
                .HasConstraintName("FK__crew__department__789EE131");
        });

        modelBuilder.Entity<Department>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Departme__3214EC275FC47A94");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.DepartmantName)
                .HasMaxLength(25)
                .IsUnicode(false)
                .HasColumnName("departmantName");
            entity.Property(e => e.DepartmentRoles).HasColumnName("departmentRoles");

            entity.HasOne(d => d.DepartmentRolesNavigation).WithMany(p => p.Departments)
                .HasForeignKey(d => d.DepartmentRoles)
                .HasConstraintName("FK__Departmen__depar__68687968");
        });

        modelBuilder.Entity<Manual>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__manuals__3214EC2706BF9063");

            entity.ToTable("manuals");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.Name)
                .HasMaxLength(25)
                .IsUnicode(false)
                .HasColumnName("name");
            entity.Property(e => e.Path)
                .HasMaxLength(500)
                .IsUnicode(false)
                .HasColumnName("path");
        });

        modelBuilder.Entity<Module>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Modules__3214EC27C497A850");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.Description)
                .HasMaxLength(500)
                .IsUnicode(false)
                .HasColumnName("description");
            entity.Property(e => e.ModuleName)
                .HasMaxLength(25)
                .IsUnicode(false)
                .HasColumnName("moduleName");
            entity.Property(e => e.Price).HasColumnName("price");
        });

        modelBuilder.Entity<Part>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Parts__3214EC2737EA87AA");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.CreateDate).HasColumnName("createDate");
            entity.Property(e => e.Description)
                .HasMaxLength(500)
                .IsUnicode(false)
                .HasColumnName("description");
            entity.Property(e => e.IsAnnual)
                .HasMaxLength(1)
                .IsFixedLength();
            entity.Property(e => e.IsMonthly)
                .HasMaxLength(1)
                .IsFixedLength();
            entity.Property(e => e.IsWeekly)
                .HasMaxLength(1)
                .IsFixedLength();
            entity.Property(e => e.LastMaintenance).HasColumnName("lastMaintenance");
            entity.Property(e => e.ModifyDate).HasColumnName("modifyDate");
            entity.Property(e => e.Name)
                .HasMaxLength(25)
                .IsUnicode(false)
                .HasColumnName("name");
            entity.Property(e => e.Period).HasColumnName("period");
        });

        modelBuilder.Entity<Resource>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Resource__3214EC2781164E20");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.CreateDate).HasColumnName("createDate");
            entity.Property(e => e.IsActive)
                .HasMaxLength(1)
                .HasDefaultValueSql("((0))")
                .IsFixedLength()
                .HasColumnName("isActive");
            entity.Property(e => e.ModifyDate).HasColumnName("modifyDate");
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("name");
            entity.Property(e => e.Value)
                .HasMaxLength(2500)
                .IsUnicode(false)
                .HasColumnName("value");
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Roles__3214EC2707272060");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.Description)
                .HasMaxLength(500)
                .IsUnicode(false)
                .HasColumnName("description");
            entity.Property(e => e.RoleName)
                .HasMaxLength(25)
                .IsUnicode(false)
                .HasColumnName("roleName");
        });

        modelBuilder.Entity<SparePart>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__sparePar__3214EC274E298C0B");

            entity.ToTable("spareParts");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.CreateDate).HasColumnName("createDate");
            entity.Property(e => e.Description)
                .HasMaxLength(500)
                .IsUnicode(false)
                .HasColumnName("description");
            entity.Property(e => e.ModifyDate).HasColumnName("modifyDate");
            entity.Property(e => e.Name)
                .HasMaxLength(25)
                .IsUnicode(false)
                .HasColumnName("name");
        });

        modelBuilder.Entity<Task>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Tasks__3214EC2742F526C9");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.Checker).HasColumnName("checker");
            entity.Property(e => e.CreateDate).HasColumnName("createDate");
            entity.Property(e => e.Description)
                .HasMaxLength(500)
                .IsUnicode(false)
                .HasColumnName("description");
            entity.Property(e => e.IsDone)
                .HasMaxLength(1)
                .IsFixedLength();
            entity.Property(e => e.ModifyDate).HasColumnName("modifyDate");
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("name");
            entity.Property(e => e.Rating).HasColumnName("rating");
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

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
