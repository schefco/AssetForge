namespace AssetForge.Application.DTOs.Dashboard
{
    public class AdminOverviewDTO
    {
        public int TotalAssets { get; set; }
        public int TotalTickets { get; set; }
        public int OpenTickets { get; set; }
        public int ClosedTickets { get; set; }

        public Dictionary<string, int> TicketsByPriority { get; set; } = new();
        public Dictionary<string, int> TicketsByStatus { get; set; } = new();

        public Dictionary<string, int> AssetsByCategory { get; set; } = new();
        public Dictionary<string, int> AssetsByStatus { get; set; } = new();
    }
}
