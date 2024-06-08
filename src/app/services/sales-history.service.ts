import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, query, where } from '@angular/fire/firestore';
import { SalesHistory } from '../models/sales-history.model';
import { Observable, map } from 'rxjs';


interface Product {
  id: string;
  productName: string;
  productCode: string;
  quantity: number;
  salePrice: number;
}


@Injectable({
  providedIn: 'root'
})
export class SalesHistoryService {

  constructor(private firestore: Firestore) {}

  async addSale(sale: SalesHistory): Promise<void> {
    const salesCollection = collection(this.firestore, 'salesHistory');
    await addDoc(salesCollection, sale);
  }

  getSalesHistory(): Observable<SalesHistory[]> {
    const salesCollection = collection(this.firestore, 'salesHistory');
    return collectionData(salesCollection, { idField: 'id' }) as Observable<SalesHistory[]>;
  }


  getVendasDiarias(): Observable<Product[]> {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const amanha = new Date(hoje);
    amanha.setDate(amanha.getDate() + 1);

    const vendasRef = collection(this.firestore, 'salesHistory');
    const q: any = query(vendasRef, where('date', '>=', hoje), where('date', '<', amanha));
    return collectionData<SalesHistory>(q, { idField: 'id' }).pipe(
      map((vendas: SalesHistory[]) => this.aggregateProducts(vendas))
    );
  }

  getVendasMensais(): Observable<Product[]> {
    const inicioDoMes = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const proximoMes = new Date(inicioDoMes);
    proximoMes.setMonth(proximoMes.getMonth() + 1);

    const vendasRef = collection(this.firestore, 'salesHistory');
    const q: any = query(vendasRef, where('date', '>=', inicioDoMes), where('date', '<', proximoMes));
    return collectionData<SalesHistory>(q, { idField: 'id' }).pipe(
      map((vendas: SalesHistory[]) => this.aggregateProducts(vendas))
    );
  }

  getTotalMensal(): Observable<number> {
    const inicioDoMes = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const proximoMes = new Date(inicioDoMes);
    proximoMes.setMonth(proximoMes.getMonth() + 1);

    const vendasRef = collection(this.firestore, 'salesHistory');
    const q: any = query(vendasRef, where('date', '>=', inicioDoMes), where('date', '<', proximoMes));
    return collectionData<SalesHistory>(q, { idField: 'id' }).pipe(
      map((vendas: SalesHistory[]) => vendas.reduce((total, venda) => total + venda.price, 0))
    );
  }

  private aggregateProducts(vendas: SalesHistory[]): Product[] {
    const productMap = new Map<string, Product>();

    vendas.forEach((venda: any) => {
      venda.product.forEach((prod: any) => {
        if (productMap.has(prod.id)) {
          let existingProduct: any = productMap.get(prod.id);
          existingProduct.quantity += prod.quantity;
        } else {
          productMap.set(prod.id, { ...prod });
        }
      });
    });

    return Array.from(productMap.values());
  }
  
}
