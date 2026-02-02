namespace AssetForge.Application.DTOs.Assets
{
    public class AssetCreateDTO
    {
        public string Name { get; set; } = string.Empty;
        public string Category {  get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime PurchaseDate { get; set; }
        public int? UserId { get; set; }
        public string SerialNumber { get; set; } = string.Empty;
    }
}
