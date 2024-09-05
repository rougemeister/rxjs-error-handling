import { TestBed } from '@angular/core/testing';
import { DataDisplayComponent } from './data-display.component';
import { HttpService } from '../../services/services/http.service';
import { of, throwError } from 'rxjs';

describe('DataDisplayComponent', () => {
  let component: DataDisplayComponent;
  let httpService: HttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DataDisplayComponent],
      providers: [{ provide: HttpService, useValue: { getData: jest.fn() } }]
    });

    component = TestBed.createComponent(DataDisplayComponent).componentInstance;
    httpService = TestBed.inject(HttpService);
  });

  it('should handle successful data fetch', () => {
    jest.spyOn(httpService, 'getData').mockReturnValue(of({ data: 'Success' }));
    component.fetchData();
    expect(component.data).toBe('Success');
  });

  it('should handle errors with retry and fallback', () => {
    jest.spyOn(httpService, 'getData').mockReturnValue(throwError(() => new Error('Failed request')));
    component.fetchData();
    expect(component.error).toBe('Request failed after multiple retries.');
    expect(component.data).toBe('Fallback data');
  });
});
