import { Routes } from '@angular/router';

export const routes: Routes = [
  { 
    path: '',
    loadComponent: () => import('./home/home').then(m => m.Home)
  },
  {
    path: 'employees',
    title: 'Сотрудники',
    loadComponent: () => import('./employees/employees').then(m => m.Employees)
  }
];
