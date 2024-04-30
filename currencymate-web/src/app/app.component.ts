import { Component, OnInit } from '@angular/core';
import { AppService } from './core/service/app.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CurrencyRateDto } from './core/data/currency-data';
import { CurrencyDto } from './shared/models/currency';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  baseCode: string;
  conversionRates: { [key: string]: number };
  form: FormGroup;
  fromCurrency: string = 'ZAR';
  toCurrency: string;
  conversionRate: number;
  currencyName: string = '';
  currencies: any | [] = [];

  constructor(private appService: AppService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.getAllCurrencies();
    this.getCurrencies();
    this.getForm();
  }

  getForm(): any {
    this.form = this.fb.group({
      sourceCurrent:[''],
      destinationCurrency:[''],
      amount:[''],
      currencyName:['']
    });
  }

  getAllCurrencies() {
    this.appService.getAllCurrencies().subscribe({
      next: (res: any) => {
        if (res && typeof res === 'object') {
          this.baseCode = res.base_code;
          this.conversionRates = res.conversion_rates;
        }
      },
      error: (err) => console.log(err)
    })
  }

  getCurrencies() {
    this.appService.getCurrencies().subscribe({
      next: (res: any) => {
        this.currencies = res;
      },
      error: (err) => console.log(err)
    })
  }

  get formControls(): any { return this.form.controls; }

  convertCurrency() {
    const destinationCurrency = this.formControls.destinationCurrency.value;
    const sourceCurrency = this.formControls.sourceCurrent.value;
    this.currencyName = this.formControls.destinationCurrency.value;

    if (destinationCurrency && sourceCurrency) {
      this.appService.getCurrencyRate(sourceCurrency, destinationCurrency).subscribe({
        next: (res) => {
          this.conversionRate = res.conversion_rate;
          const savePayload: CurrencyRateDto = {
            exchangeRateToZAR: this.conversionRate,
            name: destinationCurrency,
            code: sourceCurrency
          }
          this.saveCurrencyRate(savePayload);
        },
        error: (err) => console.log(err)
      })
    } else {
      console.log('We expecting value from current destination and source currency');
    }
  }

  saveCurrencyRate(data: CurrencyRateDto) {
    this.appService.saveCurrencyRate(data).subscribe({
      next: (res) => console.log('success', res),
      error: (err) => console.log(err)
    })
  }

}
