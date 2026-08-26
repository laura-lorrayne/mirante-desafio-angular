import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'outros-creditos-debitos',
    pathMatch: 'full',
  },
  {
    path: 'outros-creditos-debitos',
    loadComponent: () =>
      import('./features/outros-creditos-debitos/pages/consulta-lotes/consulta-lotes').then(
        (m) => m.ConsultaLotes,
      ),
  },
  {
    path: '**',
    redirectTo: 'outros-creditos-debitos',
  },
];
