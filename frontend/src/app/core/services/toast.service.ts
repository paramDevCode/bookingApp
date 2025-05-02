import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Toast{
message:string;
type: 'success' | 'error' | 'info' | 'warning';
title?:string;
duration?:number
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
private toastSubject = new Subject<Toast | null>();
toast$ = this.toastSubject.asObservable();
  constructor() { }

  showToast(toast:Toast){
    const duration = toast.duration || 3000
    this.toastSubject.next(toast);
    setTimeout(() => this.toastSubject.next(null), duration); // Automatically hide the toast after the specified duration

  }
}
