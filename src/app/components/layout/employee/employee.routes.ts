import { Routes } from "@angular/router";
import { EmployeeComponent } from "./employee.component";
import { DetailComponent } from "./detail/detail.component";

export const employeeRoutes: Routes = [
  { path: '', component: EmployeeComponent },
  { path: 'list', component: DetailComponent },
];