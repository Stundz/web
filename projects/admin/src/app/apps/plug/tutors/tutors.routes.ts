import type { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'tutors',
    title: 'Tutors | Plug | Stundz Admin',
    loadComponent: () => import('./index/index.page').then((m) => m.IndexPage),
  },
  {
    path: 'tutor/:tutor',
    title: 'Tutor | Plug | Stundz Admin',
    loadComponent: () => import('./show/show.page').then((m) => m.ShowPage),
  },
];
