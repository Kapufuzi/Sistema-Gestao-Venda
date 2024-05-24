import { PLATFORM_ID, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { isPlatformBrowser } from '@angular/common';

export const alreadyAuthenticatedGuard: CanActivateFn = (route, state) => {
  const _authService = inject(AuthService);
  const platformId = inject(PLATFORM_ID);
  const _router = inject(Router);

   if (isPlatformBrowser(platformId)) {
    if (_authService.isLoggedIn) {
      // _messageService.messageAlert(
      //   "Sessão iniciada no nosso sistema",
      //   "warning",
      //   2000
      // );
      // _navigateToPage.navigateToPage('/');
      _router.navigate(['/'])
    }
  }

  return true;
};
