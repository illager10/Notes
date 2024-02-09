using System.Diagnostics.CodeAnalysis;

namespace Web_API.Models
{
    public class Tags
    {
        public Guid Id { get; set; }

        [NotNull]
        public string Title { get; set; }
        public string Color { get; set; }
        public List<NoteTag> NotesTags { get; set; }
    }
}
