using AutoMapper;
using currencymate_api.Dtos;
using currencymate_api.Errors;
using currencymate_core.Entities;
using currencymate_core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace currencymate_api.Controllers
{
    public class CurrenciesController : BaseApiController
    {
        private readonly ICurrencyService _currencyService;
        private readonly IExternalCurrencyApiService _externalCurrencyApiService;
        private readonly IMapper _mapper;

        public CurrenciesController(ICurrencyService currencyService, IMapper mapper, IExternalCurrencyApiService externalCurrencyApiService)
        {
            _currencyService = currencyService;
            _externalCurrencyApiService = externalCurrencyApiService ;
            _mapper = mapper;    
        }

        [HttpGet("get-currencies")]
        public async Task<ActionResult<IReadOnlyList<CurrencyToReturnDto>>> GetCurrencies()
        {
            var currencyList = await _currencyService.GetCurrenciesAsync();

            var data = _mapper.Map<IReadOnlyList<CurrencyToReturnDto>>(currencyList);

            return Ok(data);
        }

        [HttpGet("get-currency/{id}")]
        public async Task<ActionResult<CurrencyToReturnDto>> GetCurrency(int id)
        {
            var currency = await _currencyService.GetCurrencyByIdAsync(id);

            if (currency == null) return NotFound(new ApiResponse(404));

            return Ok(_mapper.Map<CurrencyToReturnDto>(currency));
        }

        [HttpPost("add-currency")]
        public async Task<ActionResult<CurrencyToReturnDto>> AddCurrency(Currency obj)
        {
            var currency = await _currencyService.CreateCurrencyAsync(obj);

            if(currency == null) return BadRequest(new ApiResponse(400, "Problem creating currency"));

            return Ok(_mapper.Map<CurrencyToReturnDto>(currency));
        }

        [HttpPut("update-currency/{id}")]
        public async Task<ActionResult<CurrencyToReturnDto>> UpdateCurrency([FromBody] Currency obj)
        {
            var currency = await _currencyService.UpdateCurrencyAsync(obj);

            if (currency == null) return BadRequest(new ApiResponse(400, "Problem updating currency"));

            return Ok(_mapper.Map<CurrencyToReturnDto>(currency));
        }

        [HttpGet("get-currencies-by-api")]
        public async Task<ActionResult> GetCurrenciesByExternalApi()
        {
            var currencies = await _externalCurrencyApiService.GetCurrenciesAsync();

            return Ok(currencies);
        }

        [HttpGet("get-currency-rate/{fromCurrency}/{toCurrency}")]
        public async Task<ActionResult> GetCurrencyRateByExternalApi(string fromCurrency, string toCurrency)
        {
            var currencies = await _externalCurrencyApiService.GetExchangeRateAsync(fromCurrency, toCurrency);

            return Ok(currencies);
        }
        
        
    }
}