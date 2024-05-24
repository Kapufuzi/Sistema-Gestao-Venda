import { Routes } from "@angular/router";
import { SalesComponent } from "./sales.component";
import { DetailComponent } from "./detail/detail.component";

export const salesRoutes: Routes = [
  { path: '', component: SalesComponent },
  { path: 'list', component: DetailComponent }
];