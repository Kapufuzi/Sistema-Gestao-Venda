import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { SplitterModule } from 'primeng/splitter';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { SplitButtonModule } from 'primeng/splitbutton';
import { AvatarModule } from 'primeng/avatar';
import { MatListModule } from '@angular/material/list';
import { TreeModule } from 'primeng/tree';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../../services/auth/auth.service';
import { UserService } from '../../../services/user/user.service';
import { isPlatformBrowser } from '@angular/common';
import { Subscription, map } from 'rxjs';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-root-nav',
  standalone: true,
  imports: [
            SplitterModule, 
            MatSidenavModule, 
            MatButtonModule,
            RouterLink,
            RouterOutlet,
            MenubarModule,
            ToolbarModule,
            ButtonModule,
            SplitButtonModule,
            AvatarModule,
            MatListModule,
            TreeModule,
            MatMenuModule,
            MatIconModule
  ],
  templateUrl: './root-nav.component.html',
  styleUrl: './root-nav.component.css'
})
export class RootNavComponent implements OnInit, OnDestroy {
  $userLogged: any
  private allSubscriptions: Subscription[] = [];
  dataUser: any

  constructor(
              private _authService: AuthService,
              @Inject(PLATFORM_ID) private platformId:Object,
              private _userService: UserService,
            ){}
  
  ngOnInit() {
    this.getUserLogged()
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
    
  logout(){
    this._authService.signOut();
  }

  ngOnDestroy(): void {
    this.allSubscriptions.forEach((subscription) => subscription.unsubscribe());
  }

}
