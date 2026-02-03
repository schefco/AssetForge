using AssetForge.Application.DTOs.Users;
using AutoMapper;

namespace AssetForge.Application.Interfaces.Users
{
    public interface IUserService
    {
        Task<List<UserResponseDTO>> GetAllAsync();
        Task<UserResponseDTO?> GetByIdAsync(int id);
        Task<UserResponseDTO> UpdateAsync(int id, UserUpdateDTO dto);
        Task<bool> DeleteAsync(int id);
        Task<bool> ResetPasswordAsync(int id, string newPassword);
    }
}
