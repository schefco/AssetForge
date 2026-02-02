namespace AssetForge.Infrastructure.Entities
{
    public class User
    {
        public int Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = "User"; // User, Admin, Technician
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public byte[] PasswordHash { get; set; } = Array.Empty<byte>();
        public byte[] PasswordSalt { get; set;} = Array.Empty<byte>();

        public string RefreshToken {  get; set; } = string.Empty;
        public DateTime RefreshTokenExpiryTime {  get; set; }

        // Relationship attributes
        public List<Asset> Assets { get; set; } = new();
        public List<Ticket> CreatedTickets { get; set; } = new();
        public List<Ticket> AssignedTickets {  get; set; } = new();
    }
}
