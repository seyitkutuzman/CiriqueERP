import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { boUserService } from './backOfficeUser.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private userService: boUserService, private router: Router) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const currentUser = this.userService.currentUserValue;
        if (currentUser && currentUser.token) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${currentUser.token}`
                }
            });
        }

        return next.handle(request).pipe(
            catchError((err: HttpErrorResponse) => {
                if (err.status === 401 || err.status === 403) {
                    // Token süresi geçmiş veya yetkisiz erişim
                    this.userService.logout();
                    this.router.navigate(['/login']);
                }
                return throwError(err);
            })
        );
    }
}
