using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace CiriqueERP.Models;

public partial class CiriqueErpContext : DbContext
{
    public CiriqueErpContext()
    {
    }

    public CiriqueErpContext(DbContextOptions<CiriqueErpContext> options)
        : base(options)
    {
    }

    public virtual DbSet<BackOfficeUser> BackOfficeUsers { get; set; }

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

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<VesselList> VesselLists { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)

        => optionsBuilder.UseSqlServer("Data Source=cirique-erp.database.windows.net;Initial Catalog=CiriqueERP;Persist Security Info=True;User ID=catalcali;password=Seyit2346;Trust Server Certificate=True");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<BackOfficeUser>(entity =>
        {
            entity.ToTable("backOfficeUsers");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.CreateDate).HasColumnName("createDate");
            entity.Property(e => e.Department).HasColumnName("department");
            entity.Property(e => e.ModifyDate).HasColumnName("modifyDate");
            entity.Property(e => e.Name)
                .HasMaxLength(25)
                .IsUnicode(false)
                .HasColumnName("name");
            entity.Property(e => e.Surname)
                .HasMaxLength(25)
                .IsUnicode(false)
                .HasColumnName("surname");
            entity.Property(e => e.UserCode)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("userCode");
            entity.Property(e => e.UserPass)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("userPass");
        });

        modelBuilder.Entity<Company>(entity =>
        {
            entity.ToTable("Company");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.Adress)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasColumnName("adress");
            entity.Property(e => e.CompNo).HasColumnName("compNo");
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
        });

        modelBuilder.Entity<Crew>(entity =>
        {
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
        });

        modelBuilder.Entity<Department>(entity =>
        {
            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.DepartmantName)
                .HasMaxLength(25)
                .IsUnicode(false)
                .HasColumnName("departmantName");
            entity.Property(e => e.DepartmentRoles).HasColumnName("departmentRoles");
        });

        modelBuilder.Entity<Manual>(entity =>
        {
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
            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.CreateDate).HasColumnName("createDate");
            entity.Property(e => e.Description)
                .HasMaxLength(500)
                .IsUnicode(false)
                .HasColumnName("description");
            entity.Property(e => e.IsAnnual)
                .HasMaxLength(1)
                .IsFixedLength()
                .HasColumnName("isAnnual");
            entity.Property(e => e.IsMonthly)
                .HasMaxLength(1)
                .IsFixedLength()
                .HasColumnName("isMonthly");
            entity.Property(e => e.IsWeekly)
                .HasMaxLength(1)
                .IsFixedLength()
                .HasColumnName("isWeekly");
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
            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.Checker).HasColumnName("checker");
            entity.Property(e => e.CreateDate).HasColumnName("createDate");
            entity.Property(e => e.Description)
                .HasMaxLength(500)
                .IsUnicode(false)
                .HasColumnName("description");
            entity.Property(e => e.IsDone)
                .HasMaxLength(1)
                .IsFixedLength()
                .HasColumnName("isDone");
            entity.Property(e => e.ModifyDate).HasColumnName("modifyDate");
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("name");
            entity.Property(e => e.Rating).HasColumnName("rating");
        });

        modelBuilder.Entity<User>(entity =>
        {
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
            entity.Property(e => e.Name)
                .HasMaxLength(25)
                .IsUnicode(false)
                .HasColumnName("name");
            entity.Property(e => e.Surname)
                .HasMaxLength(25)
                .IsUnicode(false)
                .HasColumnName("surname");
            entity.Property(e => e.UserNo).HasColumnName("userNo");
            entity.Property(e => e.UserPass)
                .HasMaxLength(25)
                .IsUnicode(false)
                .HasColumnName("userPass");
        });

        modelBuilder.Entity<VesselList>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__vesselLi__3214EC272BA1935D");

            entity.ToTable("vesselList");

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnName("ID");
            entity.Property(e => e.CompNo).HasColumnName("compNo");
            entity.Property(e => e.VesselName)
                .HasMaxLength(25)
                .IsUnicode(false)
                .HasColumnName("vesselName");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
