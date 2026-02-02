using AssetForge.Application.DTOs.Assets;
using AssetForge.Application.Models;

namespace AssetForge.Application.Interfaces.Assets
{
    public interface IAssetService
    {
        Task<List<AssetResponseDTO>> GetAllAsync();
        Task<AssetResponseDTO?> GetByIdAsync(int id);
        Task<AssetResponseDTO> CreateAsync(AssetCreateDTO dto);
        Task<AssetResponseDTO> UpdateAsync(int id, AssetUpdateDTO dto);
        Task<bool> DeleteAsync(int id);
        Task AssignToUserAsync(int assetId, int userId);
        Task<PagedResult<AssetResponseDTO>> QueryAsync(QueryParameters parameters);
        Task<List<AssetResponseDTO>> GetAssetsForUserAsync(int userId);
    }
}
