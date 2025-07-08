SELECT 
    IdEmployer AS 'ID',
    Department AS 'Отдел',
    Surname AS 'Фамилия',
    Name AS 'Имя',
    Patronymic AS 'Отчество',
    BirthDate AS 'Дата рождения',
    DateEmployment AS 'Дата приема',
    Salary AS 'Зарплата'
FROM 
    [dbo].[Employees]
ORDER BY 
    Surname, Name;