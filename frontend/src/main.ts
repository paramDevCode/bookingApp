import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { AuthService } from './app/core/services/auth.service';
import { APP_INITIALIZER } from '@angular/core';
import { firstValueFrom } from 'rxjs';

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    // keep your existing providers
    ...(appConfig.providers ?? []),

    // run AuthService.initAuth() before anything else
    {
      provide: APP_INITIALIZER,
      useFactory: (authService: AuthService) => {
        return () => firstValueFrom(authService.initAuth());
      },
      deps: [AuthService],
      multi: true
    }
  ]
}).catch(err => console.error(err));
