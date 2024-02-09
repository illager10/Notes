using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Web_API.Data;
using Web_API.Models;

namespace Web_API.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
    public class TagsController : Controller
    {
        private readonly FullStackDbContext _fullStackDbContext;

        public TagsController(FullStackDbContext fullStackDbContext)
        {
            _fullStackDbContext = fullStackDbContext;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllTags()
        {
            var tags = await _fullStackDbContext.Tags.Include(
                t => t.NotesTags).OrderBy(t=> t.Title).ToListAsync();

            return Ok(tags);
        }

        [HttpPost]
        public async Task<IActionResult> AddTags([FromBody] Tags tagsRequest)
        {
            tagsRequest.Id = Guid.NewGuid();

            await _fullStackDbContext.Tags.AddAsync(tagsRequest);
            await _fullStackDbContext.SaveChangesAsync();

            return Ok(tagsRequest);
        }

        [HttpGet]
        [Route("{Text}")]
        public async Task<IActionResult> GetTagOnText([FromRoute] string Text)
        {
            var tags = await _fullStackDbContext.Tags.
                Where(x => x.Title.ToLower().
                    Contains(Text.ToLower())).ToListAsync();

            if (tags == null)
            {
                return NotFound();
            }

            return Ok(tags);
        }


        [HttpGet]
        [Route("{id:Guid}")]
        public async Task<IActionResult> GetTag([FromRoute] Guid id)
        {
            var tag = await _fullStackDbContext.Tags.FirstOrDefaultAsync(t => t.Id == id);

            if (tag == null)
            {
            return NotFound();
            }

            return Ok(tag);
        }

        [HttpPut]
        [Route("{id:Guid}")]
        public async Task<IActionResult> UpdateTag([FromRoute] Guid id, Tags updateTagRequest)
        {
            var tag = await _fullStackDbContext.Tags.FindAsync(id);

            if (tag == null)
            {
            return NotFound();
            }

            tag.Title = updateTagRequest.Title;
            tag.Color = updateTagRequest.Color;
            tag.NotesTags = updateTagRequest.NotesTags;

        await _fullStackDbContext.SaveChangesAsync();

            return Ok(tag);
        }

        [HttpDelete]
        [Route("{id:Guid}")]
        public async Task<IActionResult> DeleteTag([FromRoute] Guid id)
        {
            var tag = await _fullStackDbContext.Tags.FindAsync(id);

            if (tag == null)
            {
            return NotFound();
            }

            _fullStackDbContext.Tags.Remove(tag);
            await _fullStackDbContext.SaveChangesAsync();

            return Ok(tag);
        }
    }
}
