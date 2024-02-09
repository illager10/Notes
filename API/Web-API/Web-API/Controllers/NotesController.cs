using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using Web_API.Data;
using Web_API.Models;

namespace Web_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NotesController : Controller
    {
        DateTimeOffset NOTE_DATE = new DateTime(1900, 1, 1, 1, 1, 1);

        private readonly FullStackDbContext _fullStackDbContext;

        public NotesController(FullStackDbContext fullStackDbContext)
        {
            _fullStackDbContext = fullStackDbContext;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllNotes()
        {
            var notes = await _fullStackDbContext.Notes.Where(a => a.Date < NOTE_DATE).Include(
                n => n.NotesTags).OrderByDescending(n => n.DateOfCreation).ToListAsync();

            return Ok(notes);
        }

        [HttpGet("Reminders/")]
        public async Task<IActionResult> GetAllReminders()
        {
            var notes = await _fullStackDbContext.Notes.Where(a => a.Date > NOTE_DATE).Include(
                n => n.NotesTags).OrderByDescending(n => n.Date).ToListAsync();

            return Ok(notes);
        }

        [HttpPost]
        public async Task<IActionResult> AddNotes([FromBody] Notes notesRequest)
        {
            notesRequest.Id = Guid.NewGuid();
            notesRequest.DateOfCreation = DateTime.Now;

            if (notesRequest.NotesTags != null)
            {
                foreach (var NoteTag in notesRequest.NotesTags)
                {
                    NoteTag.NoteId = notesRequest.Id;
                    var tag = _fullStackDbContext.Tags.FirstOrDefault(t => t.Id == NoteTag.TagId);

                    if (tag == null)
                    {
                        return NotFound();
                    }

                    NoteTag.Tag = tag;                    
                }
            }

            await _fullStackDbContext.Notes.AddAsync(notesRequest);
            await _fullStackDbContext.SaveChangesAsync();

            return Ok(notesRequest);
        }

        [HttpGet]
        [Route("{Text}")]
        public async Task<IActionResult> GetNoteOnText([FromRoute] string Text)
        {
            var notes = await _fullStackDbContext.Notes.Where(
                n => n.Title.ToLower().Contains(Text.ToLower())
                || n.Description.ToLower().Contains(Text.ToLower())
                || n.NotesTags.Any(
                        nt => nt.Tag.Title.ToLower().Contains(Text.ToLower())
                            )).ToListAsync();

            if (notes == null)
            {
                return NotFound();
            }

            return Ok(notes);
        }

        [HttpGet]
        [Route("{id:Guid}")]
        public async Task<IActionResult> GetNote([FromRoute] Guid id)
        {
            var note = await _fullStackDbContext.Notes.Include(n => n.NotesTags
                ).FirstOrDefaultAsync(x => x.Id == id);

            if(note == null)
            {
                return NotFound();
            }

            return Ok(note);
        }

        [HttpPut]
        [Route("{id:Guid}")]
        public async Task<IActionResult> UpdateNote([FromRoute] Guid id, Notes updateNoteRequest)
        {
            var note = await _fullStackDbContext.Notes.FindAsync(id);            

            if (note == null)
            {
                return NotFound();
            }

            if (updateNoteRequest.Title != null)
            {
                note.Title = updateNoteRequest.Title;
            }

            var noteTags = await _fullStackDbContext.NotesTags.Where(
                nt => nt.NoteId == note.Id).ToListAsync();

            _fullStackDbContext.NotesTags.RemoveRange(noteTags);


            note.Description = updateNoteRequest.Description;
            note.Date = updateNoteRequest.Date;
            note.NotesTags = updateNoteRequest.NotesTags;

            await _fullStackDbContext.SaveChangesAsync();

            return Ok(note);
        }

        [HttpDelete]
        [Route("{id:Guid}")]
        public async Task<IActionResult> DeleteNote([FromRoute] Guid id)
        {
            var note = await _fullStackDbContext.Notes.FindAsync(id);

            if (note == null)
            {
                return NotFound();
            }

            var noteTags = await _fullStackDbContext.NotesTags.Where(
                nt => nt.NoteId == note.Id).ToListAsync();

            _fullStackDbContext.NotesTags.RemoveRange(noteTags);

            _fullStackDbContext.Notes.Remove(note);
            await _fullStackDbContext.SaveChangesAsync();

            return Ok(note);
        }
    }
}
