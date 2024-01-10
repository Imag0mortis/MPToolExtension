import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, first } from 'rxjs';
import { RequestService } from './request.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public userSubj$: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(private request: RequestService, private router: Router) {}

  set setUserSubj(arg: any) {
    this.userSubj$.next(arg);
  }

}
