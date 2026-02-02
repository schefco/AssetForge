namespace AssetForge.Application.DTOs.Tickets
{
    public class TicketUpdateDTO
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Status {  get; set; } = string.Empty;
        public string Prioity {  get; set; } = string.Empty;
        public string AssignedTo {  get; set; } = string.Empty;
        public int CreatedById { get; set; }
        public int? AssignedToId { get; set; }
    }
}
