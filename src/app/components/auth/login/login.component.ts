import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SpeedDialModule } from 'primeng/speeddial';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../../services/auth/auth.service';
import { isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs';
import { UserService } from '../../../services/user/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
            FormsModule, 
            ReactiveFormsModule, 
            SpeedDialModule, 
            ToastModule, 
            CardModule, 
            InputTextModule, 
            CalendarModule, 
            PasswordModule,
            ButtonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  private subscriptions: Subscription[] = [];

  constructor(
              private _formBuilder: FormBuilder,
              private _auth: AuthService,
              @Inject(PLATFORM_ID) private platformId: Object,
              private _userService: UserService,
              private _router: Router
             ){}

  ngOnInit(): void {
    this.createForm()
  }

  createForm(){
    this.loginForm = this._formBuilder.group({
      email: ["",[Validators.required, Validators.email] ],
      password: ["", Validators.required ],
     });
  }

  loginWithEmailPassword(){
    
    this._auth.loginWithEmailPassWord(this.loginForm.value).then((res:any) => {
      if(res.user["emailVerified"] == false){
        this._auth.sendEmailVerification().then(() =>{
          console.log(
            `O seu endereço email ${res.user['email']}  ainda não foi confirmado.\n
             Por favor,  consulte o seu email e confirme o endereço. \n
             Caso não apareça, verifique a pasta de SPAM ou consulte o seu administrador de sistemas. `,
             "info",
             4000
          );
          // this.logIn = false;
          this._auth.signOut();
        })
      }else{
        this.enteringTheSystem();
      }
    })
  }

  enteringTheSystem(){
    if (isPlatformBrowser(this.platformId)) {
      this.subscriptions.push(
        this._auth.isUserLoggedIn().subscribe(user =>{
            this._userService.getUserById(user?.uid).then((User:any | null) =>{
              if(User){
                this._router.navigate(['/'])
              } else{
                console.log(
                  `Não existe nenhuma conta criada no nosso sistema com este email. \n
                  Por favor crie uma ou contacte o seu Administrador de sitema`,
                  "info",
                  5000
                );
                // this.logIn = false;
                this._auth.signOut();
              }

            });
        })
      );
    }
  }

}
