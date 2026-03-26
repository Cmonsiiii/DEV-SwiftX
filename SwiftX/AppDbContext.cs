using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using SwiftX.Models;
namespace SwiftX
{
    
    public class AppDbContext : DbContext
    {
        public DbSet<UserModel> Users { get; set; }

        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }
    }
}
