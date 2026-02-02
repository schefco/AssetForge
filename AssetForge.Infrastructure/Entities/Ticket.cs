namespace AssetForge.Infrastructure.Entities
{
    public class Ticket
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Status { get; set; } = "Open"; // Open, InProgress, Closed
        public string Priority { get; set; } = "Medium"; // Low, Medium, High
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Creator
        public int CreatedById { get; set; }
        public User CreatedBy { get; set; }

        // Assigned
        public int? AssignedToId { get; set; }
        public User? AssignedTo { get; set; }

        // Ticket number
        public string? Prefix { get; set; } = "TKT";
        public string TicketNumber { get; set; } = string.Empty;
    }
}
