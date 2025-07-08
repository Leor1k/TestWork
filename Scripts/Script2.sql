SELECT 
    IdEmployer AS 'ID',
    Department AS 'Отдел',
    Surname + ' ' + Name + ISNULL(' ' + Patronymic, '') AS 'ФИО',
    FORMAT(BirthDate, 'dd.MM.yyyy') AS 'Дата рождения',
    DATEDIFF(YEAR, DateEmployment, GETDATE()) AS 'Стаж (лет)',
    FORMAT(Salary, 'N2') + ' ₽' AS 'Зарплата'
FROM 
    [dbo].[Employees]
WHERE 
    Salary > 10000
ORDER BY 
    Salary DESC;