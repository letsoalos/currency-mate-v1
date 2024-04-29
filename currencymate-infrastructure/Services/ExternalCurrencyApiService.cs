using currencymate_core.Interfaces;
using RestSharp;

namespace currencymate_infrastructure.Services
{
    public class ExternalCurrencyApiService : IExternalCurrencyApiService
    {
        private readonly string _apiKey;

        public ExternalCurrencyApiService(string apiKey)
        {
            _apiKey = apiKey;
        }

        public async Task<string> GetCurrenciesAsync()
        {
            try
            {
                var responseContent = await GetLatestCurrenciesAsync();

                return responseContent;
            }
            catch (Exception ex)
            {
                // Log or handle the exception
                Console.WriteLine($"Error fetching currencies from the external API: {ex.Message}");
                throw; // Rethrow the exception
            }
        }

        public async Task<string> GetExchangeRateAsync(string sourceCurrency, string targetCurrency)
        {
            try
            {
                var responseContent = await GetExchangeRateFromApiAsync(sourceCurrency, targetCurrency);

                return responseContent;
            }
            catch (Exception ex)
            {
                // Log or handle the exception
                Console.WriteLine($"Error fetching exchange rate from the external API: {ex.Message}");
                throw; // Rethrow the exception
            }
        }

        private async Task<string> GetLatestCurrenciesAsync()
        {
            var client = new RestClient($"https://v6.exchangerate-api.com/v6/{_apiKey}/latest/ZAR");
            client.Timeout = -1;
            var request = new RestRequest(Method.GET);
            request.AddHeader("apikey", _apiKey);

            var response = await client.ExecuteAsync(request);
            if (!response.IsSuccessful)
            {
                throw new Exception($"Failed to fetch currencies. HTTP status code: {response.StatusCode}");
            }

            return response.Content;
        }

        private async Task<string> GetExchangeRateFromApiAsync(string sourceCurrency, string targetCurrency)
        {
            var client = new RestClient($"https://v6.exchangerate-api.com/v6/{_apiKey}/pair/{sourceCurrency}/{targetCurrency}");
            client.Timeout = -1;
            var request = new RestRequest(Method.GET);

            var response = await client.ExecuteAsync(request);
            if (!response.IsSuccessful)
            {
                throw new Exception($"Failed to fetch exchange rate. HTTP status code: {response.StatusCode}");
            }

            return response.Content;
        }
    }
}






/*using currencymate_core.Interfaces;
using Newtonsoft.Json;
using RestSharp;

namespace currencymate_infrastructure.Services
{
    public class ExternalCurrencyApiService : IExternalCurrencyApiService
    {
        public async Task<string> GetCurrenciesAsync()
        {
            try
            {
                var responseContent = await GetLatestCurrenciesAsync();
                //var responseObject = JsonConvert.DeserializeObject(responseContent);


                return responseContent;
            }
            catch (Exception ex)
            {
                // Log or handle the exception
                Console.WriteLine($"Error fetching currencies from the external API: {ex.Message}");
                throw; // Rethrow the exception
            }
        }

        private async Task<string> GetLatestCurrenciesAsync()
        {
            var client = new RestClient("https://api.currencyapi.com/v3/latest?base_currency=ZAR");
            client.Timeout = -1;
            var request = new RestRequest(Method.GET);
            request.AddHeader("apikey", "cur_live_QzPWkpoM75P3ZlcT7vy4AoUCGigfnKsSVh3qTfIv");

            var response = await client.ExecuteAsync(request);
            if (!response.IsSuccessful)
            {
                throw new Exception($"Failed to fetch currencies. HTTP status code: {response.StatusCode}");
            }

            return response.Content;
        }

        
        public Task<string> GetExchangeRateAsync(string sourceCurrency, string targetCurrency)
        {
            throw new NotImplementedException();
        }
    }
}*/
