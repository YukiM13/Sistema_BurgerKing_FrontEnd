import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private sessionChange = new BehaviorSubject<boolean>(false);
  sessionChange$ = this.sessionChange.asObservable();

  notifySessionChange() {
    this.sessionChange.next(true);
  }
}