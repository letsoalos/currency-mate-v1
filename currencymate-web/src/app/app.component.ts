import { Component, OnInit } from '@angular/core';
import { AppService } from './core/service/app.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  baseCode: string;
  conversionRates: { [key: string]: number };
  form: FormGroup;

  constructor(private appService: AppService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.getAllCurrencies();
  }

  getAllCurrencies() {
    this.appService.getAllCurrencies().subscribe((res: any) => {
      console.log('response', res); 
      if (res && typeof res === 'object') {
        // Filter base_code
        this.baseCode = Object.keys(res).find(key => key === 'base_code') || '';
        this.conversionRates = res.conversion_rates; 
      }     
    }, error => {
      console.error(error);
    });
  }
  
}
