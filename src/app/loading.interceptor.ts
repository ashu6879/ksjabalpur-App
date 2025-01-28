import { HttpInterceptorFn } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoadingService } from '../loading.service';
import { constructor } from 'jasmine';

@Injectable()

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req);

  constructor(private loadingService: LoadingService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.loadingService.presentLoading();
    return next.handle(req).pipe(
      finalize(() => this.loadingService.dismissLoading())
    );
  }

};