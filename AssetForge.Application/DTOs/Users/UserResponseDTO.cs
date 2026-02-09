namespace AssetForge.Application.DTOs.Users
{
    public class UserResponseDTO
    {
        public int Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string NotificationEmail { get; set; } = string.Empty;
        public string Role {  get; set; } = string.Empty;
    }
}
