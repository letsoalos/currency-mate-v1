
using currencymate_api.Errors;
using currencymate_core.Interfaces;
using currencymate_infrastructure.Data;
using currencymate_infrastructure.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace currencymate_api.Extensions
{
    public static class ApplicationServicesExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config)
        {
           string apiKey = config["ApiKey:ExternalApi"];


            services.AddDbContext<DataContext>(x =>
            {
                x.UseSqlite(config.GetConnectionString("DefaultConnection"));
            });

            services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen();

            services.AddScoped<ICurrencyService, CurrencyService>();
            //services.AddScoped<IExternalCurrencyApiService, ExternalCurrencyApiService>();
            services.AddSingleton<IExternalCurrencyApiService>(new ExternalCurrencyApiService(apiKey));


            services.Configure<ApiBehaviorOptions>(options =>
            {
                options.InvalidModelStateResponseFactory = actionContext =>
                {
                    var errors = actionContext.ModelState
                        .Where(e => e.Value.Errors.Count > 0)
                        .SelectMany(x => x.Value.Errors)
                        .Select(x => x.ErrorMessage).ToArray();
        
                    var errorResponse = new ApiValidationErrorReposnse
                    {
                        Errors = errors
                    };

                    return new BadRequestObjectResult(errorResponse);
                };
            });           


            return services;
        }
    }
}