import { Routes } from '@angular/router';
import { alreadyAuthenticatedGuard } from './guard/already-authenticated.guard';

export const routes: Routes = [
  {
    path:'login', canActivate: [alreadyAuthenticatedGuard],
    loadComponent: () => import('./components/auth/login/login.component').then(c => c.LoginComponent)
  },
  {
    path: '',
    loadChildren: () => import('./components/root.routes')
      .then(routes => routes.rootRoutes)
  }
];
