using AutoMapper;
using AssetForge.Application.DTOs.Tickets;
using AssetForge.Application.Interfaces.Tickets;
using AssetForge.Infrastructure.Data;
using AssetForge.Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using AssetForge.Application.Models;

namespace AssetForge.Application.Services.Tickets
{
    public class TicketService : ITicketService
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public TicketService(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<List<TicketResponseDTO>> GetAllAsync()
        {
            var tickets = await _context.Tickets.ToListAsync();
            return _mapper.Map<List<TicketResponseDTO>>(tickets);
        }

        public async Task<TicketResponseDTO?> GetByIdAsync(int id)
        {
            var ticket = await _context.Tickets.FindAsync(id);
            return ticket == null ? null : _mapper.Map<TicketResponseDTO>(ticket);
        }

        public async Task<TicketResponseDTO> CreateAsync(TicketCreateDTO dto, int userId)
        {
            var ticket = _mapper.Map<Ticket>(dto);

            ticket.CreatedById = userId;
            ticket.AssignedToId = dto.AssignedToId;

            // Generate ticket number with optional prefix
            ticket.TicketNumber = await GenerateTicketNumberAsync(dto.Prefix);

            _context.Tickets.Add(ticket);
            await _context.SaveChangesAsync();
            return _mapper.Map<TicketResponseDTO>(ticket);
        }

        public async Task<TicketResponseDTO> UpdateAsync(int id, TicketUpdateDTO dto)
        {
            var ticket = await _context.Tickets.FindAsync(id);
            if (ticket == null)
                throw new Exception("Ticket not found");

            _mapper.Map(dto, ticket);

            ticket.AssignedToId = dto.AssignedToId;

            await _context.SaveChangesAsync();

            return _mapper.Map<TicketResponseDTO>(ticket);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var ticket = await _context.Tickets.FindAsync(id);
            if (ticket == null)
                return false;

            _context.Tickets.Remove(ticket);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task AssignToTechnicianAsync(int ticketId, int techId)
        {
            var ticket = await _context.Tickets.FindAsync(ticketId);
            if (ticket == null)
                throw new Exception("Ticket not found");

            var tech = await _context.Users.FindAsync(techId);
            if (tech == null)
                throw new Exception("Technician not found");

            ticket.AssignedToId = techId;

            await _context.SaveChangesAsync();
        }

        public async Task<PagedResult<TicketResponseDTO>> QueryAsync(QueryParameters p)
        {
            var query = _context.Tickets.AsQueryable();

            if (!string.IsNullOrWhiteSpace(p.Search))
            {
                var term = p.Search.ToLower();

                query = query.Where(t =>
                t.Title.ToLower().Contains(term) ||
                t.Description.ToLower().Contains(term) ||
                t.Status.ToLower().Contains(term) ||
                t.Priority.ToLower().Contains(term)
                );
            }

            // Filtering
            if (p.UserId.HasValue)
                query = query.Where(t => t.CreatedById == p.UserId || t.AssignedToId == p.UserId);

            if (!string.IsNullOrEmpty(p.Status))
                query = query.Where(t => t.Status == p.Status);

            if (!string.IsNullOrEmpty(p.Priority))
                query = query.Where(t => t.Priority == p.Priority);

            // Count before Paging
            var totalCount = await query.CountAsync();

            // Sorting
            query = p.SortBy?.ToLower() switch
            {
                "title" => p.Desc ? query.OrderByDescending(t => t.Title) : query.OrderBy(t => t.Title),
                "priority" => p.Desc ? query.OrderByDescending(t => t.Priority) : query.OrderBy(t => t.Priority),
                "status" => p.Desc ? query.OrderByDescending(t => t.Status) : query.OrderBy(t => t.Status),
                _ => query.OrderBy(t => t.Id)
            };

            // Paging
            var items = await query.Skip((p.Page - 1) * p.PageSize).Take(p.PageSize).ToListAsync();

            return new PagedResult<TicketResponseDTO> 
            {
                Page = p.Page,
                PageSize = p.PageSize,
                TotalCount = totalCount,
                TotalPages = (int)Math.Ceiling(totalCount / (double)p.PageSize),
                Items = _mapper.Map<List<TicketResponseDTO>>(items)
            };
        }

        public async Task<List<TicketResponseDTO>> GetTicketsForUserAsync(int userId)
        {
            var tickets = await _context.Tickets.Where(t => t.CreatedById == userId || t.AssignedToId == userId).ToListAsync();
            return _mapper.Map<List<TicketResponseDTO>>(tickets);
        }

        public async Task<List<TicketResponseDTO>> GetTechnicianQueueAsync(int techId)
        {
            var tickets = await _context.Tickets.Where(t => t.AssignedToId == techId && t.Status != "Closed")
                .OrderByDescending(t => t.Priority)
                .ToListAsync();

            return _mapper.Map<List<TicketResponseDTO>>(tickets);
        }

        private async Task<string> GenerateTicketNumberAsync(string? prefix)
        {
            // Normalize prefix
            // If custom, uses custom prefix, if not uses default "TKT"
            string finalPrefix = string.IsNullOrWhiteSpace(prefix) ? "TKT" : prefix.Trim().ToUpper().Substring(0, Math.Min(prefix.Length, 5));

            var now = DateTime.UtcNow;

            // Get year and julian
            var year = now.Year % 100; // last 2 digits of year
            var dayOfYear = now.DayOfYear;

            // Count tickets created today
            var todayStart = now.Date;
            var todayEnd = todayStart.AddDays(1);

            var countToday = await _context.Tickets.Where(t => t.CreatedAt >= todayStart && t.CreatedAt < todayEnd).CountAsync();

            var sequence = countToday + 1;

            // Format: Prefix + YYDDD + - + Sequence
            return $"{finalPrefix}{year:D2}{dayOfYear:D3}-{sequence:D4}";
        }
    }
}
