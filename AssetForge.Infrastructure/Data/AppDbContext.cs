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

            // Seeded Admin
            var hash = Convert.FromBase64String("YSOBBRqoFppg1td9aQk1tMdwliwKLUlpEAaRsipq/qCYhOlF4S22q4lDXM/wvIx5H6RdFJ/9mmtuOBvEnC7bnQ==");
            var salt = Convert.FromBase64String("HWozY+cC5UkMh1YgJ3uaqYFuBl1jgzzQrNKBs1tH0UDoGkqBjCO1k4vO/mERB98gbfkQDPw5Eu5+LBinrpyeSSmGKIW4gjwLuHuLKncwFuVvVEgUXljaMWvFrR1w8UnhOJ4wTLmxiTx+fR+vqzI0R+Wb1fJ0vXoIaWZcZicoKwM=");

            modelBuilder.Entity<User>().HasData(new User
            {
                Id = 1,
                FirstName = "Admin",
                LastName = "User",
                Email = "admin@assetforge.com",
                Role = "Admin",
                CreatedAt = new DateTime(2026, 10, 10),
                PasswordHash = hash,
                PasswordSalt = salt,
                RefreshToken = "",
                RefreshTokenExpiryTime = new DateTime(2025, 10, 10)
            });

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
