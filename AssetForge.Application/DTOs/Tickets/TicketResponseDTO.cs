namespace AssetForge.Application.DTOs.Tickets
{
    public class TicketResponseDTO
    {
        public int Id { get; set; }
        public string TicketNumber { get; set; }
        public string Prefix { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Status {  get; set; } = string.Empty;
        public string Priority {  get; set; } = string.Empty;
        public string AssignedTo { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public int CreatedById { get; set; }
        public int? AssignedToId { get; set; }
    }
}
