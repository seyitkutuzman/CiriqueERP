using System;
using System.Collections.Generic;
using System.Xml.Linq;
using CiriqueERP.Models;
using Microsoft.EntityFrameworkCore;

namespace CiriqueERP.Data;


public partial class MasterContext : DbContext
{
    private readonly IConfiguration configuration;
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

    public virtual DbSet<CiriqueERP.Models.Task> Tasks { get; set; }

    public virtual DbSet<Users> Users { get; set; }
    public virtual DbSet<VesselList> VesselList { get; set;}
    public virtual DbSet<CoClass> CoClass { get; set;}

    public virtual DbSet<Mowner> Mowner { get; set; }

    public virtual DbSet<Regulatory> Regulatory { get; set; }
    public virtual DbSet<DocumentEquipment> DocumentEquipments { get; set; }

    public virtual DbSet<DocumentSection> DocumentSections { get; set; }
    public virtual DbSet<DocumentTypes> DocumentTypes { get; set; }
    public virtual DbSet<Certificate> Certificates { get; set; }



    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseSqlServer("Data Source=cirique-erp.database.windows.net;Initial Catalog=CiriqueERP;Persist Security Info=True;User ID=catalcali;password=Seyit2346;Trust Server Certificate=True");

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
            entity.Property(e => e.Module).HasColumnName("moduleID");
            entity.Property(e => e.TaxNumber)
                .HasMaxLength(500)
                .IsUnicode(false)
                .HasColumnName("taxNumber");

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
            entity.Property(e => e.DepartmentID).HasColumnName("departmentID");
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
            entity.HasKey(e => e.Id).HasName("PK__Departme__3214EC275FC47A94");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.DepartmantName)
                .HasMaxLength(25)
                .IsUnicode(false)
                .HasColumnName("departmantName");
            entity.Property(e => e.DepartmentRoles).HasColumnName("departmentRoles");

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

        modelBuilder.Entity<CiriqueERP.Models.Task>(entity =>
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
            entity.Property(e => e.name)
                .HasMaxLength(25)
                .IsUnicode(false)
                .HasColumnName("name");
            entity.Property(e => e.surname)
                .HasMaxLength(25)
                .IsUnicode(false)
                .HasColumnName("surname");
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

        modelBuilder.Entity<CoClass>(entity =>
        {
            entity.HasKey(e => e.ID).HasName("PK__CoClass__3213E83FF541A79F");

            entity.ToTable("CoClass");

            entity.Property(e => e.ID)
                .HasColumnName("id");

            entity.Property(e => e.Description)
                .HasMaxLength(2000)
                .IsUnicode(false)
                .HasColumnName("description");

            entity.Property(e => e.DocNo)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("docNo");

            entity.Property(e => e.OpenedDate)
                .HasColumnName("openedDate");

            entity.Property(e => e.Status)
                .HasColumnName("status");

            entity.Property(e => e.Tasks)
                .HasColumnName("tasks");

            entity.Property(e => e.VesselName)
                .HasMaxLength(25)
                .IsUnicode(false)
                .HasColumnName("vesselName");

            entity.Property(e => e.CompNo)
                .HasColumnName("compNo");

            entity.Property(e => e.Human)
                .HasColumnName("human");

            entity.Property(e => e.System)
                .HasColumnName("system");

            entity.Property(e => e.Material)
                .HasColumnName("material");

            entity.Property(e => e.Subject)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("subject");

            entity.Property(e => e.DueDate)
                .HasColumnName("dueDate");

            entity.Property(e => e.ExtendedDate)
                .HasColumnName("extendedDate");

            entity.Property(e => e.ClosedDate)
                .HasColumnName("closedDate");

            entity.Property(e => e.Remarks)
                .HasMaxLength(2000)
                .IsUnicode(false)
                .HasColumnName("remarks");
        });

        modelBuilder.Entity<Mowner>(entity =>
        {
            entity.HasKey(e => e.ID).HasName("PK_yeni_tablo");

            entity.ToTable("Mowner");

            entity.Property(e => e.ID)
                .HasColumnName("id");

            entity.Property(e => e.Description)
                .HasMaxLength(1000)
                .IsUnicode(false)
                .HasColumnName("description");

            entity.Property(e => e.DocNo)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("docNo");

            entity.Property(e => e.OpenedDate)
                .HasColumnName("openedDate");

            entity.Property(e => e.Status)
                .HasColumnName("status");

            entity.Property(e => e.Tasks)
                .HasColumnName("tasks");

            entity.Property(e => e.VesselName)
                .HasMaxLength(25)
                .IsUnicode(false)
                .HasColumnName("vesselName");

            entity.Property(e => e.CompNo)
                .HasColumnName("compNo");

            entity.Property(e => e.Human)
                .HasColumnName("human");

            entity.Property(e => e.System)
                .HasColumnName("system");

            entity.Property(e => e.Material)
                .HasColumnName("material");

            entity.Property(e => e.Subject)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("subject");

            entity.Property(e => e.DueDate)
                .HasColumnName("dueDate");

            entity.Property(e => e.ExtendedDate)
                .HasColumnName("extendedDate");

            entity.Property(e => e.ClosedDate)
                .HasColumnName("closedDate");

            entity.Property(e => e.Remarks)
                .HasMaxLength(2000)
                .IsUnicode(false)
                .HasColumnName("remarks");
        });
        modelBuilder.Entity<CoClass>(entity =>
        {
            entity.HasKey(e => e.ID).HasName("PK__CoClass__3213E83FF541A79F");

            entity.ToTable("CoClass");

            entity.Property(e => e.ID)
                .HasColumnName("id");

            entity.Property(e => e.Description)
                .HasMaxLength(2000)
                .IsUnicode(false)
                .HasColumnName("description");

            entity.Property(e => e.DocNo)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("docNo");

            entity.Property(e => e.OpenedDate)
                .HasColumnName("openedDate");

            entity.Property(e => e.Status)
                .HasColumnName("status");

            entity.Property(e => e.Tasks)
                .HasColumnName("tasks");

            entity.Property(e => e.VesselName)
                .HasMaxLength(25)
                .IsUnicode(false)
                .HasColumnName("vesselName");

            entity.Property(e => e.CompNo)
                .HasColumnName("compNo");

            entity.Property(e => e.Human)
                .HasColumnName("human");

            entity.Property(e => e.System)
                .HasColumnName("system");

            entity.Property(e => e.Material)
                .HasColumnName("material");

            entity.Property(e => e.Subject)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("subject");

            entity.Property(e => e.DueDate)
                .HasColumnName("dueDate");

            entity.Property(e => e.ExtendedDate)
                .HasColumnName("extendedDate");

            entity.Property(e => e.ClosedDate)
                .HasColumnName("closedDate");

            entity.Property(e => e.Remarks)
                .HasMaxLength(2000)
                .IsUnicode(false)
                .HasColumnName("remarks");
        });

        modelBuilder.Entity<Regulatory>(entity =>
        {
            entity.HasKey(e => e.ID).HasName("PK__Regulato__3214EC27CB36C59B");

            entity.ToTable("RegulatoryInformation");

            entity.Property(e => e.ID)
                .HasColumnName("id");

            entity.Property(e => e.Description)
                .HasMaxLength(1000)
                .IsUnicode(false)
                .HasColumnName("description");

            entity.Property(e => e.Vessel)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("vessel");

            entity.Property(e => e.dueBy)
                .HasColumnName("dueBy");

            entity.Property(e => e.implementedDate)
                .HasColumnName("implementedDate");

            entity.Property(e => e.className)
                .HasColumnName("ClassName");
        });
        modelBuilder.Entity<DocumentEquipment>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Document__3214EC07C1E02CBA");

            entity.ToTable("DocumentEquipment");

            entity.Property(e => e.Id).HasColumnName("id");

            entity.Property(e => e.RootName)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("rootName");

            entity.Property(e => e.EquipmentName)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("equipmentName");

            entity.Property(e => e.Comment)
                .HasMaxLength(1000)
                .IsUnicode(false)
                .HasColumnName("comment");
        });
        modelBuilder.Entity<DocumentSection>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Document__3214EC07D025B26D");
            entity.ToTable("DocumentSection");
            entity.Property(e => e.SectionName)
                .IsRequired()
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("sectionName");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
