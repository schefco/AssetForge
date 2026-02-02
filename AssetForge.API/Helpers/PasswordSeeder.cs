using Microsoft.AspNetCore.Identity;
using System.Net.NetworkInformation;

namespace AssetForge.API.Helpers
{
    public static class PasswordSeeder
    {
        public static string Hash(string password)
        {
            var hasher = new PasswordHasher<object>();
            return hasher.HashPassword(null, password);
        }
    }
}
