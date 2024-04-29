namespace currencymate_api.Errors
{
    public class ApiValidationErrorReposnse : ApiResponse
    {
        public ApiValidationErrorReposnse() : base(400)
        {            
        }

        public IEnumerable<string> Errors { get; set; }
    }
}