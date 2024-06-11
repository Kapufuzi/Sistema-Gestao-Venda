import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { SelectItemGroup } from 'primeng/api';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/product.models';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-categoria',
  standalone: true,
  imports: [
    FormsModule,
    DropdownModule,
    ReactiveFormsModule,
  ],
  templateUrl: './categoria.component.html',
  styleUrl: './categoria.component.css'
})
export class CategoriaComponent implements OnInit{
  selectedCat: string | undefined;
  productForm!: FormGroup;
  paramsID: any;
  receivedData: any;

  categoriasDeProdutos: SelectItemGroup[] = [
    {
      "label": "Alimentos e Bebidas",
      "value": "AB",
      "items": [
        {"label": "Frutas", "value": "Frutas"},
        {"label": "Legumes","value": "Legumes"},
        {"label": "Verduras","value": "Verduras"},
        {"label": "Carnes","value": "Carnes"},
        {"label": "Peixes","value": "Peixes"},
        {"label": "Aves","value": "Aves"},
        {"label": "Vegetais","value": "Vegetais"},
        {"label": "Carnes","value": "Carnes"},
        {"label": "Refeições Prontas Congeladas","value": "Refeições Prontas Congeladas"},
        {"label": "Sorvetes","value": "Sorvetes"},
        {"label": "Pães","value": "Pães"},
        {"label": "Bolos","value": "Bolos"},
        {"label": "Biscoitos","value": "Biscoitos"},
        {"label": "Doces","value": "Doces"},
        {"label": "Águas","value": "Águas"},
        {"label": "Refrigerantes","value": "Refrigerantes"},
        {"label": "Sucos","value": "Sucos"},
        {"label": "Bebidas Alcoólicas","value": "Bebidas Alcoólicas"},
        {"label": "Café","value": "Café"},
        {"label": "Chá","value": "Chá"},
        {"label": "Leite","value": "Leite"},
        {"label": "Queijos","value": "Queijos"},
        {"label": "Iogurtes","value": "Iogurtes"},
        {"label": "Manteiga","value": "Manteiga"},
        {"label": "Margarina","value": "Margarina"},
        {"label": "Arroz","value": "Arroz"},
        {"label": "Feijão","value": "Feijão"},
        {"label": "Massas","value": "Massas"},
        {"label": "Farinha","value": "Farinha"},
        {"label": "Cereais","value": "Cereais"},
        {"label": "Conservas","value": "Conservas"},
        {"label": "Enlatados","value": "Enlatados"},
        {"label": "Molhos","value": "Molhos"},
        {"label": "Chocolates","value": "Chocolates"},
        {"label": "Salgadinhos","value": "Salgadinhos"},
        {"label": "Biscoitos","value": "Biscoitos"}
      ]
    },
    {
      "label": "Produtos de Higiene e Beleza",
      "value": "PHB",
      "items": [
        {"label": "Sabonetes","value": "Sabonetes"},
        {"label": "Shampoos","value": "Shampoos"},
        {"label": "Condicionadores","value": "Condicionadores"},
        {"label": "Cremes Hidratantes","value": "Cremes Hidratantes"},
        {"label": "Desodorantes","value": "Desodorantes"},
        {"label": "Cremes Dentais","value": "Cremes Dentais"},
        {"label": "Escovas de Dente","value": "Escovas de Dente"},
        {"label": "Enxaguantes Bucais","value": "Enxaguantes Bucais"},
        {"label": "Maquiagens","value": "Maquiagens"},
        {"label": "Perfumes","value": "Perfumes"},
        {"label": "Cremes de Tratamento","value": "Cremes de Tratamento"},
        {"label": "Produtos de Cuidados com a Pele","value": "Produtos de Cuidados com a Pele"},
        {"label": "Absorventes","value": "Absorventes"},
        {"label": "Produtos de Higiene Íntima","value": "Produtos de Higiene Íntima"}
      ]
    },
    {
      "label": "Limpeza e Utilidades Domésticas",
      "value": "LUD",
      "items":[
        {"label": "Detergentes","value": "Detergentes"},
        {"label": "Desinfetantes","value": "Desinfetantes"},
        {"label": "Sabão em Pó","value": "Sabão em Pó"},
        {"label": "Limpadores Multiuso","value": "Limpadores Multiuso"},
        {"label": "Esponjas","value": "Esponjas"},
        {"label": "Vassouras","value": "Vassouras"},
        {"label": "Baldes","value": "Baldes"},
        {"label": "Panos de Limpeza","value": "Panos de Limpeza"},
        {"label": "Papel Higiênico","value": "Papel Higiênico"},
        {"label": "Papel Toalha","value": "Papel Toalha"},
        {"label": "Guardanapos","value": "Guardanapos"},
        {"label": "Sacos de Lixo","value": "Sacos de Lixo"}
      ]
    },
    {
      "label": "Bebês e Crianças",
      "value": "BC",
      "items": [
        {"label": "Fraldas","value": "Fraldas"},
        {"label": "Lenços Umedecidos","value": "Lenços Umedecidos"},
        {"label": "Cremes para Assaduras","value": "Cremes para Assaduras"},
        {"label": "Fórmulas","value": "Fórmulas"},
        {"label": "Papinhas","value": "Papinhas"},
        {"label": "Cereais Infantis","value": "Cereais Infantis"},
        {"label": "Brinquedos Educativos","value": "Brinquedos Educativos"},
        {"label": "Jogos","value": "Jogos"},
        {"label": "Pelúcias","value": "Pelúcias"}
      ]
    },
    {
      "label": "Artigos de Papelaria e Escritório",
      "value": "APE",
      "items": [
        {"label": "Mochilas","value": "Mochilas"},
        {"label": "Estojos","value": "Estojos"},
        {"label": "Réguas","value": "Réguas"},
        {"label": "Borrachas","value": "Borrachas"},
        {"label": "Canetas","value": "Canetas"},
        {"label": "Lápis","value": "Lápis"},
        {"label": "Cadernos","value": "Cadernos"},
        {"label": "Folhas de Papel","value": "Folhas de Papel"},
        {"label": "Envelopes","value": "Envelopes"}
      ]
    }
  ];

  constructor(
    private _formBuilder: FormBuilder,
    private productService: ProductService,
    private toastr: ToastrService,
    private activateRoute: ActivatedRoute,
    private router: Router
  ) {
      this.paramsID = this.activateRoute.snapshot.params["id"];
      const navigation = this.router.getCurrentNavigation();
 
      this.receivedData = navigation?.extras.state?.['data']

  }

  ngOnInit(): void { 
    

    if (this.receivedData!=undefined) {
      this.createProductForm(this.receivedData);
    }else{
      this.createProductForm();
    }

  }

  createProductForm(data?: any) {
    this.productForm = this._formBuilder.group({
      productName: [data?.productName || "", [Validators.required]],
      productCode: [data?.productCode || "", [Validators.required]],
      salePrice: [data?.salePrice || "", Validators.required],
      costPrice: [data?.costPrice || "", Validators.required],
      taxes: [data?.taxes || "", [Validators.required, this.integerValidator]],
      quantityInStock: [data?.quantityInStock || "", Validators.required],
      minimumStock: [data?.minimumStock || "", Validators.required],
      maximumStock: [data?.maximumStock || "", Validators.required],
      onTheShelf: [data?.onTheShelf || ""],
      expirationDate: [data?.expirationDate ? this.formatDate(data.expirationDate) : "", Validators.required],
      manufacturingDate: [data?.manufacturingDate ? this.formatDate(data.manufacturingDate) : "", Validators.required],
      category: [data?.category || "", Validators.required],
    });
  }

  calculateStock(){
    if (this.productForm.value.onTheShelf <= this.productForm.value.quantityInStock) {
      this.productForm.value.quantityInStock -= this.productForm.value.onTheShelf
    }else{
      this.productForm.value.onTheShelf = 0
    }
  }

  formatDate(date: string): string {
    const d = new Date(`${date}`);
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);

    return `${d.getFullYear()}-${month}-${day}`;
  }

  integerValidator(control: FormControl): { [key: string]: boolean } | null {
    if (Number.isInteger(control.value)) {
      return null;
    }
    return { 'integer': true };
  }

  validateDateRange(startDate: Date, endDate: Date): boolean {
    const currentDate = new Date();
    return startDate <= currentDate && startDate <= endDate && endDate > currentDate;
  }

  rangeValidateProduct: boolean = false

  onSubmit() {

    if (this.paramsID) {

      this.updateProduct(this.paramsID)
      
    }else{

      if (this.productForm.valid) {
        const product: Product = this.productForm.value;

        const startDate1 = new Date(product.manufacturingDate);
        const endDate1 = new Date(product.expirationDate);

        this.rangeValidateProduct = this.validateDateRange(startDate1,endDate1)

        if (this.rangeValidateProduct) {

          product.manufacturingDate = new Date(product.manufacturingDate)
          product.expirationDate = new Date(product.expirationDate)

          this.productService.addProduct(product).then(() => {
            this.toastr.success("Produto adicionado com sucesso!", "", {
              timeOut: 5000,
              progressBar: true,
              progressAnimation: "increasing",
            });

            this.createProductForm()

          }).catch(() => {
            this.toastr.error("Produto não adicionado!", "", {
              timeOut: 5000,
              progressBar: true,
              progressAnimation: "increasing",
            });
          });
        }else{
            this.toastr.warning("Preencha correctamente as datas de fabricação e validade!", "", {
              timeOut: 5000,
              progressBar: true,
              progressAnimation: "increasing",
            });
        }

      }else{
            this.toastr.warning("Preencha correctamente os campos!", "", {
              timeOut: 5000,
              progressBar: true,
              progressAnimation: "increasing",
            });
      }

    }
  }

  updateProduct(productId: string) {
    if (this.productForm.valid) {
      const product: Product = this.productForm.value;
      product.manufacturingDate = new Date(product.manufacturingDate)
      product.expirationDate = new Date(product.expirationDate)

      this.productService.updateProduct(productId, product).then(() => {

        this.toastr.success("Produto atualizado com sucesso!", "", {
          timeOut: 5000,
          progressBar: true,
          progressAnimation: "increasing",
        });

        this.createProductForm()
        this.router.navigate(["product/list"])

      }).catch(() => {
          this.toastr.warning("Preencha correctamente os campos!", "", {
            timeOut: 5000,
            progressBar: true,
            progressAnimation: "increasing",
          });
      });
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

  getProducts() {
    this.productService.getProducts().subscribe((products) => {
      // console.log('Products: ', products);
    });
  }

}
