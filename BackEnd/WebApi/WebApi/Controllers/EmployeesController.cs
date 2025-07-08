using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApi.DbContent;
using WebApi.DbContent.Models;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmployersController : ControllerBase
    {
        private readonly MainDbContext _context;

        public EmployersController(MainDbContext context)
        {
            _context = context;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Employer>>> GetEmployers()
        {
            return await _context.Employees.ToListAsync();
        }
        [HttpPost]
        public async Task<ActionResult<Employer>> CreateEmployer(Employer Employer)
        {
            Employer.ShowEmployesInConsole("Метод Create");
            _context.Employees.Add(Employer);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetEmployerById), new { id = Employer.Id }, Employer);
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<Employer>> GetEmployerById(int id)
        {
            var Employer = await _context.Employees.FindAsync(id);

            if (Employer == null)
                return NotFound();

            return Employer;
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEmployer(int id, [FromBody] Employer employer)
        {
            if (id != employer.Id || id == 0)
                return BadRequest();

            var existingEmployer = await _context.Employees.FindAsync(id);
            if (existingEmployer == null)
                return NotFound();

            existingEmployer.Department = employer.Department;
            existingEmployer.Surname = employer.Surname;
            existingEmployer.Name = employer.Name;
            existingEmployer.Patronymic = employer.Patronymic;
            existingEmployer.BirthDate = employer.BirthDate;
            existingEmployer.DateEmployment = employer.DateEmployment;
            existingEmployer.Salary = employer.Salary;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                return StatusCode(500, "Ошибка обновления данных");
            }

            return Ok("Данные успешно обновлены.");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEmployer(int id)
        {
            var Employer = await _context.Employees.FindAsync(id);
            if (Employer == null)
                return NotFound();

            _context.Employees.Remove(Employer);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
