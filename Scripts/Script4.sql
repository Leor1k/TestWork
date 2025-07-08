BEGIN TRANSACTION;
SELECT 
    COUNT(*) AS 'Количество сотрудников для повышения'
FROM 
    [dbo].[Employees]
WHERE 
    Salary < 15000;
SELECT TOP 5
    IdEmployer,
    Surname + ' ' + Name AS 'ФИО',
    Salary AS 'Текущая зарплата',
    15000 AS 'Новая зарплата'
FROM 
    [dbo].[Employees]
WHERE 
    Salary < 15000;

UPDATE 
    [dbo].[Employees]
SET 
    Salary = 15000
WHERE 
    Salary < 15000;

COMMIT 
