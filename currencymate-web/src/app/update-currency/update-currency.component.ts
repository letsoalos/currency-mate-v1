import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CurrencyRateDto } from '../core/data/currency-data';
import { AppService } from '../core/service/app.service';

@Component({
  selector: 'app-update-currency',
  templateUrl: './update-currency.component.html',
  styleUrls: ['./update-currency.component.scss']
})
export class UpdateCurrencyComponent implements OnInit {
  
  form: FormGroup;
  model: any;
  userAction?: string;
  baseCode: string;
  conversionRates: { [key: string]: number };
  fromCurrency: string = 'ZAR';
  toCurrency: string;
  conversionRate: number;
  currencyName: string = '';
  currencies: any | [] = [];
  savePayload: any | [] = [];
  noCurrency: boolean = false;  

  @Output() updateModel = new EventEmitter<any>();

  constructor(private fb: FormBuilder,
      private bsModelRef: BsModalRef,
      private appService: AppService) {}

  ngOnInit(): void {
    this.getAllCurrencies();
    this.getForm();
    this.form.setValue({
      id: this.model.id,
      sourceCurrent: ['ZAR'],
      destinationCurrency: this.model.name,
      amount: this.model.exchangeRateToZAR,
      currencyName: this.model.name
    });

    this.formControls.destinationCurrency.valueChanges.subscribe(() => {
      this.formControls.amount.setValue(null);
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
    this.noCurrency = true;
    this.appService.getCurrencies().subscribe({
      next: (res: any) => {
        this.currencies = res;
        if(this.currencies.length > 0) this.noCurrency = false;
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
          this.savePayload = {
            id: this.model.id,
            exchangeRateToZAR: this.conversionRate,
            name: destinationCurrency,
            code: destinationCurrency
          }
        },
        error: (err) => console.log(err)
      })
    } else {
      console.log('We expecting value from current destination and source currency');
    }
  }

  saveCurrencyRate(data: CurrencyRateDto) {
    this.appService.saveCurrencyRate(data).subscribe({
      next: (res) => {
        this.getCurrencies();
      },
      error: (err) => console.log(err)
    })
  }

  getForm(): any {
    this.form = this.fb.group({
      id: this.model.id,
      sourceCurrent: ['ZAR'],
      destinationCurrency: [''],
      amount:[''],
      currencyName: ['']
    });
  }

  onSubmit(): void {
    this.updateModel.emit(this.savePayload)
    this.bsModelRef.hide();
  }

  closeModal(): void {
    this.bsModelRef.hide();
  }

}
