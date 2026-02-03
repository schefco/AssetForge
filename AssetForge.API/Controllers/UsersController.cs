using AssetForge.Application.DTOs.Users;
using AssetForge.Application.Interfaces.Users;
using AssetForge.Infrastructure.Data;
using AssetForge.Infrastructure.Entities;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Infrastructure;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace AssetForge.API.Controllers
{
    [Authorize(Roles = "Admin")]
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _service;

        public UsersController(IUserService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers()
            => Ok(await _service.GetAllAsync());

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await _service.GetByIdAsync(id);
            return user == null ? NotFound() : Ok(user);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, UserUpdateDTO dto)
            => Ok(await _service.UpdateAsync(id, dto));

        [HttpPut("{id}/reset-password")]
        public async Task<IActionResult> ResetPassword(int id, ResetPasswordDTO dto)
        {
            var success = await _service.ResetPasswordAsync(id, dto.NewPassword);
            if (!success) return NotFound("User not found");

            return Ok("Password reset successfully");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
            => await _service.DeleteAsync(id) ? NoContent() : NotFound();
    }
}
