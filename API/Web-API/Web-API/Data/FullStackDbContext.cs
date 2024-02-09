using Microsoft.EntityFrameworkCore;
using Web_API.Models;

namespace Web_API.Data
{
    public class FullStackDbContext : DbContext
    {
        public FullStackDbContext(DbContextOptions options) : base(options) {}
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<NoteTag>().HasKey(nt => new
            {
                nt.NoteId,
                nt.TagId
            });

            modelBuilder.Entity<NoteTag>().HasOne(t => t.Tag).WithMany(nt => nt.NotesTags)
                .HasForeignKey(t => t.TagId);
            modelBuilder.Entity<NoteTag>().HasOne(n => n.Note).WithMany(nt => nt.NotesTags)
                .HasForeignKey(n => n.NoteId);
        }
        public DbSet<Notes> Notes { get; set; }
        public DbSet<Tags> Tags { get; set; }
        public DbSet<NoteTag> NotesTags { get; set; }
    }
}
