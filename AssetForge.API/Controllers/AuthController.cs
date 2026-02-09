using AssetForge.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using AssetForge.Infrastructure.Services;
using AssetForge.Infrastructure.Entities;
using Microsoft.AspNetCore.Authorization;
using AssetForge.Application.DTOs.Users;
using AutoMapper;

namespace AssetForge.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;
        private readonly IMapper _mapper;

        public AuthController(AppDbContext context, IConfiguration config, IMapper mapper)
        {
            _context = context;
            _config = config;
            _mapper = mapper;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(UserCreateDTO dto)
        {
            // Check if this is the first user
            var isFirstUser = !await _context.Users.AnyAsync();

            if (!isFirstUser)
            {
                // After the first user exists, only Admins can register new users
                var requesterRole = User.FindFirstValue(ClaimTypes.Role);

                if (requesterRole != "Admin")
                    return Unauthorized("Only Admins can create new user accounts.");

                // Only Admins can assign elevated roles
                if (dto.Role != "User" && requesterRole != "Admin")
                    return Unauthorized("Only Admins can create Admin or Technician accounts.");
            }
            else
            {
                // First user is always Admin
                dto.Role = "Admin";
            }

            if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
                return BadRequest("Email already exists");

            PasswordHasher.CreatePasswordHash(dto.Password, out var hash, out var salt);

            var user = new User
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Email = dto.Email,
                NotificationEmail = dto.Email,
                PasswordHash = hash,
                PasswordSalt = salt,
                Role = dto.Role
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var userResponse = _mapper.Map<UserResponseDTO>(user);
            return Ok(userResponse);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDTO dto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
            if (user == null) return Unauthorized("Invalid credentials");

            if (!PasswordHasher.VerifyPassword(dto.Password, user.PasswordHash, user.PasswordSalt))
                return Unauthorized("Invalid credentials");

            var jwtSettings = _config.GetSection("Jwt");
            var key = Encoding.UTF8.GetBytes(jwtSettings["Key"]);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim("role", user.Role),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            };

            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(int.Parse(jwtSettings["ExpiresInMinutes"])),
                signingCredentials: new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256)
            );

            var refreshToken = TokenService.GenrateRefreshToken();
            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);

            await _context.SaveChangesAsync();

            var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

            var response = new LoginResponseDTO
            {
                Id = user.Id,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Role = user.Role,
                Token = tokenString,
                RefreshToken = refreshToken,
                NotificationEmail = user.NotificationEmail,
            };

            return Ok(response);
        }

        [Authorize]
        [HttpPut("update-password")]
        public async Task<IActionResult> UpdatePassword(UpdatePasswordDTO dto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var user = await _context.Users.FindAsync(userId);

            if (user == null) return NotFound("User not found");

            // Validate current password
            if (!PasswordHasher.VerifyPassword(dto.CurrentPassword, user.PasswordHash, user.PasswordSalt))
                return BadRequest("Current password is incorrect");

            // Update Password
            PasswordHasher.CreatePasswordHash(dto.NewPassword, out var hash, out var salt);
            user.PasswordHash = hash;
            user.PasswordSalt = salt;

            await _context.SaveChangesAsync();

            return Ok("Password updated successfully");
        }

        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> Me()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
                        ?? User.FindFirstValue(JwtRegisteredClaimNames.Sub);

            if (userId == null)
                return Unauthorized();

            var user = await _context.Users
                .Where(u => u.Id == int.Parse(userId))
                .Select(u => new {
                    u.Id,
                    u.Email,
                    u.Role,
                    u.FirstName,
                    u.LastName,
                    u.NotificationEmail,
                })
                .FirstOrDefaultAsync();

            if (user == null)
                return Unauthorized();

            return Ok(user);
        }

        [HttpGet("has-users")]
        public async Task<IActionResult> HasUsers()
        {
            var any = await _context.Users.AnyAsync();
            return Ok(any);
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh(string refreshToken)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.RefreshToken == refreshToken);

            if (user == null || user.RefreshTokenExpiryTime < DateTime.UtcNow)
                return Unauthorized("Invalid or expired refresh token");

            // Generate a new access token
            var jwtSettings = _config.GetSection("Jwt");
            var key = Encoding.UTF8.GetBytes(jwtSettings["Key"]);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(int.Parse(jwtSettings["ExpiresInMinutes"])),
                signingCredentials: new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256)
                );

            var newAccessToken = new JwtSecurityTokenHandler().WriteToken(token);

            // rotate refresh token
            var newRefreshToken = TokenService.GenrateRefreshToken();
            user.RefreshToken = newRefreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);

            await _context.SaveChangesAsync();

            return Ok(new
            {
                token = newAccessToken,
                refreshToken = newRefreshToken
            });
        }
    }
}
