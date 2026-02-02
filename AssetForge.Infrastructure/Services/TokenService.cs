using System.Security.Cryptography;

namespace AssetForge.Infrastructure.Services
{
    public class TokenService
    {
        public static string GenrateRefreshToken()
        {
            var randomBytes = new byte[64];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomBytes);
            return Convert.ToBase64String(randomBytes);
        }
    }
}
