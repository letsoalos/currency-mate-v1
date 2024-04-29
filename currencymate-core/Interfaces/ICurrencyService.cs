using currencymate_core.Entities;

namespace currencymate_core.Interfaces
{
    public interface ICurrencyService
    {
        Task<Currency> CreateCurrencyAsync(Currency currency);
        Task<IReadOnlyList<Currency>> GetCurrenciesAsync();
        Task<Currency> UpdateCurrencyAsync(Currency currency);
        Task<Currency> GetCurrencyByIdAsync(int Id);
        Task<Currency> DeleteCurrencyAsync(int Id);
        
    }
}