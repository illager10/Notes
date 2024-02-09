
namespace Web_API.Models
{
    public class NoteTag
    {
        public Guid NoteId { get; set; }
        public Notes Note { get; set; }
        public Guid TagId { get; set; }
        public Tags Tag { get; set; }

    }
}
