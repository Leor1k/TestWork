import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgIf, NgFor, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Employee } from '../models/employee';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [NgIf, NgFor, CurrencyPipe, DatePipe, FormsModule],
  templateUrl: './employees.html',
  styleUrl: './employees.css'
})
export class Employees {
  private http = inject(HttpClient);

  employees: Employee[] = [];
  showForm = false;
  showChangeForm = false;
  validationError = '';
  confirmationMessage = '';
  errorMessage = '';
  showDeleteModal = false;
  employeeToDelete: Employee | null = null;

 newEmployee: Employee = {
  id: 0,
  department: '',
  surname: '',
  name: '',
  patronymic: '',
  birthDate: '',
  dateEmployment: '',
  salary: 0
};


  constructor() {
    this.loadEmployees();
  }

  openDeleteModal(employee: Employee) {
  this.employeeToDelete = employee;
  this.showDeleteModal = true;
}
confirmDelete() {
  if (this.employeeToDelete) {
    this.http.delete(`https://localhost:7081/api/employers/${this.employeeToDelete.id}`)
      .subscribe({
        next: () => {
          this.confirmationMessage = 'Сотрудник успешно удалён';
          this.loadEmployees();
          this.closeDeleteModal();
        },
        error: err => {
          this.errorMessage = 'Ошибка при удалении: ' + err.message;
          this.closeDeleteModal();
        }
      });
  }
}

closeDeleteModal() {
  this.showDeleteModal = false;
  this.employeeToDelete = null;
}
  loadEmployees() {
    this.http.get<Employee[]>('https://localhost:7081/api/employers')
      .subscribe({
        next: data => this.employees = data,
        error: err => console.error('Ошибка загрузки сотрудников:', err)
      });
  }

  toggleForm() {
    this.showForm = true;
    this.validationError = '';
  }

  toggleChangeForm(employee: Employee) {
    this.newEmployee = {
      id: employee.id,
      department: employee.department,
      surname: employee.surname,
      name: employee.name,
      patronymic: employee.patronymic,
      birthDate: this.formatDate(new Date(employee.birthDate)),
      dateEmployment: this.formatDate(new Date(employee.dateEmployment)),
      salary: employee.salary
    };
    this.showChangeForm = true;
    this.validationError = '';
    this.confirmationMessage = '';
    this.errorMessage = '';
    console.log(`Id:${this.newEmployee.id}`)
  }

  cancelForm() {
    this.showForm = false;
    this.resetForm();
  }

  cancelChangeForm() {
    this.showChangeForm = false;
    this.resetForm();
  }

  resetForm() {
    this.newEmployee = {
      department: '',
      surname: '',
      name: '',
      patronymic: '',
      birthDate: '',
      dateEmployment: '',
      salary: 0
    };
    this.validationError = '';
  }

  formatDate(date: Date): string {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  getAge(date: Date): number {
    const now = new Date();
    let age = now.getFullYear() - date.getFullYear();
    const m = now.getMonth() - date.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < date.getDate())) {
      age--;
    }
    return age;
  }

  validateEmployee(): string | null {
    const { birthDate, dateEmployment, surname, name, patronymic } = this.newEmployee;

    if (!birthDate || !dateEmployment) return 'Введите даты';
    const birth = new Date(birthDate);
    const employment = new Date(dateEmployment);
    const age = this.getAge(birth);

    if (age > 70) return 'Сотруднику более 70 лет';
    if (employment < new Date(birth.setFullYear(birth.getFullYear() + 18)))
      return 'Сотрудник не может быть устроен раньше 18 лет';
    if (employment > new Date())
      return 'Некорректная дата начала работы';

    const exists = this.employees.some(e =>
      e.surname.trim().toLowerCase() === surname?.trim().toLowerCase() &&
      e.name.trim().toLowerCase() === name?.trim().toLowerCase() &&
      e.patronymic?.trim().toLowerCase() === patronymic?.trim().toLowerCase() &&
      e.id !== this.newEmployee.id
    );
    if (exists) return 'Сотрудник с таким ФИО уже существует';

    return null;
  }

  submitForm(form: NgForm) {
    if (form.invalid) {
      this.validationError = 'Пожалуйста, заполните все обязательные поля';
      return;
    }

    const validation = this.validateEmployee();
    if (validation) {
      this.validationError = validation;
      return;
    }

    this.http.post<Employee>('https://localhost:7081/api/employers', this.newEmployee, )
      .subscribe({
        next: (created) => {
          this.employees.unshift(created);
          this.confirmationMessage = 'Сотрудник успешно добавлен';
          this.cancelForm();
        },
        error: err => {
          this.errorMessage = 'Ошибка при добавлении сотрудника: ' + err.message;
        }
      });
  }
  updateEmployee() {
    if (!this.newEmployee.id) {
      this.errorMessage = 'ID сотрудника не указан';
      return;
    }

    const validation = this.validateEmployee();
    if (validation) {
      this.validationError = validation;
      return;
    }

    this.http.put(`https://localhost:7081/api/employers/${this.newEmployee.id}`, this.newEmployee, {
      responseType: 'text'
    })
    .subscribe({
    next: (message: string) => {
      this.confirmationMessage = message;
      this.loadEmployees();
      this.showChangeForm = false;
  },
  error: (err) => {
    this.errorMessage = 'Ошибка при обновлении: ' + err.message;
  }
  });
  }
  filter = {
  department: '',
  surname: '',
  name: '',
  patronymic: '',
  birthDate: '',
  dateEmployment: '',
   salary: ''
};

sortColumn: keyof Employee | '' = '';
sortDirection: 'asc' | 'desc' = 'asc';

get filteredEmployees(): Employee[] {
  let result = this.employees.filter(emp =>
    (this.filter.department === '' || emp.department.toLowerCase().includes(this.filter.department.toLowerCase())) &&
    (this.filter.surname === '' || emp.surname.toLowerCase().includes(this.filter.surname.toLowerCase())) &&
    (this.filter.name === '' || emp.name.toLowerCase().includes(this.filter.name.toLowerCase())) &&
    (this.filter.patronymic === '' || (emp.patronymic || '').toLowerCase().includes(this.filter.patronymic.toLowerCase())) &&
    (this.filter.birthDate === '' || emp.birthDate.startsWith(this.filter.birthDate)) &&
    (this.filter.dateEmployment === '' || emp.dateEmployment.startsWith(this.filter.dateEmployment)) &&
    (this.filter.salary === '' || emp.salary.toString().includes(this.filter.salary))
  );

  if (this.sortColumn) {
    result = result.sort((a, b) => {
      const valA = a[this.sortColumn as keyof Employee];
      const valB = b[this.sortColumn as keyof Employee];
      return String(valA).localeCompare(String(valB)) * (this.sortDirection === 'asc' ? 1 : -1);
    });
  }

  return result;
}

sortBy(column: keyof Employee) {
  if (this.sortColumn === column) {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
  } else {
    this.sortColumn = column;
    this.sortDirection = 'asc';
  }
}
}
