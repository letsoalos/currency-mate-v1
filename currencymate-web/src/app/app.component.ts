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

    this.formControls.destinationCurrency.valuesChanges.subscribe(() => {
      console.log('From Currency:', this.formControls.sourceCurrency.value);
      console.log('To Currency:', this.formControls.destinationCurrency.value);
  
      const dCurrency = this.formControls.destinationCurrency.value;
      if (dCurrency) {
        this.convertCurrency();
      }
    });
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
    this.appService.getAllCurrencies().subscribe((res: any) => {
      console.log('response', res); 
      if (res && typeof res === 'object') {
        this.baseCode = res.base_code;
        this.conversionRates = res.conversion_rates; 
      }     
    }, error => {
      console.error(error);
    });
  }

  get formControls(): any { return this.form.controls; }

  onSubmit(): void {
    console.log('Form:', this.form.value);
  }

  // convertCurrency() {
  //   console.log('From Currency:', this.fromCurrency);
  //   console.log('To Currency:', this.toCurrency);   
  //   this.currencyName = this.toCurrency.toString();
  //   console.log(this.currencyName);
  //   // Call your service method with this.fromCurrency and this.toCurrency
  //   this.appService.getCurrencyRate(this.fromCurrency, this.toCurrency).subscribe((currencyRate: any) => {
  //     console.log('Currency rate:', currencyRate);
  //     this.conversionRate = currencyRate.conversion_rate; // Store the conversion rate
     
  //   }, error => {
  //     console.error('Error converting currency:', error);
  //   });
  // }

  convertCurrency() {
    console.log('From Currency:', this.formControls.sourceCurrency.value);
    console.log('To Currency:', this.formControls.destinationCurrency.value);
  
    this.currencyName = this.formControls.sourceCurrency.value;
      console.log(this.currencyName);
  
      // Call your service method with this.fromCurrency and this.toCurrency
      this.appService.getCurrencyRate(this.formControls.destinationCurrency.value, this.formControls.sourceCurrency.value).subscribe(
        (currencyRate: any) => {
          console.log('Currency rate:', currencyRate);
          this.conversionRate = currencyRate.conversion_rate; // Store the conversion rate
        },
        error => {
          console.error('Error converting currency:', error);
        }
      );
  }
  

}
