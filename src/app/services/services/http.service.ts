import { Injectable } from '@angular/core';
import { of, throwError, Observable } from 'rxjs';
import { delay, mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class HttpService {

  getData(ingredients: string[]): Observable<any> {
    return of(null).pipe(
      delay(2000), 
      mergeMap(() => {
        const isSuccess = Math.random() > 0.5; 
        if (isSuccess) {
          return of({
            data: ingredients, // Return the passed ingredients
          });
        } else {
          return throwError(() => new Error('Random error occurred'));
        }
      })
    );
  }
}
