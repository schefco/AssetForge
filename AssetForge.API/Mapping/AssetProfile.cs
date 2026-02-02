using AutoMapper;
using AssetForge.Infrastructure.Entities;
using AssetForge.Application.DTOs.Assets;

namespace AssetForge.API.Mapping
{
    public class AssetProfile : Profile
    {
        public AssetProfile()
        {
            CreateMap<Asset, AssetResponseDTO>()
                .ForMember(dest => dest.AssignedTo,
                opt => opt.MapFrom(src =>
                src.User != null
                ? src.User.FirstName + " " + src.User.LastName
                : null
                ));

            CreateMap<AssetCreateDTO, Asset>();
            CreateMap<AssetUpdateDTO, Asset>();
        }
    }
}
