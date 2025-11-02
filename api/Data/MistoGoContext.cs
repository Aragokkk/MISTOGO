using Microsoft.EntityFrameworkCore;
using MistoGO.Models;

namespace MistoGO.Data
{
    public class MistoGoContext : DbContext
    {
        public MistoGoContext(DbContextOptions<MistoGoContext> options) : base(options) { }

        // DbSets (усі 10 таблиць)
        public DbSet<User> Users { get; set; }
        public DbSet<PasswordReset> PasswordResets { get; set; }
        public DbSet<VehicleType> VehicleTypes { get; set; }
        public DbSet<Vehicle> Vehicles { get; set; }
        public DbSet<Trip> Trips { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<Zone> Zones { get; set; }
        public DbSet<BlogPost> BlogPosts { get; set; }
        public DbSet<FaqItem> FaqItems { get; set; }
        public DbSet<SupportTicket> SupportTickets { get; set; }
        public DbSet<SupportMessage> SupportMessages { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Відображення таблиць (дублює [Table], але це безпечно і явно)
            modelBuilder.Entity<User>().ToTable("users");
            modelBuilder.Entity<PasswordReset>().ToTable("password_resets");
            modelBuilder.Entity<VehicleType>().ToTable("vehicle_types");
            modelBuilder.Entity<Vehicle>().ToTable("vehicles");
            modelBuilder.Entity<Trip>().ToTable("trips");
            modelBuilder.Entity<Payment>().ToTable("payments");
            modelBuilder.Entity<Zone>().ToTable("zones");
            modelBuilder.Entity<BlogPost>().ToTable("blog_posts");
            modelBuilder.Entity<FaqItem>().ToTable("faq_items");
            modelBuilder.Entity<SupportTicket>().ToTable("support_tickets");

            // Мінімальні ключові індекси, щоб збігтися з наявною схемою
            modelBuilder.Entity<User>().HasIndex(u => u.Email).IsUnique();

            modelBuilder.Entity<VehicleType>().HasIndex(vt => vt.Code).IsUnique();

            modelBuilder.Entity<Vehicle>()
                .HasIndex(v => v.Code).IsUnique();
            modelBuilder.Entity<Vehicle>()
                .HasOne(v => v.Type)
                .WithMany()
                .HasForeignKey(v => v.TypeId);

            modelBuilder.Entity<Trip>()
                .HasOne(t => t.User)
                .WithMany()
                .HasForeignKey(t => t.UserId);
            modelBuilder.Entity<Trip>()
                .HasOne(t => t.Vehicle)
                .WithMany()
                .HasForeignKey(t => t.VehicleId);

            modelBuilder.Entity<Payment>()
                .HasOne(p => p.User)
                .WithMany()
                .HasForeignKey(p => p.UserId);
            modelBuilder.Entity<Payment>()
                .HasOne(p => p.Trip)
                .WithMany()
                .HasForeignKey(p => p.TripId);

            modelBuilder.Entity<BlogPost>()
                .HasIndex(b => b.Slug);
            modelBuilder.Entity<BlogPost>()
                .HasOne(b => b.Author)
                .WithMany()
                .HasForeignKey(b => b.AuthorId);

            modelBuilder.Entity<FaqItem>()
                .HasIndex(f => f.Category);

            modelBuilder.Entity<SupportTicket>()
                .HasOne(s => s.User)
                .WithMany()
                .HasForeignKey(s => s.UserId);

            // Нюанси типів — ми вже заклали їх в [Column],
            //  тож тут додатково нічого не треба
             // SupportTicket -> User (опціональний зв'язок)
            modelBuilder.Entity<SupportTicket>()
                .HasOne(t => t.User)
                .WithMany()
                .HasForeignKey(t => t.UserId)
                .OnDelete(DeleteBehavior.SetNull);

            // SupportMessage -> Ticket (обов'язковий зв'язок)
            modelBuilder.Entity<SupportMessage>()
                .HasOne(m => m.Ticket)
                .WithMany()
                .HasForeignKey(m => m.TicketId)
                .OnDelete(DeleteBehavior.Cascade); // При видаленні тікету - видаляються повідомлення

            // SupportMessage -> User (опціональний зв'язок)
            modelBuilder.Entity<SupportMessage>()
                .HasOne(m => m.User)
                .WithMany()
                .HasForeignKey(m => m.UserId)
                .OnDelete(DeleteBehavior.SetNull); // При видаленні юзера - повідомлення залишаються

            // Індекси для швидкого пошуку
            modelBuilder.Entity<SupportTicket>()
                .HasIndex(t => t.Status);

            modelBuilder.Entity<SupportTicket>()
                .HasIndex(t => t.Priority);

            modelBuilder.Entity<SupportTicket>()
                .HasIndex(t => t.CreatedAt);

            modelBuilder.Entity<SupportMessage>()
                .HasIndex(m => m.TicketId);
        }
    }
}
