import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [],
  templateUrl: './bottom-nav.component.html',
  styleUrl: './bottom-nav.component.scss'
})
export class BottomNavComponent {
  constructor( private router: Router,
    ){

  }
 onOrderpage(): void {
    this.router.navigate(['/my-orders']);
  }
   onBookpage(): void {
    this.router.navigate(['/orders']);
  }
}
