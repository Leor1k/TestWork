using Microsoft.EntityFrameworkCore;
using WebApi.DbContent.Models;

namespace WebApi.DbContent
{
    public class MainDbContext : DbContext
    {
        public MainDbContext(DbContextOptions<MainDbContext> options) : base(options) { }

        public DbSet<Employer> Employees { get; set; }
    }
}
