import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CurrencyRateDto } from '../data/currency-data';

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

  saveCurrencyRate(data: CurrencyRateDto) {
    return this.http.post(`${this.baseUrl}/add-currency`, data);
  }

  updateCurrencyRate(data: CurrencyRateDto) {
    return this.http.post(`${this.baseUrl}/update-currency`, data);
  }

  deleteCurrencyRate(id: number) {
    return this.http.get(`${this.baseUrl}/delete-currency/${id}`);
  }
}
