using currencymate_core.Entities;
using Microsoft.EntityFrameworkCore;

namespace currencymate_infrastructure.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {
        }

        public DbSet<Currency> Currencies { get; set; }
    }
}