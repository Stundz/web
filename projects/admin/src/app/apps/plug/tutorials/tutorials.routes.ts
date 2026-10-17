import type { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'tutorials',
    title: 'Tutorials | Plug | Stundz Admin',
    loadComponent: () => import('./index/index.page').then((m) => m.IndexPage),
  },
  {
    path: 'tutorial/:tutorial',
    title: 'Tutorial | Plug | Stundz Admin',
    loadComponent: () => import('./show/show.page').then((m) => m.ShowPage),
  },
];
