using Microsoft.Identity.Client;

namespace AssetForge.Application.Models
{
    public class QueryParameters
    {
        // Paging
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? SortBy { get; set; }
        public bool Desc { get; set; } = false;

        // Filtering
        public int? UserId { get; set; }
        public string? Status { get; set; }
        public string? Category { get; set; }
        public string? Priority { get; set; }

        // Searching
        public string? Search { get; set; }
    }
}
