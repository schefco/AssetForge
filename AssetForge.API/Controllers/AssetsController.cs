using AssetForge.Application.DTOs.Assets;
using AssetForge.Application.Interfaces.Assets;
using AssetForge.Application.Models;
using AssetForge.Infrastructure.Data;
using AssetForge.Infrastructure.Entities;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AssetForge.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AssetsController : ControllerBase
    {
        private readonly IAssetService _service;

        public AssetsController(IAssetService service)
        {
            _service = service;
        }

        // GET

        [HttpGet]
        public async Task<IActionResult> GetAssets()
            => Ok(await _service.GetAllAsync());

        [HttpGet("{id}")]
        public async Task<IActionResult> GetAsset(int id)
        {
            var asset = await _service.GetByIdAsync(id);
            return asset == null ? NotFound() : Ok(asset);
        }

        [HttpGet("query")]
        public async Task<IActionResult> QueryAssets([FromQuery] QueryParameters p)
        {
            return Ok(await _service.QueryAsync(p));
        }

        [HttpGet("mine")]
        public async Task<IActionResult> GetMyAssets()
        {
            var userId = int.Parse(User.FindFirst("id")!.Value);
            return Ok(await _service.GetAssetsForUserAsync(userId));
        }

        // POST

        [HttpPost]
        public async Task<IActionResult> CreateAsset(AssetCreateDTO dto)
            => Ok(await _service.CreateAsync(dto));


        // PUT

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAsset(int id, AssetUpdateDTO dto)
            => Ok(await _service.UpdateAsync(id, dto));

        [HttpPut("{id}/assign/{userId}")]
        public async Task<IActionResult> AssignAsset(int id, int userId)
        {
            await _service.AssignToUserAsync(id, userId);
            return Ok();
        }

        // DELETE

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAsset(int id)
            => await _service.DeleteAsync(id) ? NoContent() : NotFound();
    }
}
