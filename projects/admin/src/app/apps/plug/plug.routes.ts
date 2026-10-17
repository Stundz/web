import type { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    title: 'Plug | Stundz Admin',
    loadComponent: () => import('./plug.page').then((m) => m.PlugPage),
  },
  {
    path: '',
    loadChildren: () => import('./past-questions/past-questions.routes').then((m) => m.routes),
  },
  {
    path: '',
    loadChildren: () => import('./tutors/tutors.routes').then((m) => m.routes),
  },
  {
    path: '',
    loadChildren: () => import('./tutorials/tutorials.routes').then((m) => m.routes),
  },
];
