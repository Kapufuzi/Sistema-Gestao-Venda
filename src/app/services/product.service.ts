import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc, query, updateDoc, where } from '@angular/fire/firestore';
import { Product } from '../models/product.models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private collectionRef: any;

  constructor(private firestore: Firestore) {}

  addProduct(product: Product): Promise<void> {
    this.collectionRef = collection(this.firestore, 'product');
    return addDoc(this.collectionRef, product).then(() => {}) as Promise<void>;
  }

  updateProduct(productId: string, product: Product): Promise<void> {
    const productDocRef = doc(this.firestore, 'product', productId);
    return updateDoc(productDocRef, { ...product }) as Promise<void>;
  }

  deleteProduct(productId: string): Promise<void> {
    const productDocRef = doc(this.firestore, `product/${productId}`);
    return deleteDoc(productDocRef) as Promise<void>;
  }

  getProducts(): Observable<Product[]> {
    const currentDate = new Date();

    const collectionRefx = collection(this.firestore, 'product');
    const queryRef = query(collectionRefx, where('expirationDate', '>', currentDate));
    return collectionData(queryRef, { idField: 'id' }) as Observable<Product[]>;

  }
}
