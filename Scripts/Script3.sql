BEGIN TRANSACTION;
SELECT 
    IdEmployer,
    Surname + ' ' + Name AS 'ФИО',
    DATEDIFF(YEAR, BirthDate, GETDATE()) AS 'Возраст'
FROM 
    [dbo].[Employees]
WHERE 
    DATEDIFF(YEAR, BirthDate, GETDATE()) > 70;
DELETE FROM 
    [dbo].[Employees]
WHERE 
    DATEDIFF(YEAR, BirthDate, GETDATE()) > 70;
COMMIT;