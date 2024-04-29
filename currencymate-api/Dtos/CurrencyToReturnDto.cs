namespace currencymate_api.Dtos
{
    public class CurrencyToReturnDto
    {
        public int Id { get; set; }
        public string Name { get; set; } 
        public string Code { get; set; }  
        public decimal ExchangeRateToZAR { get; set; }
    }
}