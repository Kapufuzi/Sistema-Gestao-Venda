import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SalesHistory } from '../../../../models/sales-history.model';
import { SalesHistoryService } from '../../../../services/sales-history.service';
import { CurrencyPipe, formatDate } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Timestamp } from '@angular/fire/firestore';

@Component({
  selector: 'detail-sales',
  standalone: true,
  imports: [
    CurrencyPipe,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule
  ],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.css'
})
export class DetailComponent implements OnInit{

  displayedColumns: string[] = ['userName', 'price', 'date'];
  dataSource!: MatTableDataSource<SalesHistory>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private historyService: SalesHistoryService) { }

  ngOnInit(): void {
    this.historyService.getSalesHistory().subscribe(history => {

      history.map((res) => {
        if (res.date instanceof Timestamp) {
          const date: Date = res.date.toDate();
          res.date = <any>formatDate(date, 'dd/MM/yyyy', 'en-US');
        }
      })

      this.dataSource = new MatTableDataSource(history);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }


}
