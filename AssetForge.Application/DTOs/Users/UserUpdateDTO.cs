namespace AssetForge.Application.DTOs.Users
{
    public class UserUpdateDTO
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Role {  get; set; } = "User";
    }
}
