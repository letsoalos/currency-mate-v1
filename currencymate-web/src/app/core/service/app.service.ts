import { Injectable } from '@angular/core';
import { environment } from 'src/app/environment/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  baseUrl = 'https://localhost:5001/api/currencies';

  constructor(private http: HttpClient) { }

  getAllCurrencies() {
    return this.http.get(`${this.baseUrl}/get-currencies-by-api`);
  }

  getCurrencyRate(fromCurrency: string, toCurrency: string): Observable<any> {
    const url = `${this.baseUrl}/get-currency-rate/${fromCurrency}/${toCurrency}`;
    return this.http.get<any>(url);
  }
  
}
