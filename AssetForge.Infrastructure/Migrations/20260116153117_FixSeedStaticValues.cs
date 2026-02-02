using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AssetForge.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class FixSeedStaticValues : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "RefreshTokenExpiryTime" },
                values: new object[] { new DateTime(2026, 10, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(2025, 10, 10, 0, 0, 0, 0, DateTimeKind.Unspecified) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "RefreshTokenExpiryTime" },
                values: new object[] { new DateTime(2026, 1, 16, 15, 26, 53, 334, DateTimeKind.Utc).AddTicks(302), new DateTime(2026, 1, 16, 15, 26, 53, 334, DateTimeKind.Utc).AddTicks(838) });
        }
    }
}
