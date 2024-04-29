namespace currencymate_core.Interfaces
{
    public interface IExternalCurrencyApiService
    {
        Task<string> GetCurrenciesAsync();
        Task<string> GetExchangeRateAsync(string sourceCurrency, string targetCurrency);
    }
}