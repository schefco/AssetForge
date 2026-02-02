using Microsoft.EntityFrameworkCore;
using AssetForge.Infrastructure.Entities;

namespace AssetForge.Infrastructure.Data
{
    public class AppDbContext : DbContext
    {
        public DbSet<Asset> Assets => Set<Asset>();
        public DbSet<Ticket> Tickets => Set<Ticket>();
        public DbSet<User> Users => Set<User>();

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            //
            // User -> Assets (One to many)
            //
            modelBuilder.Entity<User>()
                .HasMany(u => u.Assets)
                .WithOne(a => a.User)
                .HasForeignKey(a => a.UserId)
                .OnDelete(DeleteBehavior.SetNull);

            //
            // User -> Created Tickets (One to many)
            //
            modelBuilder.Entity<User>()
                .HasMany(u => u.CreatedTickets)
                .WithOne(t => t.CreatedBy)
                .HasForeignKey(t => t.CreatedById)
                .OnDelete(DeleteBehavior.Restrict);

            //
            // User -> Assigned Tickets (One to many)
            //
            modelBuilder.Entity<User>()
                .HasMany(u => u.AssignedTickets)
                .WithOne(t => t.AssignedTo)
                .HasForeignKey(t => t.AssignedToId)
                .OnDelete(DeleteBehavior.SetNull);
        }
    }
}
