import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, collectionData } from '@angular/fire/firestore';
import { SalesHistory } from '../models/sales-history.model';
import { Observable } from 'rxjs';

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
  
}
