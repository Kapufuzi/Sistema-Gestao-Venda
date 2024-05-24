import { Routes } from "@angular/router";
import { HospitalComponent } from "./hospital.component";

export const hospitalRoutes: Routes = [
  { path: '', component: HospitalComponent },
//   {path:'list', loadComponent: () => import('./list/list.component').then(m => m.ListComponent)}
];