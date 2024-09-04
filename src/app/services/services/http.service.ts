import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  getData(): Observable<any> {
    // Simulate an HTTP request with random success/failure
    const success = Math.random() > 0.5;

    if (success) {
      return of({ data: 'Success' }).pipe(delay(1000)); // Simulate network latency
    } else {
      return throwError(() => new Error('Failed request')).pipe(delay(1000));
    }
  }
}
