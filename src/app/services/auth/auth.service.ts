import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, onAuthStateChanged, sendEmailVerification, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthUser } from '../../components/models/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user:any;

  constructor(
              @Inject(PLATFORM_ID) private platformId: Object,
              private auth: Auth, 
              private router: Router
             ) {
              this.changeAuthState()
             }

  changeAuthState(){
    onAuthStateChanged(this.auth, (user) => {
      if (isPlatformBrowser(this.platformId)) {
        if (user) {
          this.user = user;
          localStorage.setItem("user", JSON.stringify(this.user))
        } else {
          localStorage.setItem("user", 'null')
        }
      }
    });
  }
  
  async creatUserAccount(formValue:any){
    return await createUserWithEmailAndPassword(this.auth, formValue.email, formValue.password);
  }

  async loginWithEmailPassWord(loginForm:any):Promise<any>{
    return await signInWithEmailAndPassword(this.auth,loginForm.email, loginForm.password);
  }

  async signOut() {
    return await signOut(this.auth).then(()=>{
      // this.loggedIn.next(false);
      localStorage.removeItem('user');
      this.router.navigate(['/login']);
    });
  }

  async sendEmailVerification() {
    return await sendEmailVerification(this.user);
 }

  get isLoggedIn(): boolean {
    this.user = JSON.parse(localStorage.getItem('user')!);
    return this.user !== null ? true : false;
  }

  isUserLoggedIn(): Observable<AuthUser | null> {
    try {
      const userString = localStorage.getItem('user');
      if (!userString) {
        return of(null);
      }
      const user = JSON.parse(userString) as AuthUser;
      return of(user);
    } catch (error) {
      console.error('Erro ao recuperar o usuário do localStorage:', error);
      return of(null);
    }
  }

}
