using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AssetForge.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class SeedAdminUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AssignedTo",
                table: "Tickets");

            migrationBuilder.RenameColumn(
                name: "AssignedTo",
                table: "Assets",
                newName: "SerialNumber");

            migrationBuilder.AddColumn<int>(
                name: "AssignedToId",
                table: "Tickets",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedById",
                table: "Tickets",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                table: "Assets",
                type: "int",
                nullable: true);

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "CreatedAt", "Email", "FirstName", "LastName", "PasswordHash", "PasswordSalt", "RefreshToken", "RefreshTokenExpiryTime", "Role" },
                values: new object[] { 1, new DateTime(2026, 1, 16, 15, 26, 53, 334, DateTimeKind.Utc).AddTicks(302), "admin@assetforge.com", "Admin", "User", new byte[] { 97, 35, 129, 5, 26, 168, 22, 154, 96, 214, 215, 125, 105, 9, 53, 180, 199, 112, 150, 44, 10, 45, 73, 105, 16, 6, 145, 178, 42, 106, 254, 160, 152, 132, 233, 69, 225, 45, 182, 171, 137, 67, 92, 207, 240, 188, 140, 121, 31, 164, 93, 20, 159, 253, 154, 107, 110, 56, 27, 196, 156, 46, 219, 157 }, new byte[] { 29, 106, 51, 99, 231, 2, 229, 73, 12, 135, 86, 32, 39, 123, 154, 169, 129, 110, 6, 93, 99, 131, 60, 208, 172, 210, 129, 179, 91, 71, 209, 64, 232, 26, 74, 129, 140, 35, 181, 147, 139, 206, 254, 97, 17, 7, 223, 32, 109, 249, 16, 12, 252, 57, 18, 238, 126, 44, 24, 167, 174, 156, 158, 73, 41, 134, 40, 133, 184, 130, 60, 11, 184, 123, 139, 42, 119, 48, 22, 229, 111, 84, 72, 20, 94, 88, 218, 49, 107, 197, 173, 29, 112, 241, 73, 225, 56, 158, 48, 76, 185, 177, 137, 60, 126, 125, 31, 175, 171, 50, 52, 71, 229, 155, 213, 242, 116, 189, 122, 8, 105, 102, 92, 102, 39, 40, 43, 3 }, "", new DateTime(2026, 1, 16, 15, 26, 53, 334, DateTimeKind.Utc).AddTicks(838), "Admin" });

            migrationBuilder.CreateIndex(
                name: "IX_Tickets_AssignedToId",
                table: "Tickets",
                column: "AssignedToId");

            migrationBuilder.CreateIndex(
                name: "IX_Tickets_CreatedById",
                table: "Tickets",
                column: "CreatedById");

            migrationBuilder.CreateIndex(
                name: "IX_Assets_UserId",
                table: "Assets",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Assets_Users_UserId",
                table: "Assets",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Tickets_Users_AssignedToId",
                table: "Tickets",
                column: "AssignedToId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Tickets_Users_CreatedById",
                table: "Tickets",
                column: "CreatedById",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Assets_Users_UserId",
                table: "Assets");

            migrationBuilder.DropForeignKey(
                name: "FK_Tickets_Users_AssignedToId",
                table: "Tickets");

            migrationBuilder.DropForeignKey(
                name: "FK_Tickets_Users_CreatedById",
                table: "Tickets");

            migrationBuilder.DropIndex(
                name: "IX_Tickets_AssignedToId",
                table: "Tickets");

            migrationBuilder.DropIndex(
                name: "IX_Tickets_CreatedById",
                table: "Tickets");

            migrationBuilder.DropIndex(
                name: "IX_Assets_UserId",
                table: "Assets");

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DropColumn(
                name: "AssignedToId",
                table: "Tickets");

            migrationBuilder.DropColumn(
                name: "CreatedById",
                table: "Tickets");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Assets");

            migrationBuilder.RenameColumn(
                name: "SerialNumber",
                table: "Assets",
                newName: "AssignedTo");

            migrationBuilder.AddColumn<string>(
                name: "AssignedTo",
                table: "Tickets",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
