import { Component, inject} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';


import { RouterOutlet } from '@angular/router';
import { ToastComponent } from './shared/toast/toast.component';
import { CommonModule } from '@angular/common';
import { AuthService } from './core/services/auth.service';
import { TopBarComponent } from './shared/top-bar/top-bar.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { BottomNavComponent } from './shared/bottom-nav/bottom-nav.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,ToastComponent, CommonModule, TopBarComponent, SidebarComponent, BottomNavComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  sidebarOpen = false;

  title = 'frontend';
  authService = inject(AuthService);
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  async ngOnInit() {
    // Call initAuth to check token and perform any necessary loading
    await this.authService.initAuth().toPromise();
    // After loading and authentication check, remove the initial loader
    // Only run this in the browser
  if (isPlatformBrowser(this.platformId)) {
    const loader = document.getElementById('initial-loader');
    if (loader) {
      loader.remove();
    }
  }
  }
}
