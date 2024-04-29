namespace currencymate_core.Entities
{
    public class Currency : BaseEntity
    {
        public string Name { get; set; } 
        public string Code { get; set; }  
        public decimal ExchangeRateToZAR { get; set; }         
    }
}