import type { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'past-questions',
    children: [
      {
        path: '',
        title: 'Past questions | Plug | Stundz Admin',
        loadComponent: () => import('./index/index.page').then((m) => m.IndexPage),
      },
      {
        path: 'upload',
        title: 'Upload past question | Plug | Stundz Admin',
        loadComponent: () => import('./upload/upload.page').then((m) => m.UploadPage),
      },
    ],
  },
  {
    path: 'past-question/:past-question',
    title: 'Past question | Plug | Stundz Admin',
    loadComponent: () => import('./show/show.page').then((m) => m.ShowPage),
  },
];
