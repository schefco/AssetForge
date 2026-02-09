using AutoMapper;
using AssetForge.Application.DTOs.Users;
using AssetForge.Application.Interfaces.Users;
using AssetForge.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using System.Diagnostics.Contracts;
using AssetForge.Infrastructure.Services;
using System.Security.Claims;

namespace AssetForge.Application.Services.Users
{
    public class UserService : IUserService
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public UserService(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<List<UserResponseDTO>> GetAllAsync()
        {
            var users = await _context.Users.ToListAsync();
            return _mapper.Map<List<UserResponseDTO>>(users);
        }

        public async Task<UserResponseDTO?> GetByIdAsync(int id)
        {
            var user = await _context.Users.FindAsync(id);
            return user == null ? null : _mapper.Map<UserResponseDTO>(user);
        }

        public async Task<UserResponseDTO> UpdateAsync(int id, UserUpdateDTO dto, string requesterRole)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
                throw new Exception("User not found");

            if (string.IsNullOrEmpty(user.NotificationEmail))
                user.NotificationEmail = user.Email;

            if (requesterRole == "Admin")
            {
                user.Email = dto.Email;
                user.Role = dto.Role;
            }

            user.FirstName = dto.FirstName ?? user.FirstName;
            user.LastName = dto.LastName ?? user.LastName;
            user.NotificationEmail = dto.NotificationEmail ?? user.NotificationEmail;

            await _context.SaveChangesAsync();

            return _mapper.Map<UserResponseDTO>(user);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return false;

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ResetPasswordAsync(int id, string newPassword)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return false;

            PasswordHasher.CreatePasswordHash(newPassword, out var hash, out var salt);

            user.PasswordHash = hash;
            user.PasswordSalt = salt;

            await _context.SaveChangesAsync();
            return true;
        }
    }
}
