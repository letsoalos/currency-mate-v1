using AutoMapper;
using currencymate_api.Dtos;
using currencymate_core.Entities;

namespace currencymate_api.Helpers
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<Currency, CurrencyToReturnDto>().ReverseMap();            
        }
    }
}