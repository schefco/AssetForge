using AssetForge.Application.DTOs.Dashboard;

namespace AssetForge.Application.Interfaces.Users
{
    public interface IAdminService
    {
        Task<AdminOverviewDTO> GetOverviewAsync();
    }
}
