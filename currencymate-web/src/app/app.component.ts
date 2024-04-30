import { Component, OnInit } from '@angular/core';
import { AppService } from './core/service/app.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  baseCode: string;
  conversionRates: { [key: string]: number };
  form: FormGroup;
  fromCurrency: string = 'ZAR'; // Default value
  toCurrency: string;
  conversionRate: number; // Property to store the conversion rate
  currencyName: string = '';


  constructor(private appService: AppService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.getAllCurrencies();
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
        console.log('response', res);
        if (res && typeof res === 'object') {
          this.baseCode = res.base_code;
          this.conversionRates = res.conversion_rates;
        }
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
          console.log('Amount', this.conversionRate)
          console.log('currency Name', this.formControls.destinationCurrency.value)
        },
        error: (err) => console.log(err)
      })
    } else {
      console.log('We expecting value from current destination and source currency');
    }
  }

  onSubmit(): void {
    console.log('Form:', this.form.value);
  }

}
