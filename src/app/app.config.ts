import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getAnalytics, provideAnalytics, ScreenTrackingService, UserTrackingService } from '@angular/fire/analytics';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { getPerformance, providePerformance } from '@angular/fire/performance';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideToastr } from 'ngx-toastr';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), 
    provideClientHydration(),
    provideToastr(),
    importProvidersFrom(
      provideFirebaseApp(() => initializeApp(
        {
          "projectId":"admin-2a4d2",
          "appId":"1:177918025262:web:5ba9430fcb745b80db09bf",
          "storageBucket":"admin-2a4d2.appspot.com",
          "apiKey":"AIzaSyD-wAyhk7BzY-gO7V4SlAYvoDln_XMmhko",
          "authDomain":"admin-2a4d2.firebaseapp.com",
          "messagingSenderId":"177918025262",
          "measurementId":"G-4XEPEF50WP"
        }
      ))
    ), 
    importProvidersFrom(
      provideAuth(() => getAuth())
    ), 
    importProvidersFrom(
      provideAnalytics(() => getAnalytics())
    ), 
    ScreenTrackingService, 
    UserTrackingService, 
    importProvidersFrom(
      provideFirestore(() => getFirestore())
    ), 
    importProvidersFrom(
      provideDatabase(() => getDatabase())
    ), 
    importProvidersFrom(
      providePerformance(() => getPerformance())
    ), 
    importProvidersFrom(
      provideStorage(() => getStorage())
    ), 
    provideAnimationsAsync()
  ]
};
