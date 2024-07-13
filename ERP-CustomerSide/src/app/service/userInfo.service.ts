import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class userInfoService {
  private userSource = new BehaviorSubject<any>(null);
  currentUser = this.userSource.asObservable();

  constructor() { }

  setUser(user: any) {
    this.userSource.next(user);
  }
}
