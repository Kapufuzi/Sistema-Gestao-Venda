import { Injectable } from '@angular/core';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private firestore: Firestore) { }

  async getUserById(userId: string): Promise<any | null> {
    const ref = doc(this.firestore, 'user', `${userId}`);
    const docSnapshot = await getDoc(ref);

    if (docSnapshot.exists()) {
      const user = docSnapshot.data() as any;
      return { ...user, id: docSnapshot.id };
    } else {
      return null;
    }
  }

}
