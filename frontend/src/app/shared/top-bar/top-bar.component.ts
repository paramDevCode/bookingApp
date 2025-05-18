import { Component, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.scss'
})
export class TopBarComponent {
  pageTitle:string = '';
  @Output() toggleSidebar = new EventEmitter<void>();

  constructor(private router: Router, private route:ActivatedRoute){
     this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => {
        let child = this.route.firstChild;
        while (child?.firstChild) {
          child = child.firstChild;
        }
        return child?.snapshot.data['title'] || 'Default Title';
      })
    ).subscribe(title => {
      this.pageTitle = title;
    });
  }
  
  goToProfile() {
    this.router.navigate(['/profile']);
  }
}
