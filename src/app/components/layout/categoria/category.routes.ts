import { Routes } from "@angular/router";
import { CategoriaComponent } from "./categoria.component";
import { DetailComponent } from "./detail/detail.component";

export const categoryRoutes: Routes = [
  { path: '', component: CategoriaComponent },
  { path: 'list', component: DetailComponent },
  {
    path: 'details/:id', loadComponent: () => import('../../../components/layout/categoria/categoria.component').then(routes => routes.CategoriaComponent)
  }
];