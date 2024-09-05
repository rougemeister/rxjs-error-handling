import { Component } from '@angular/core';
import { HttpService } from '../../services/services/http.service';
import { catchError, retryWhen, scan, delayWhen, tap } from 'rxjs/operators';
import { of, timer } from 'rxjs';
import { CommonModule } from '@angular/common'; // Import CommonModule for ngIf, ngFor

@Component({
  selector: 'app-data-display',
  standalone: true,
  imports: [CommonModule], // Import CommonModule for template directives
  templateUrl: './data-display.component.html',
  styleUrls: ['./data-display.component.scss'] // Corrected to styleUrls (plural)
})
export class DataDisplayComponent {
  data: any;
  fallBackArr = [ "2 cups rice (long-grain parboiled or basmati)", 
    "4-5 medium tomatoes, chopped (or 1 can of diced tomatoes)"]
  loading = false;
  error: string | null = null;

  jollofRiceIngredients = [
    "2 cups rice (long-grain parboiled or basmati)",
    "4-5 medium tomatoes, chopped (or 1 can of diced tomatoes)",
    "1/4 cup tomato paste",
    "2 red bell peppers, chopped",
    "1 large onion, chopped",
    "2-3 cups chicken or vegetable stock"
  ];

  constructor(private httpService: HttpService) {}

  fetchData() {
    this.loading = true;
    this.error = null;
  
    this.httpService.getData(this.jollofRiceIngredients) 
    .pipe(
      tap(() => console.log('Request initiated')),  
      retryWhen(errors =>
        errors.pipe(
          scan((retryCount, err) => {
            if (retryCount >= 3) {
              throw err;
            }
            console.log(`Retry attempt ${retryCount + 1}`);
            return retryCount + 1;
          }, 0),
          delayWhen(retryCount => timer(Math.pow(2, retryCount) * 1000))
        )
      ),
      catchError(err => {
        console.error('Handling error:', err);
        this.error = 'Request failed after multiple retries.';
        return of({ data: this.fallBackArr }); 
      }),
      tap(data => console.log('Received data:', data))  
    )
    .subscribe({
      next: (response) => {
        this.data = response.data;
        this.loading = false;  
      },
      error: (err) => {
        this.error = err.message;  
        this.loading = false; 
      }
    });
  
  }
  
}
