import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Product } from '../../../models/product.models';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AsyncPipe, CommonModule, isPlatformBrowser } from '@angular/common';
import { MatOptionModule } from '@angular/material/core';
import { SalesHistory } from '../../../models/sales-history.model';
import { SalesHistoryService } from '../../../services/sales-history.service';
import { MatSelectModule } from '@angular/material/select';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { Observable, Subscription, map, startWith } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { ToastrService } from 'ngx-toastr';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../services/auth/auth.service';
import { UserService } from '../../../services/user/user.service';
import { NgxPrintModule } from 'ngx-print';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    CommonModule,
    MatOptionModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatIconModule,
    MatButtonModule,
    AsyncPipe,
    NgxPrintModule
  ],
  templateUrl: './sales.component.html',
  styleUrl: './sales.component.css'
})
export class SalesComponent implements OnInit{
  products: Product[] = [];
  dataSource!: MatTableDataSource<Product>;
  salesForm!: FormGroup;
  displayedColumns: string[] = ['name', 'quantityInStock', 'actions'];

  myControl = new FormControl<string | Product>('');
  filteredOptions!: Observable<Product[]>;

  $userLogged: any
  private allSubscriptions: Subscription[] = [];
  dataUser: any

  constructor(
    private productService: ProductService,
    private salesHistoryService: SalesHistoryService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private _authService: AuthService,
    @Inject(PLATFORM_ID) private platformId:Object,
    private _userService: UserService,
  ) {}

  qtde = ""
  ngOnInit(): void {
    this.loadProducts();
    this.getUserLogged();

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.productName;
        return name ? this._filter(name as string) : this.products.slice();
      }),
    );

  }

  getUserLogged(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const userLoggedIn$ = this._authService.isUserLoggedIn();
    if (!userLoggedIn$) {
      console.error("Observable returned by isUserLoggedIn() is undefined.");
      return;
    }

    this.$userLogged = userLoggedIn$.pipe(
      map(user => user ? user : null)
    );

    this.allSubscriptions.push(
      this.$userLogged.subscribe((User: any) =>{
        if (!User) return;
        this._userService.getUserById(User.uid).then((observ: any) =>{
          this.dataUser = observ;
        });
      })
    );
  }

  productListOrder: any[] = []
  toOrder: any
  onOptionSelected(event: any){
    this.toOrder = event
  }

  change = 0
  validetSale = false
  moneyGived = 0
  makeChange(event: any){
    const totalGived = event?.target?.value
    this.moneyGived = totalGived

    if (totalGived >= this.totalPrice) {
      this.change = totalGived - this.totalPrice
      this.validetSale = true
    }else{
      this.change = 0
      this.validetSale = false
    }
  }

  totalPrice = 0
  quantity = 1
  addToCart(){

    const selected = {
      id: this.toOrder?.id,
      productName: this.toOrder?.productName,
      productCode: this.toOrder?.productCode,
      quantity: this.quantity,
      salePrice: this.toOrder?.salePrice
    }

    // onTheShelf

    if (this.toOrder && this.toOrder.quantityInStock >= Number(selected?.quantity)) {
      this.productListOrder.push(selected)

      const totals = this.productListOrder.reduce(
        (acc, product) => {
          acc.totalQuantity += product.quantity;
          acc.totalSalePrice += product.quantity * product.salePrice;
          return acc;
        },
        { totalQuantity: 0, totalSalePrice: 0 }
      )

      this.totalPrice = totals.totalSalePrice

      this.dataSource = new MatTableDataSource(this.productListOrder)
      this.quantity = 1
      this.createSalesForm()
    } else {

        this.toastr.error(`Quantidade em estoque insuficiente! ${this.toOrder.quantityInStock}`, "", {
          timeOut: 5000,
          progressBar: true,
          progressAnimation: "increasing",
        });

    }


  }

  deleteProduct(productId: string) {
    this.productListOrder = this.productListOrder.filter(produto => produto.id !== productId);
    this.dataSource = new MatTableDataSource(this.productListOrder)
  }


  displayFn(product: Product): string {
    return product && product.productCode ? product.productCode : '';
  }
selectedProduct: any
    onBarcodeInput(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            const inputElement = event.target as HTMLInputElement;
            const barcode = inputElement.value;
            const foundProduct = this.products.find(product => product.productCode === barcode);
            if (foundProduct) {
                this.myControl.setValue(foundProduct);
                this.selectedProduct = foundProduct;
            } else {
                alert('Produto não encontrado');
            }
            inputElement.value = ''; // Limpa o campo após a leitura do código de barras
        }
    }

  private _filter(name: string): Product[] {
    const filterValue = name.toLowerCase();

    return this.products.filter(option => option.productName.toLowerCase().includes(filterValue));
  }

  createSalesForm() {
    this.salesForm = this.fb.group({
      productId: ['', [Validators.required]],
      quantity: [1, [Validators.required]],
      sellerId: [''],
      valueDelivered: [''],
      changeMoney: ['']
    });
  }
 
  loadProducts() {
    this.productService.getProducts().subscribe((products: Product[]) => {
      this.products = products;
    });
  }

  async onSell() {
  
      this.productListOrder.forEach(res => {
        this.products.map(prod => {
          if (prod.id == res.id) {
            prod.quantityInStock = prod.quantityInStock - res.quantity
            this.productService.updateProduct(`${prod.id}`, prod)
          }
        })
      })

    this.change = 0
    this.validetSale = false

    const sale: SalesHistory = {
      userId: this.dataUser?.id,
      userName: this.dataUser?.name,
      date: new Date(),
      product: this.productListOrder,
      price: this.totalPrice
    };
    
    await this.salesHistoryService.addSale(sale).then(() => {
      this.productListOrder = []
      this.dataSource = new MatTableDataSource(this.productListOrder)

        this.toastr.success("Venda efectuada com sucesso!", "", {
          timeOut: 5000,
          progressBar: true,
          progressAnimation: "increasing",
        });

    });

  }

}
