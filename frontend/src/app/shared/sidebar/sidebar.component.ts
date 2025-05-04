import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener,
  ElementRef
} from '@angular/core';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  @Input() open = false;
  @Output() closeSidebar = new EventEmitter<void>();

  private xDown: number | null = null;
  private yDown: number | null = null;

  constructor(private eRef: ElementRef) {}

  // Close on outside click (except when clicking inside the sidebar)
  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    const clickedInside = this.eRef.nativeElement.contains(event.target);
    if (this.open && !clickedInside) {
      this.closeSidebar.emit();
    }
  }

  // Start tracking swipe
  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent) {
    this.xDown = event.touches[0].clientX;
    this.yDown = event.touches[0].clientY;
  }

  // Detect swipe left
  @HostListener('touchmove', ['$event'])
  onTouchMove(event: TouchEvent) {
    if (!this.xDown || !this.yDown) return;

    const xUp = event.touches[0].clientX;
    const yUp = event.touches[0].clientY;

    const xDiff = this.xDown - xUp;
    const yDiff = this.yDown - yUp;

    // Detect horizontal swipe more than vertical
    if (Math.abs(xDiff) > Math.abs(yDiff) && xDiff > 50) {
      this.closeSidebar.emit(); // Swipe left closes the sidebar
    }

    // reset values
    this.xDown = null;
    this.yDown = null;
  }
}
