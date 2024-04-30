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
            var currencyList = await _context.Currencies
                .Where(c => c.Active)
                .AsNoTracking()
                .ToListAsync();

            return currencyList;
        }
        public async Task<Currency> GetCurrencyByIdAsync(int Id)
        {
            return await _context.Currencies.FirstOrDefaultAsync(c => c.Id == Id);
        }
        public async Task<Currency> CreateCurrencyAsync(Currency currency)
        {
            // Check if a currency with the same code already exists
            var existingCurrency = await _context.Currencies.FirstOrDefaultAsync(x => x.Id == currency.Id);

            if (existingCurrency != null)
            {
                // Currency with the same code already exists, handle the error
                throw new InvalidOperationException("Currency with the same code already exists");
            }

            // Add the new currency to the context and save changes
            var data = new Currency() 
            { 
                Code = currency.Code,
                Name = currency.Name,
                ExchangeRateToZAR = currency.ExchangeRateToZAR,
                DateAdded = DateTime.Now,
                Active = true
            };


            _context.Currencies.Add(data);
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
            existingCurrency.DateUpdated = DateTime.Now;

            // Save changes to the database
            _context.Currencies.Update(existingCurrency);
            await _context.SaveChangesAsync();

            return existingCurrency;
        }
        public async Task<Currency> DeleteCurrencyAsync(int id)
        {
            if (id == 0) return null;

            // Retrieve the existing currency from the database
            var existingCurrency = await _context.Currencies.FirstOrDefaultAsync(x => x.Id == id);

            if (existingCurrency == null) return null;

            // Update the properties of the existing currency with the values from the updated currency
            existingCurrency.Active = false;
            existingCurrency.DateUpdated = DateTime.Now;
            

            // Save changes to the database
            _context.Currencies.Update(existingCurrency);
            await _context.SaveChangesAsync();

            return existingCurrency;
        }
    }
}