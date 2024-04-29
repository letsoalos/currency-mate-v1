using currencymate_core.Entities;
using currencymate_core.Interfaces;
using currencymate_infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace currencymate_infrastructure.Services
{
    public class CurrencyService : ICurrencyService
    {
        private readonly DataContext _context;
        public CurrencyService(DataContext context)
        {
            _context = context;
        }

        
        public async Task<IReadOnlyList<Currency>> GetCurrenciesAsync()
        {
            var currencyList = await _context.Currencies.AsNoTracking().ToListAsync();

            return currencyList;
        }

        public async Task<Currency> GetCurrencyByIdAsync(int Id)
        {
            return await _context.Currencies.FirstOrDefaultAsync(c => c.Id == Id);
        }

        public async Task<Currency> CreateCurrencyAsync(Currency currency)
        {
            // Check if a currency with the same code already exists
            var existingCurrency = await _context.Currencies.FirstOrDefaultAsync(x => x.Code == currency.Code);

            if (existingCurrency != null)
            {
                // Currency with the same code already exists, handle the error
                throw new InvalidOperationException("Currency with the same code already exists");
            }

            // Add the new currency to the context and save changes
            _context.Currencies.Add(currency);
            await _context.SaveChangesAsync();

            // Return the newly created currency
            return currency;

        }         

        public async Task<Currency> UpdateCurrencyAsync(Currency currency)
        {
            if (currency == null) return null;

            // Retrieve the existing currency from the database
            var existingCurrency = await _context.Currencies.FirstOrDefaultAsync(x => x.Id == currency.Id);

            if (existingCurrency == null) return null;

            // Update the properties of the existing currency with the values from the updated currency
            existingCurrency.Name = currency.Name;
            existingCurrency.Code = currency.Code;
            existingCurrency.ExchangeRateToZAR = currency.ExchangeRateToZAR;

            // Save changes to the database
            await _context.SaveChangesAsync();

            return existingCurrency;
        }

        public Task<Currency> DeleteCurrencyAsync(int Id)
        {
            throw new NotImplementedException();
        }
    }
}