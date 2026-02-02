namespace AssetForge.Infrastructure.Entities
{
    public class Asset
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string Status { get; set; } = "Available"; // Available, Assigned, Retired, etc.
        public string SerialNumber { get; set; } = string.Empty;
        public DateTime PurchaseDate { get; set; }

        // Relationship attributes: who owns the asset
        public int? UserId { get; set; }
        public User? User { get; set; }
    }
}
