using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace WebApi.DbContent.Models
{
    public class Employer
    {
        [Key]
        [Column("IdEmployer")]
        public int Id { get; set; }
        [Column("Department")]
        public string Department { get; set; }
        [Column("Surname")]
        public string Surname { get; set; }
        [Column("Name")]
        public string Name { get; set; }
        [Column("Patronymic")]
        public string Patronymic { get; set; }
        [Column("BirthDate")]
        public DateTime BirthDate { get; set; }
        [Column("DateEmployment")]
        public DateTime DateEmployment { get; set; }
        [Column("Salary")]
        public decimal Salary { get; set; }
        public void ShowEmployesInConsole(string about)
        {
            Console.WriteLine($"-------------------------about:{about}-------------------------");
            Console.WriteLine($"ID: {Id}\nОтдел: {Department}\nФамилия {Surname}\nИмя: {Name}\nОтчество: {Patronymic}\nДата рождения: {BirthDate}\n Начал работать с {DateEmployment}");
            Console.WriteLine($"-------------------------End-------------------------");
        }
    }
}
