using AssetForge.Application.DTOs.Tickets;
using AssetForge.Application.Models;

namespace AssetForge.Application.Interfaces.Tickets
{
    public interface ITicketService
    {
        Task<List<TicketResponseDTO>> GetAllAsync();
        Task<TicketResponseDTO?> GetByIdAsync(int id);
        Task<TicketResponseDTO> CreateAsync(TicketCreateDTO dto, int userId);
        Task<TicketResponseDTO> UpdateAsync(int id, TicketUpdateDTO dto);
        Task<bool> DeleteAsync(int id);
        Task AssignToTechnicianAsync(int ticketId, int techId);
        Task<PagedResult<TicketResponseDTO>> QueryAsync(QueryParameters parameters);
        Task<List<TicketResponseDTO>> GetTicketsForUserAsync(int userId);
        Task<List<TicketResponseDTO>> GetTechnicianQueueAsync(int techId);
    }
}
