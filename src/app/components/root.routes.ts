import { Routes } from "@angular/router"
import { RootNavComponent } from "./layout/root-nav/root-nav.component";
import { notAuthenticatedGuard } from "../guard/not-authenticated.guard";


export const rootRoutes: Routes = [
  { path: '', component: RootNavComponent, canActivate: [ notAuthenticatedGuard ],
    children: [
      {
        path: '',
        loadComponent: () => import('./../components/layout/dashboard/dashboard.component')
          .then(routes => routes.DashboardComponent)
      },
      {
        path: 'hospital',
        loadChildren: () => import('./../components/layout/hospital/hospital.routes')
          .then(routes => routes.hospitalRoutes)
      },
      {
        path: 'employee',
        loadChildren: () => import('./../components/layout/employee/employee.routes')
          .then(routes => routes.employeeRoutes)
      },
      {
        path: 'product',
        loadChildren: () => import('./../components/layout/categoria/category.routes')
          .then(routes => routes.categoryRoutes)
      },
      {
        path: 'sales',
        loadChildren: () => import('./../components/layout/sales/sales.routes')
          .then(routes => routes.salesRoutes)
      }
    ]
  },

];