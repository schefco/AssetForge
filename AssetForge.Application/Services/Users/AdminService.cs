using AssetForge.Application.DTOs.Dashboard;
using AssetForge.Infrastructure.Data;
using AssetForge.Infrastructure.Entities;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace AssetForge.Application.Services.Users
{
    public class AdminService
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public async Task<AdminOverviewDTO> GetOverViewAsync()
        {
            return new AdminOverviewDTO
            {
                TotalAssets = await _context.Assets.CountAsync(),
                TotalTickets = await _context.Tickets.CountAsync(),
                OpenTickets = await _context.Tickets.CountAsync(t => t.Status == "Open"),
                ClosedTickets = await _context.Tickets.CountAsync(t => t.Status == "Closed"),

                TicketsByPriority = await _context.Tickets
                .GroupBy(t => t.Priority)
                .ToDictionaryAsync(g => g.Key, g => g.Count()),

                TicketsByStatus = await _context.Tickets
                .GroupBy(t => t.Status)
                .ToDictionaryAsync(g => g.Key, g => g.Count()),

                AssetsByCategory = await _context.Assets
                .GroupBy(a => a.Category)
                .ToDictionaryAsync(g => g.Key, g => g.Count()),

                AssetsByStatus = await _context.Assets
                .GroupBy(a => a.Status)
                .ToDictionaryAsync(g => g.Key, g => g.Count())
            };
        }
    }
}
