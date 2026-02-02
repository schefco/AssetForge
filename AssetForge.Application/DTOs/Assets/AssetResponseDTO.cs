namespace AssetForge.Application.DTOs.Assets
{
    public class AssetResponseDTO
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Category {  get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string AssignedTo { get; set; } = string.Empty;
        public DateTime PurchaseDate { get; set; }
        public int? UserId { get; set; }
    }
}
