import { Component, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';
import { SalesHistoryService } from '../../../services/sales-history.service';
import { CommonModule } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MatListModule } from '@angular/material/list';
import {MatCardModule} from '@angular/material/card';
import {MatToolbarModule} from '@angular/material/toolbar';

interface Product {
  id: string;
  productName: string;
  productCode: string;
  quantity: number;
  salePrice: number;
}


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    NgxChartsModule,
    MatListModule,
    MatCardModule,
    MatToolbarModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  vendasDiarias$?: Observable<Product[]>;
  vendasMensais$?: Observable<Product[]>;
  totalMensal$?: Observable<number>;
  dailySalesChartData$?: Observable<any[]>;
  monthlySalesChartData$?: Observable<any[]>;

  constructor(private vendasService: SalesHistoryService) {}

  ngOnInit() {
    this.vendasDiarias$ = this.vendasService.getVendasDiarias();
    this.vendasMensais$ = this.vendasService.getVendasMensais();
    this.totalMensal$ = this.vendasService.getTotalMensal();

    this.dailySalesChartData$ = this.vendasDiarias$.pipe(
      map(vendas => vendas.map(venda => ({ name: venda.productName, value: venda.quantity })))
    );

    this.monthlySalesChartData$ = this.vendasMensais$.pipe(
      map(vendas => vendas.map(venda => ({ name: venda.productName, value: venda.quantity })))
    );
  }
}
