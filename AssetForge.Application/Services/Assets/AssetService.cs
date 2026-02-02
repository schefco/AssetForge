using AutoMapper;
using AssetForge.Application.DTOs.Assets;
using AssetForge.Application.Interfaces.Assets;
using AssetForge.Infrastructure.Data;
using AssetForge.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using AssetForge.Application.Models;

namespace AssetForge.Application.Services.Assets
{
    public class AssetService : IAssetService
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public AssetService(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<List<AssetResponseDTO>> GetAllAsync()
        {
            var assets = await _context.Assets.ToListAsync();
            return _mapper.Map<List<AssetResponseDTO>>(assets);
        }

        public async Task<AssetResponseDTO?> GetByIdAsync(int id)
        {
            var asset = await _context.Assets.FindAsync(id);
            return asset == null ? null : _mapper.Map<AssetResponseDTO>(asset);
        }

        public async Task<AssetResponseDTO> CreateAsync(AssetCreateDTO dto)
        {
            var asset = _mapper.Map<Asset>(dto);

            // Assign user if provided
            asset.UserId = dto.UserId;
            
            _context.Assets.Add(asset);
            await _context.SaveChangesAsync();
            return _mapper.Map<AssetResponseDTO>(asset);
        }

        public async Task<AssetResponseDTO> UpdateAsync(int id, AssetUpdateDTO dto)
        {
            var asset = await _context.Assets.FindAsync(id);
            if (asset == null)
                throw new Exception("Asset not found");

            _mapper.Map(dto, asset);

            // Update assignemtn
            asset.UserId = dto.UserId;

            await _context.SaveChangesAsync();

            return _mapper.Map<AssetResponseDTO>(asset);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var asset = await _context.Assets.FindAsync(id);
            if (asset == null)
                return false;

            _context.Assets.Remove(asset);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task AssignToUserAsync(int assetId, int userId)
        {
            var asset = await _context.Assets.FindAsync(assetId);
            if (asset == null)
                throw new Exception("Asset not found");

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                throw new Exception("user not found");

            asset.UserId = userId;

            await _context.SaveChangesAsync();
        }

        public async Task<PagedResult<AssetResponseDTO>> QueryAsync(QueryParameters p)
        {
            var query = _context.Assets.AsQueryable();

            // Search
            if (!string.IsNullOrWhiteSpace(p.Search))
            {
                var term = p.Search.ToLower();

                query = query.Where(a =>
                a.Name.ToLower().Contains(term) ||
                a.Category.ToLower().Contains(term) ||
                a.Status.ToLower().Contains(term) ||
                a.SerialNumber.ToLower().Contains(term)
                );
            }

            // Filtering
            if (p.UserId.HasValue)
                query = query.Where(a => a.UserId == p.UserId);

            if (!string.IsNullOrEmpty(p.Status))
                query = query.Where(a => a.Status == p.Status);

            if (!string.IsNullOrEmpty(p.Category))
                query = query.Where(a => a.Category == p.Category);

            // Get page count before paging
            var totalCount = await query.CountAsync();

            // Sorting
            query = p.SortBy?.ToLower() switch
            {
                "name" => p.Desc ? query.OrderByDescending(a => a.Name) : query.OrderBy(a => a.Name),
                "status" => p.Desc ? query.OrderByDescending(a => a.Status) : query.OrderBy(a => a.Status),
                "category" => p.Desc ? query.OrderByDescending(a => a.Category) : query.OrderBy(a => a.Category),
                _ => query.OrderBy(a => a.Id)
            };

            // Paging
            var items = await query.Skip((p.Page - 1) * p.PageSize).Take(p.PageSize).ToListAsync();

            return new PagedResult<AssetResponseDTO> 
            {
                Page = p.Page,
                PageSize = p.PageSize,
                TotalCount = totalCount,
                TotalPages = (int)Math.Ceiling(totalCount / (double)p.PageSize),
                Items = _mapper.Map<List<AssetResponseDTO>>(items)
            };
        }

        public async Task<List<AssetResponseDTO>> GetAssetsForUserAsync(int userId)
        {
            var assets = await _context.Assets.Where(a => a.UserId == userId).ToListAsync();

            return _mapper.Map<List<AssetResponseDTO>>(assets);
        }
    }
}
