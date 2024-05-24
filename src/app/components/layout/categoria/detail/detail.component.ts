import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from '../../../../services/product.service';
import { Product } from '../../../../models/product.models';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { AsyncPipe, CommonModule, CurrencyPipe, formatDate } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { ToastrService } from 'ngx-toastr';
import { Timestamp } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'detail-category',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    CurrencyPipe,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    AsyncPipe
  ],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.css'
})
export class DetailComponent implements OnInit {
  displayedColumns: string[] = ['productName', 'category', 'productCode', 'salePrice', 'quantityInStock', 'expirationDate', 'actions'];
  dataSource!: MatTableDataSource<Product>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
                private productService: ProductService, 
                private toastr: ToastrService,
                private router: Router
              ) {
              }

  ngOnInit(): void {
    this.productService.getProducts().subscribe((products: Product[]) => {

      products.map((res) => {
        if (res.expirationDate instanceof Timestamp) {
          const date: Date = res.expirationDate.toDate();
          res.expirationDate = <any>formatDate(date, 'yyyy/MM/dd', 'en-US');
        }
        if (res.manufacturingDate instanceof Timestamp) {
          const date: Date = res.manufacturingDate.toDate();
          res.manufacturingDate = <any>formatDate(date, 'yyyy/MM/dd', 'en-US');
        }
      })

      this.dataSource = new MatTableDataSource(products);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteProduct(productId: string) {
    this.productService.deleteProduct(productId).then(() => {
          this.toastr.success("Produto eliminado com sucesso!", "", {
            timeOut: 5000,
            progressBar: true,
            progressAnimation: "increasing",
          });
    }).catch((error) => {
      console.error('Error deleting product: ', error);
    });
  }

  editProduct(productId: string) {
    const data = this.dataSource.filteredData
    const findedPosition = data.filter(product => product.id === productId)[0]

    this.router.navigate(["product/details/" + productId], { state: { data: findedPosition } })

    // this.productService.updateProduct(productId, []).then(() => {
    //       this.toastr.success("Produto atualizando com sucesso!", "", {
    //         timeOut: 5000,
    //         progressBar: true,
    //         progressAnimation: "increasing",
    //       });
    // }).catch((error) => {
    //   console.error('Error deleting product: ', error);
    // });
  }

}
