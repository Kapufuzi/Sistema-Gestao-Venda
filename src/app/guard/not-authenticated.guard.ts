import { PLATFORM_ID, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { isPlatformBrowser } from '@angular/common';

export const notAuthenticatedGuard: CanActivateFn = (route, state) => {
  const _authService = inject(AuthService);
  const platformId = inject(PLATFORM_ID);
  if (isPlatformBrowser(platformId)) {
    if(!_authService.isLoggedIn){
      return redirectUser();
    }
  }
  return true;
};

const redirectUser = () =>{
  const _router = inject(Router);
  // const _messageService = inject(AlertMessageService);
  // const _navigateToPage = inject(NavigateToPageService);
  setTimeout(()=>{
    // _messageService.messageAlert(
    //   "Sem sessão iniciada no sistema.\n Por favor faça o login!",
    //   "warning",
    //   2000
    // )
    // _navigateToPage.navigateToPage('/login')
    _router.navigate(['/login'])

  },600)
  return false
}
