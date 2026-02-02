using AutoMapper;
using AssetForge.Infrastructure.Entities;
using AssetForge.Application.DTOs.Users;

namespace AssetForge.API.Mapping
{
    public class UserProfile : Profile
    {
        public UserProfile() 
        {
            CreateMap<User, UserResponseDTO>();
            CreateMap<UserCreateDTO, User>();
            CreateMap<UserUpdateDTO, User>();
        }
    }
}
