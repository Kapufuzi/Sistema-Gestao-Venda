export interface Product {
  id?: string;
  productName: string;
  productCode: string;
  salePrice: number;
  costPrice: number;
  taxes: number;
  quantityInStock: number;
  onTheShelf: number;
  minimumStock: number;
  maximumStock: number;
  expirationDate: Date;
  manufacturingDate: Date;
  category: string;
}
