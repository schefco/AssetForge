namespace AssetForge.Application.DTOs.Tickets
{
    public class TicketCreateDTO
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Priority {  get; set; } = "Medium";
        public string? Prefix { get; set; }
        public int? AssignedToId { get; set; }
    }
}
