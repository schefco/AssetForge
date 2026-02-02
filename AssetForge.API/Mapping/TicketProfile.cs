using AutoMapper;
using AssetForge.Infrastructure.Entities;
using AssetForge.Application.DTOs.Tickets;

namespace AssetForge.API.Mapping
{
    public class TicketProfile : Profile
    {
        public TicketProfile()
        {
            CreateMap<Ticket, TicketResponseDTO>();
            CreateMap<TicketCreateDTO, Ticket>();
            CreateMap<TicketUpdateDTO, Ticket>();
        }
    }
}
